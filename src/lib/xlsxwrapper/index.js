const XLSX = require('xlsx')

/**
 * Wrapper class for the "xlsx" (sheetjs) excel file parser library.
 */
class XLSXWrapper {
  #workbook = null
  #sheets = null

  /**
   * Initialize the XLSXWrapper class with a full file path to an excel file
   * @param {String} filepath
   */
  constructor (filepath) {
    try {
      this.#workbook = XLSX.readFile(filepath)
      this.#sheets = this.#workbook.SheetNames
    } catch (err) {
      throw new Error(err.message)
    }
  }

  // @returns xlsx workbook
  get workbook () {
    return this.#workbook
  }

  // @returns xlsx sheet names
  get sheets () {
    return this.#sheets
  }

  /**
   * Get the JSON conversion of an xlsx sheet
   * @param {Number} sheetNum excel file sheet number
   * @returns {Object} JSON conversion of an xlsx sheet
   */
  getDataSheet (sheetNum) {
    return XLSX.utils.sheet_to_json(this.#workbook.Sheets[this.#sheets[sheetNum]])
  }

  /**
   * Extract the numerical data into a Float32Array using low-level operations
   * Reference: https://docs.sheetjs.com/docs/demos/ml/#importing-data-from-a-spreadsheet
   * @param {Number} sheetNum excel file sheet number
   * @returns {Float32Array[]} Numerical data from all rows and cells
   */
  getRawData (sheetNum) {
    const range = XLSX.utils.decode_range(this.#workbook.Sheets[this.#sheets[sheetNum]]['!ref'])
    const out = []

    for (let C = range.s.c; C <= range.e.c; ++C) {
      // Create the typed array
      const ta = new Float32Array(range.e.r - range.s.r + 1)

      // Walk the rows
      for (let R = range.s.r; R <= range.e.r; ++R) {
        // Find the cell, skip it if thte cell isn't numeric or boolean
        const cell = this.#workbook.Sheets[this.#sheets[sheetNum]][XLSX.utils.encode_cell({ r: R, c: C })]

        if (!cell || (cell.t !== 'n' && cell.t !== 'b')) {
          continue
        }

        // Assign to the typed array
        ta[R - range.s.r] = cell.v
      }

      out.push(ta)
    }

    return out
  }
}

module.exports = XLSXWrapper
