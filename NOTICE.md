# Notices and attributions

This project contains software code and bundled artwork/data with separate licensing notes.

## Software code

Unless otherwise noted, the source code is licensed under:

```text
AGPL-3.0-or-later
```

See `LICENSE`.

## TÜV badge digit path data

Affected file:

```text
src/badge/digits.js
```

This file contains SVG path data used to render the TÜV badge month digits and center year
digits. The path data was extracted, normalized, adjusted and integrated for use in the TÜV
badge renderer.

Potential source/derivation:

```text
File: Bahnschrift.svg
Description: Specimen of the Bahnschrift font
Author: Denis Moyogo Jacquerye
Source: https://commons.wikimedia.org/wiki/File:Bahnschrift.svg
License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
```

Modifications made for this project:

- digit paths extracted from the source material
- paths normalized for renderer use
- digit bounding boxes added
- per-digit fill rules added where needed
- integrated into `src/badge/digits.js`
- rendered as badge artwork, not loaded as an external font file

If the bundled digit paths are treated as an adaptation of the Wikimedia Commons source,
the digit artwork/data in `src/badge/digits.js` should be distributed under CC BY-SA 4.0.
The surrounding software code remains licensed separately under AGPL-3.0-or-later.

## EuroPlate.ttf

`EuroPlate.ttf` is not included in this repository or package.

Graphical license plate rendering requires the user to manually provide the font file at:

```text
/config/www/EuroPlate.ttf
```

The card checks availability through:

```text
/local/EuroPlate.ttf
```

Users are responsible for ensuring their own use of `EuroPlate.ttf` complies with that font's
license. The card falls back to plain text license plates when the font is unavailable.
