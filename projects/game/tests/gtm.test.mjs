import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import { build } from 'vite'

const configFile = fileURLToPath(new URL('../vite.config.mjs', import.meta.url))

async function buildWithId (id) {
  const previous = process.env.VITE_GTM_ID
  process.env.VITE_GTM_ID = id
  try {
    const result = await build({ configFile, logLevel: 'silent', build: { write: false } })
    return result.output.find(asset => asset.fileName === 'index.html').source
  } finally {
    if (previous === undefined) delete process.env.VITE_GTM_ID
    else process.env.VITE_GTM_ID = previous
  }
}

test('builds the GTM script and noscript fallback with the configured ID', async () => {
  const html = await buildWithId('GTM-TEST123')
  const head = html.slice(html.indexOf('<head>'), html.indexOf('</head>'))
  const body = html.slice(html.indexOf('<body>'), html.indexOf('</body>'))
  assert.match(head, /googletagmanager\.com\/gtm\.js\?id=/)
  assert.match(head, /"GTM-TEST123"/)
  assert.match(body, /<noscript>\s*<iframe[^>]+googletagmanager\.com\/ns\.html\?id=GTM-TEST123/)
  const script = head.match(/<script>([\s\S]*?)<\/script>/)[1]
  let inserted
  const firstScript = { parentNode: { insertBefore: element => { inserted = element } } }
  const document = { getElementsByTagName: () => [firstScript], createElement: () => ({}) }
  const window = {}
  runInNewContext(script, { document, window })
  assert.equal(inserted.src, 'https://www.googletagmanager.com/gtm.js?id=GTM-TEST123')
  assert.equal(inserted.async, true)
  assert.equal(window.dataLayer[0].event, 'gtm.js')
})

test('omits GTM and warns if the ID is absent', async () => {
  const warnings = []
  const warn = console.warn
  console.warn = message => warnings.push(message)
  try {
    const html = await buildWithId('')
    assert.doesNotMatch(html, /googletagmanager\.com/)
    assert.ok(warnings.some(message => message.includes('VITE_GTM_ID não configurado')))
  } finally {
    console.warn = warn
  }
})

test('rejects invalid IDs instead of injecting them into HTML', async () => {
  await assert.rejects(buildWithId('GTM-INVALID"><script>'), /VITE_GTM_ID inválido/)
})
