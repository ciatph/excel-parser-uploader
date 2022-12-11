## excel-parser-uploader

Data parser and uploader to Firestore of an excel file.

This is similar to [csv-parser-uploader](https://github.com/ciatph/csv-parser-uploader) but processes excel files.

### Requirements

The following requirements were used for this project. Feel free to use other dependencies and versions as needed.

1. Windows 10 OS
2. nvm for Windows v1.1.9
3. NodeJS 16.14.2 installed using nvm
   - node v16.14.2
   - npm v8.5.0

## Notes

- The bullet list symbols: `●`, `•` and a dash `-` can be used interchangeably per main item group (same for a single cell, but can differ across rows and columns).
- Expect the excel bullet text to be riddled with special characters (newlines, tabs and others).
- The script should be able to handle and convert mixed cases of unconventional and regular bullet-list formatting in all excel cells to HTML tags.The bullet list (per excel cell) can contain formats:

### Messy Format 1

Sub item is in the same line as the main ordered item.

```
1. main item 1 ● sub item 1
     ● sub item 2
     ● sub item 3

2. main item 2
     ● sub item 1
     ● sub item 2
     ● sub item 3
```

### Messy Format 2

Sub item is in the same line as the unordered main item.

```
● main item 1 ● main item 2
● main item 3
● main item 4
```

### Messy Format 3 (Uses a dash symbol)

Sub item is in the same line as the unordered main item.

```
● main item 1
   - sub item 1
   - sub item 2
   - sub item 3
● main item 2
   - sub item 1
   - sub item 2
● main item 3
● main item 4
```

### Conventional Format 1 (Number and bullets)

```
1. main item 1
     ● sub item 1
     ● sub item 2
     ● sub item 3
```

### Conventional Format 2 (All bullets)

```
● main item 1
● main item 2
● main item 3
```

### Conventional Format 3 (Number and bullets, starts with a bullet)

```
● main item
     1. sub item 2
     2. sub item 3

● main item 2
     1. sub item 1
     2. sub item 2
     3. sub item 3
```


## Installation

1. Clone this repository.<br>
`git clone https://github.com/ciatph/excel-parser-uploader.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Replace `EXCEL_FILENAME` with a target excel file's filename relative to the `/src/01_recommendations` directory.

4. See the excel parser script's example usage on<br>
`/src/01_recommendations/index.js`

## Available scripts

### `npm run lint`

Check source codes for lint errors.

### `npm run lint:fix`

Fix lint errors.

### `npm run parse`

Normalize an unconventional, complex excel file into an array of simple JS objects with columns containing messy (ordered and unordered) bullet lists converted into organized HTML list tags.

> **WARNING:** The script does not support `-` (dash) symbols.

@ciatph<br>
20221205
