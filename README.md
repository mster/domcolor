# domcolor

Get the dominant color from an image.

## Installation

```sh
npm install domcolor
```

## Usage

### `domcolor (args)`

- `args`: `<string>` | `<Buffer>` (Required)

  The string path to the source image or the source image in buffer form.

  `args` is a required parameter.

- Returns: `<Object>`

  - `rgb`: `<Array>` color RGB values
  - `hex`: `<string>` color in hex format
  - `count`: `<integer>` the number of pixels are the dominant color
  - `total`: `<integer>` the total number of pixels in the image

## Sample Code

```js
/* example usage */
;(async function whatColor () {
  try {
    let domcolor = require('domcolor')

    let fromPath = await domcolor('/path/to/my/cat_pic.jpg')

    /* OR */

    let imgBuffer = fs.readFileSync('/path/to/my/cat_pic.jpg')
    let fromBuffer = await domcolor(imgBuffer)

    console.log(fromPath, fromBuffer)
  } catch (error) {
    console.error(error)
  }
})()

/* getting hex from file -- condensed */
;(function getBackgroundColor (cb) {
  require('domcolor')(require('fs').readFileSync('/path/to/img.jpeg'))
    .then(cb)
    .catch(console.error)
})(({ hex }) => console.log('hex:', hex))
```

## Example

![gopher](https://user-images.githubusercontent.com/15038724/87260970-2f284580-c469-11ea-844b-f0cd5d8b0277.png)

```js
{ rgb: [ 208, 182, 152 ], hex: '#d0b698', count: 23210, total: 65536 }
```

![gopher-color](https://user-images.githubusercontent.com/15038724/87261182-1cfad700-c46a-11ea-9902-0ffe49c1511b.png)

## Contributing

See our guidelines, in [Contributing](https://github.com/mster/domcolor/blob/master/CONTRIBUTING.md).
