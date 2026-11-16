import assert from 'node:assert/strict'
import test from 'node:test'
import { getFullscreenSize } from '../src/fullscreen.mjs'

test('fits the board to the viewport while allowing space for the toolbar and footer', () => {
  assert.deepEqual(getFullscreenSize(1280, 720), { cols: 45, rows: 23 })
  assert.deepEqual(getFullscreenSize(320, 240), { cols: 11, rows: 5 })
})

test('preserves the viewport proportions when the board reaches its size limit', () => {
  const wide = getFullscreenSize(3840, 2160)
  assert.deepEqual(wide, { cols: 60, rows: 32 })
  const tall = getFullscreenSize(2160, 3840)
  assert.deepEqual(tall, { cols: 34, rows: 60 })
})
