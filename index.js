'use strict'

const path = require('path')
const { promisify, debuglog } = require('util')
const readFile = promisify(require('fs').readFile)
const decode = require('image-decode')

const debug = debuglog('domcolor')

module.exports = domcolor

async function domcolor (args) {
  if (args == null) {
    debug('args is undefined or null')
    throw new Error('args is a required parameter')
  }

  if (typeof args === 'string') {
    debug('read is string, checking filename')

    const filename = path.basename(args)
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
      throw new Error(`Invalid filename: ${filename} at ${args}`)
    }
  }

  const imgSrc =
    args.constructor.name === 'Buffer' ? args : await readFile(args)
  const srcData = decode(imgSrc)

  if (!srcData) {
    debug('invalid args -- got bad buffer')
    throw new Error('Invalid image source, unable to decode')
  }

  return new Promise((resolve, reject) => {
    const { data } = srcData

    const COLOR_MAP = {}

    for (let i = 0; i < data.length; i += 4) {
      /* don't count trasparent pixels, it's boring */
      if (data[i + 3] === 0) continue

      const color = `${data[i + 0]}+${data[i + 1]}+${data[i + 2]}`
      if (COLOR_MAP[color]) COLOR_MAP[color] = COLOR_MAP[color] + 1
      else COLOR_MAP[color] = 1
    }

    const _rgb = Object.keys(COLOR_MAP).reduce((f, g) =>
      COLOR_MAP[f] > COLOR_MAP[g] ? f : g
    )

    const rgb = _rgb.split('+').map(e => +e)
    const hex = toHex(rgb)
    const count = COLOR_MAP[_rgb]
    const total = Math.round(data.length / 4)

    debug('resolving with data')
    resolve({ rgb, hex, count, total })
  })

  function toHex (rgb) {
    rgb = rgb.map(e => e.toString(16))
    rgb = rgb.map(e => (e.length > 1 ? '' : '0') + e)
    return `#${rgb.join('')}`
  }
}
