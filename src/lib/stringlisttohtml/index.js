class StringListToHTML {
  // Constants
  IS_ITEM = 'is_item'
  IS_SUB_ITEM = 'is_sub_item'
  BIG_BULLET_SYMBOL = '●'
  SMALL_BULLET_SYMBOL = '•'
  NUMBER = '{{number}}'
  SUBITEM = '{{sub}}'

  /**
   * Get the row-dominant bullet character symbol
   * Sometimes there's a big bullet symbol, sometimes a small symbol. Arrrggggh excel so messy >.<
   * @param {String} string - Long text that contains numbers and bullets
   * @returns {String} Returns the dominant bullet-type symbol BIG_BULLET_SYMBOL or SMALL_BULLET_SYMBOL
   */
  getBulletSymbol = (string) => {
    let separator = this.BIG_BULLET_SYMBOL

    if (string.includes(this.SMALL_BULLET_SYMBOL)) {
      separator = this.SMALL_BULLET_SYMBOL
    }

    return separator
  }

  /**
   * Converts text that contains 1-level nested ORDERED or UNORDERED list (numbers and bullets) to HTML tags
   * @param {String} string - Long text that contains numbers and bullets
   * @returns {String} 1-level input list text converted to HTML list tags
   */
  textToHTML = (stringArr) => {
    let html = ''
    let LASTITEM

    const isOrdered = stringArr.find(x => x.includes(this.NUMBER))
    const isUnorderer = stringArr.find(x => x.includes(this.SUBITEM))

    // Long text or paragraph
    if (!isOrdered && !isUnorderer) {
      return stringArr[0]
    }

    html += (isOrdered) ? '<ol>' : '<ul>'

    for (let i = 0; i < stringArr.length; i += 1) {
      if (stringArr[i].includes(this.NUMBER)) {
        if (LASTITEM === this.IS_SUB_ITEM) {
          html += '</ul>'
        }

        html += `<li>${stringArr[i].replace(this.NUMBER, '').trim()}</li>`
        LASTITEM = this.IS_ITEM
      } else if (stringArr[i].includes(this.SUBITEM)) {
        if (LASTITEM === this.IS_ITEM) {
          html += '<ul>'
        }

        html += `<li>${stringArr[i].replace(this.SUBITEM, '').trim()}</li>`
        LASTITEM = this.IS_SUB_ITEM
      }

      // Close the sub-item list
      if (i === stringArr.length - 1) {
        if (LASTITEM === this.IS_SUB_ITEM) {
          html += '</ul>'
        }
      }
    }

    // Close the ordered list
    if (isOrdered) {
      html += '</ol>'
    }

    return html
  }

  /**
   * Converts text that contains full nested ORDERED or UNORDERED list (numbers and bullets) to HTML tags
   * @param {String} string - Long text that contains numbers and bullets
   * @returns {String} Full input list text converted to HTML list tags
   */
  convert = (string) => {
    let mainItems = [string]

    // Replace bullet list symbols with common markers
    mainItems = string.replace(/[\d]+\./g, `{{split}}${this.NUMBER}`)
    mainItems = mainItems.replace(/[●•]/g, `{{split}}${this.SUBITEM}`)

    mainItems = mainItems
      .split('{{split}}')
      .filter(item => item !== '')

    return this.textToHTML(mainItems)
  }
}

module.exports = StringListToHTML
