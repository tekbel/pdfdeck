import { createHmac } from 'node:crypto'
import { Router } from 'express'
import Stripe from 'stripe'
import { getUserFromRequest } from '../lib/auth.js'
import { getSupabaseAdmin } from '../lib/supabase.js'

const router = Router()
let _stripe
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  return _stripe
}

const COOKIE_NAME = 'pdfdeck_pro'
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}

function signValue(value) {
  const sig = createHmac('sha256', process.env.COOKIE_SECRET).update(value).digest('hex')
  return `${value}.${sig}`
}

function verifyValue(token) {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  const value = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = createHmac('sha256', process.env.COOKIE_SECRET).update(value).digest('hex')
  return sig === expected ? value : null
}

export function isProUser(req) {
  return verifyValue(req.cookies?.[COOKIE_NAME]) === 'pro'
}

// POST /api/stripe/checkout — create a Checkout Session and return the URL
router.post('/checkout', async (req, res) => {
  const base = process.env.CLIENT_URL || req.body?.origin || 'http://localhost:5173'
  const rawNext = req.body?.next || ''
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : ''
  const nextParam = next ? `&next=${encodeURIComponent(next)}` : ''
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${base}/pro/success?session_id={CHECKOUT_SESSION_ID}${nextParam}`,
      cancel_url: `${base}/pricing`,
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err.message)
    res.status(500).json({ error: 'Could not create checkout session.' })
  }
})

// POST /api/stripe/verify-session — verify payment, update DB and issue cookie
router.post('/verify-session', async (req, res) => {
  const { sessionId } = req.body
  if (!sessionId) return res.status(400).json({ error: 'Missing session ID.' })
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid')
      return res.status(402).json({ error: 'Payment not completed.' })

    const secure = process.env.NODE_ENV === 'production'
    res.cookie(COOKIE_NAME, signValue('pro'), { ...COOKIE_OPTS, secure })
    res.cookie('pdfdeck_customer', signValue(session.customer), { ...COOKIE_OPTS, secure })

    // If user is logged in, persist Pro status in DB
    const user = await getUserFromRequest(req)
    if (user) {
      await getSupabaseAdmin().from('pdf_users').update({
        is_pro: true,
        pro_since: new Date().toISOString(),
        stripe_customer_id: session.customer,
      }).eq('id', user.id)
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Verify session error:', err.message)
    res.status(500).json({ error: 'Could not verify session.' })
  }
})

// POST /api/stripe/portal — create a Customer Portal session
router.post('/portal', async (req, res) => {
  // Prefer DB (logged-in user), fall back to cookie
  let customerId = null
  const user = await getUserFromRequest(req)
  if (user?.stripe_customer_id) {
    customerId = user.stripe_customer_id
  } else {
    customerId = verifyValue(req.cookies?.pdfdeck_customer)
  }
  if (!customerId) return res.status(403).json({ error: 'No active subscription found.' })
  const base = process.env.CLIENT_URL || req.body?.origin || 'http://localhost:5173'
  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/pricing`,
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('Portal error:', err.message)
    res.status(500).json({ error: 'Could not open billing portal.' })
  }
})

// POST /api/stripe/webhook — handle Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    console.log('New Pro subscription:', session.customer_email, session.subscription)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    console.log('Subscription cancelled:', sub.customer)
    await getSupabaseAdmin().from('pdf_users')
      .update({ is_pro: false })
      .eq('stripe_customer_id', sub.customer)
  }

  res.json({ received: true })
})

export { router as stripeRouter }
