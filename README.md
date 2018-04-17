# split-article

A small javascript component, which splits an html content evenly between multiple separate target elements.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SKU7YGXTAS7NN)
[![Build Status](https://travis-ci.org/meszaros-lajos-gyorgy/split-article.svg?branch=master)](https://travis-ci.org/meszaros-lajos-gyorgy/split-article)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The component expects a source element from the DOM, which contains other text
based elements, like divs or paragraphs. The component will split the elements
line by line when necessary, while also making sure, that additional markup
doesn't get lost in the process.

## Installing

### Serving it locally

Install the package locally and add it to your dependency list in package.json (optional)

```npm i split-article --save```

After this the built versions are available in the `node_modules/split-article/dist/` folder

### CDN

*TODO: add CDN*

## API

### splitArticle(config)

Executes the text splitting once. Note: the code executes immediately,
it does not wait for the window object to load, so make sure to only run it
after the given elements are accessible.

### splitArticle.watch(config)

Executes the text splitting once, then watches for the resize event of the window
and re-executes text splitting

## config

A javascript object with the following properties:

**source :** `<html element>`

> Element, which holds all the text, which needs to be sliced

**targets :** `<array of html elements>`

> The component will split the text evenly
between these. it is recommended, that the elements are flexible in width

**width :** *(optional)* `<integer> | unit: number of characters | default: 50`

> The column width specified in number of characters

**speed :** *(optional)* `<integer> | unit: milliseconds | default: 200`

> Throttling for the resize event. The resizing will only occur in the given
interval, relieving the browser from unnecessary load.

**offset :** *(optional)* `<integer> | unit: number of paragraphs | default: 0`

> When placing the elements from the source into the targets, the first N tags
will be skipped. By default, there is no skipping, splitting will start from the
first element. *(see limit config property)*

**limit :** *(optional)* `<integer> | unit: number of paragraphs | default: Infinity`

> When placing the elements from the source into the targets, only N tags will
be moved. By default, there is no limiting, splitting will go all the way to the
final element. *(see offset config property)*

**gap :** *(optional)* `<string> | any valid CSS width value | default: '30px'`

> When there are multiple columns in a target, then columns are separated by
a gap, which can accepty any CSS width value.

**maxColumnsGetter :** *(optional)* `<function> | default: () => Infinity`

> The value for this key should be a function, which will be called by splitArticles
for every target. splitArticle expects an integer as a result of the function, which will
be compared to the number of columns the target would normally get through automatic
distribution. The function is called with a single argument: the current target element.

**minColumnsGetter :** *(optional)* `<function> | default: () => 0`

> TODO: add description

### License

MIT
