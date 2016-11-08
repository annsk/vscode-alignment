# Alignment
[![Current Version](http://vsmarketplacebadge.apphb.com/version/annsk.alignment.svg)](https://marketplace.visualstudio.com/items?itemName=annsk.alignment)
[![Install Count](http://vsmarketplacebadge.apphb.com/installs/annsk.alignment.svg)](https://marketplace.visualstudio.com/items?itemName=annsk.alignment)
[![Rating](http://vsmarketplacebadge.apphb.com/rating-short/annsk.alignment.svg)](https://marketplace.visualstudio.com/items?itemName=annsk.alignment)

## Functionality

This extension align chars in selection. It helps creating clean, formatted code.

![usage](docs/usage.gif)

Select text and press `Alt+=` (on macOS `Option+=`). You can also use context menu commend.

## Shortcuts

### Align all chars
* Windows/Linux: `Alt+=`
* macOS: `Option+=`

### Align to first char
* Windows/Linux: `Alt+Shift+=`
* macOS: `Option+Shift+=`

### Align whitespace
* Windows/Linux: `Alt+-`
* macOS: `Option+-`

## Extension Settings

This extension contributes the following settings:

* `alignment.chars`: pairs chars (strings) and their space settings

Space settings:

* `spaceBefore`: spaces count before char(s),
* `spaceAfter`: spaces count after char(s),
* `tabsBefore`: tabs count before char(s),
* `tabsAfter`: tabs count after char(s).

## Default settings

```
// Chars to align
"alignment.chars": {
    ":": {
        "spaceBefore": 0,
        "spaceAfter": 1
    },
    "::": {
        "spaceBefore": 0,
        "spaceAfter": 0
    },
    "=": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "===": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "==": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "=>": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "+=": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "-=": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "*=": {
        "spaceBefore": 1,
        "spaceAfter": 1
    },
    "/=": {
        "spaceBefore": 1,
        "spaceAfter": 1
    }
}
```

# [Changelog](CHANGELOG.md)

## 0.3.0

* Aligning whitespace.
* Align to fist command
* Extend defaults aligment chars list.
* Ommit last line of selection if empty.
* Tabs spacing

## 0.2.3

* Changed category to Formatters.

## 0.2.0

* Add context menu option.
* Describe shortcuts in README

## 0.1.0

* Fixed alignment to 2 chars string.
* Alignment many chars in line to table.
