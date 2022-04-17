'use strict'

const path = require('path')
const { readFile } = require('fs/promises')
const decode = require('image-decode')

module.exports = domcolor

/**
 * Determines the dominant color in an image
 * @param {String|Buffer} img Image buffer or string path to image
 * @returns {Object} dominant color data
 */
async function domcolor (img) {
  if (img == null) {
    throw new Error('Error: img is a required parameter')
  }

  if (typeof img === 'string') {
    const filename = path.basename(img)
    validateFileType(filename)
  }

  const imgSrc =
  img.constructor.name === 'Buffer' ? img : await readFile(img)
  const srcData = decode(imgSrc)

  if (!srcData?.data) {
    throw new Error('Error: Invalid image source; unable to decode')
  }

  const { data } = srcData

  const COLOR_MAP = {}
  for (let i = 0; i < data.length; i += 4) {
    /* don't count trasparent pixels, it's boring */
    if (data[i + 3] === 0) continue

    const color = `${data[i + 0]}+${data[i + 1]}+${data[i + 2]}`
    if (COLOR_MAP[color]) COLOR_MAP[color] = COLOR_MAP[color] + 1
    else COLOR_MAP[color] = 1
  }

  const colorKeys = Object.keys(COLOR_MAP)

  // nothing to sort
  if (!colorKeys?.length) return

  const _rgb = colorKeys.reduce((f, g) =>
    COLOR_MAP[f] > COLOR_MAP[g] ? f : g
  )

  const rgb = _rgb.split('+').map(e => +e)
  const hex = toHex(rgb)
  const count = COLOR_MAP[_rgb]
  const total = Math.round(data.length / 4)

  return { rgb, hex, count, total }

  function toHex (rgb) {
    rgb = rgb.map(e => e.toString(16))
    rgb = rgb.map(e => (e.length > 1 ? '' : '0') + e)
    return `${rgb.join('')}`
  }
}

const validateFileType = (filename) => {
  if (
    !(
      filename.length < 256 &&
      (/^[\w\-. ]+.jpg$/.test(filename) ||
        /^[\w\-. ]+.jpeg$/.test(filename) ||
        /^[\w\-. ]+.png$/.test(filename) ||
        /^[\w\-. ]+.bmp$/.test(filename) ||
        /^[\w\-. ]+.tiff$/.test(filename) ||
        /^[\w\-. ]+.gif$/.test(filename))
    )
  ) {
    throw new Error(`Error: Invalid filename: ${filename}`)
  }
}
