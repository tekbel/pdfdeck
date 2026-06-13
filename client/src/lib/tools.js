// FileDeck tool catalog — Phase 1 launch set.
// Each tool gets its own SEO route at /:slug

export const DECKS = [
  {
    id: 'pdf',
    name: 'PDF Deck',
    tools: [
      { slug: 'pdf-to-word', name: 'PDF to Word', icon: '📄', desc: 'Convert PDF to editable DOCX, layout preserved.', accept: '.pdf', kind: 'convert' },
      { slug: 'word-to-pdf', name: 'Word to PDF', icon: '📝', desc: 'Turn DOC or DOCX into a clean PDF.', accept: '.doc,.docx', kind: 'convert' },
      { slug: 'compress-pdf', name: 'Compress PDF', icon: '🗜️', desc: 'Shrink file size without visible quality loss.', accept: '.pdf', kind: 'compress' },
      { slug: 'merge-pdf', name: 'Merge PDF', icon: '🧩', desc: 'Combine multiple PDFs in the order you choose.', accept: '.pdf', kind: 'merge', multi: true },
      { slug: 'split-pdf', name: 'Split PDF', icon: '✂️', desc: 'Extract pages or split into separate files.', accept: '.pdf', kind: 'split' },
      { slug: 'pdf-to-jpg', name: 'PDF to JPG', icon: '🖼️', desc: 'Save each PDF page as a high-quality image.', accept: '.pdf', kind: 'convert' },
      { slug: 'jpg-to-pdf', name: 'JPG to PDF', icon: '📑', desc: 'Combine images into a single PDF.', accept: '.jpg,.jpeg,.png', kind: 'convert', multi: true },
      { slug: 'pdf-to-excel', name: 'PDF to Excel', icon: '📊', desc: 'Pull tables out of PDFs into editable XLSX.', accept: '.pdf', kind: 'convert' },
    ],
  },
  {
    id: 'image',
    name: 'Image Deck',
    tools: [
      { slug: 'image-converter', name: 'Image Converter', icon: '🔄', desc: 'PNG, JPG, WebP, HEIC, AVIF — convert any to any.', accept: 'image/*', kind: 'convert' },
      { slug: 'compress-image', name: 'Compress Image', icon: '📉', desc: 'Smaller files, same look. Tuned per image.', accept: 'image/*', kind: 'compress', multi: true },
      { slug: 'resize-image', name: 'Resize Image', icon: '📐', desc: 'Exact dimensions or scale by percentage.', accept: 'image/*', kind: 'edit' },
      { slug: 'image-to-pdf', name: 'Image to PDF', icon: '🗂️', desc: 'Turn photos and scans into a tidy PDF.', accept: 'image/*', kind: 'convert', multi: true },
    ],
  },
  {
    id: 'ai',
    name: 'AI Deck',
    ai: true,
    tools: [
      { slug: 'summarize-pdf', name: 'Summarize PDF', icon: '✨', desc: 'Key points from any document in seconds.', accept: '.pdf', kind: 'ai', ai: true },
      { slug: 'chat-with-pdf', name: 'Chat with PDF', icon: '💬', desc: 'Ask your document questions, get cited answers.', accept: '.pdf', kind: 'ai', ai: true },
      { slug: 'extract-data', name: 'Extract Data', icon: '🧾', desc: 'Invoices and tables out of PDFs, into CSV.', accept: '.pdf', kind: 'ai', ai: true },
      { slug: 'ocr-pdf', name: 'OCR PDF', icon: '🔍', desc: 'Make scanned documents searchable and selectable.', accept: '.pdf,image/*', kind: 'ai', ai: true },
    ],
  },
]

export const ALL_TOOLS = DECKS.flatMap(d => d.tools)
export const findTool = slug => ALL_TOOLS.find(t => t.slug === slug)
