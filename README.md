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

## Installation

1. Clone this repository.<br>
`git clone https://github.com/ciatph/excel-parser-uploader.git`

2. Install dependencies.<br>
`npm install`

3. Create a `.env` file from the `.env.example` file. Replace `EXCEL_FILENAME` with a target excel file's filename relative to the `/src/01_recommendations` directory.

4. See the excel parser script's example usage on `/src/01_recommendations/index.js`

## Available scripts

### `npm run lint`

Check source codes for lint errors.

### `npm run lint:fix`

Fix lint errors.

### `npm run parse`

Normalize an unconventional, complex excel file into an array of simple JS objects with columns containing messy (ordered and unordered) bullet lists converted into organized HTML list tags.

@ciatph<br>
20221205
