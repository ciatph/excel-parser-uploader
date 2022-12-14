const ExcelTabDefinition = require('./excelsheetdef')
const { RECOMMEDATIONS_TYPE } = require('../constants')

class TendayTab extends ExcelTabDefinition {
  constructor () {
    super()

    this.excelTabNumber = 1
    this.type = RECOMMEDATIONS_TYPE.TENDAY
    this.description = '10-Day Crop Recommendations'

    this.EXCEL_COLUMN_NAMES = {
      'Crop Stage': this.NORMAL_COLUMN_NAMES.CROP_STAGE,
      'Farm Operation': this.NORMAL_COLUMN_NAMES.FARM_OPERATION,
      __EMPTY: this.NORMAL_COLUMN_NAMES.IMPACT_TAGALOG,
      '10-DAY FWOA': this.NORMAL_COLUMN_NAMES.IMPACT
    }
  }
}

module.exports = TendayTab
