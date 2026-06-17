# MCP Setup

Run these once to connect Claude Code to GitHub, Railway, and Stripe.

## GitHub
```bash
claude mcp add github --transport http https://api.githubcopilot.com/mcp/
```
Needs a Personal Access Token (PAT) with repo permissions.

## Railway
```bash
claude mcp add railway --transport http https://mcp.railway.com
```

## Stripe
```bash
claude mcp add stripe --transport stdio npx -y @stripe/mcp --api-key=YOUR_STRIPE_SECRET_KEY
```
Use a Restricted API Key — only grant the permissions you need.

## After setup
1. Push filedeck repo to GitHub
2. Railway: New Project → Deploy from GitHub repo
3. Set env vars in Railway: CLOUDCONVERT_API_KEY, ANTHROPIC_API_KEY
4. Add custom domain: filedeck.com
5. Wire Stripe for Pro plan payments
