# domcolor

Get the dominant color from an image.

## Installation

```sh
npm install domcolor
```

## Usage

```js
const domcolor = require('domcolor')
```

Pass path to image file or image file as a buffer.

```js
const dominantColor = await domcolor('path/to/img.jpg')
// Or
const fromBuffer = await domcolor(imageBuffer)
```

## API

### `domcolor (args)`

- `img`: `<string>` | `<Buffer>` (Required)

  The string path to the source image or the source image in buffer form.

- Returns: `<Object>`

  - `rgb`: `<Array>` color RGB values
  - `hex`: `<string>` color in hex format
  - `count`: `<integer>` the number of pixels are the dominant color
  - `total`: `<integer>` the total number of pixels in the image

## Example

![gopher](https://user-images.githubusercontent.com/15038724/87260970-2f284580-c469-11ea-844b-f0cd5d8b0277.png)

```js
{ rgb: [ 208, 182, 152 ], hex: 'd0b698', count: 23210, total: 65536 }
```

![gopher-color](https://user-images.githubusercontent.com/15038724/87261182-1cfad700-c46a-11ea-9902-0ffe49c1511b.png)

## Contributing

See our guidelines, in [Contributing](https://github.com/mster/domcolor/blob/master/CONTRIBUTING.md).
