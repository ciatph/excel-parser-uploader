const ExcelTabDefinition = require('./excelsheetdef')
const { RECOMMEDATIONS_TYPE } = require('../constants')

class SpecialTab extends ExcelTabDefinition {
  constructor () {
    super()

    this.excelTabNumber = 2
    this.type = RECOMMEDATIONS_TYPE.SPECIAL
    this.description = 'Special Weather Crop Recommendations'

    this.EXCEL_COLUMN_NAMES = {
      'Crop Stage': this.NORMAL_COLUMN_NAMES.CROP_STAGE,
      'Farm Operation': this.NORMAL_COLUMN_NAMES.FARM_OPERATION,
      __EMPTY: this.NORMAL_COLUMN_NAMES.IMPACT_TAGALOG,
      'SPECIAL WEATHER ADVISORY': this.NORMAL_COLUMN_NAMES.IMPACT
    }
  }
}

module.exports = SpecialTab
