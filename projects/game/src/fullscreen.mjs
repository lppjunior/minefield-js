export const MAX_DIMENSION = 60
const CELL_SIZE = 28

export function getFullscreenSize (width, height) {
  const cols = Math.max(5, Math.floor((width - 11) / CELL_SIZE))
  const rows = Math.max(5, Math.floor((height - 76) / CELL_SIZE))
  const scale = Math.max(1, cols / MAX_DIMENSION, rows / MAX_DIMENSION)

  return {
    cols: Math.max(5, Math.floor(cols / scale)),
    rows: Math.max(5, Math.floor(rows / scale))
  }
}
