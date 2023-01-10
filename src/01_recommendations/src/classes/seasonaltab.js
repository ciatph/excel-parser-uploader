const ExcelTabDefinition = require('./excelsheetdef')
const { RECOMMEDATIONS_TYPE } = require('../constants')

class SeasonalTab extends ExcelTabDefinition {
  constructor () {
    super()

    this.excelTabNumber = 0
    this.type = RECOMMEDATIONS_TYPE.SEASONAL
    this.description = 'Seasonal Crop Recommendations'

    this.EXCEL_COLUMN_NAMES = {
      'Crop Stage': this.NORMAL_COLUMN_NAMES.CROP_STAGE,
      'Farm Operation': this.NORMAL_COLUMN_NAMES.FARM_OPERATION,
      RSCOA: this.NORMAL_COLUMN_NAMES.FORECAST,
      __EMPTY: this.NORMAL_COLUMN_NAMES.IMPACT,
      __EMPTY_1: this.NORMAL_COLUMN_NAMES.IMPACT_TAGALOG,
      __EMPTY_2: this.NORMAL_COLUMN_NAMES.PRACTICE,
      __EMPTY_3: this.NORMAL_COLUMN_NAMES.PRACTICE_TAGALOG
    }

    /** Normalized weather forecast text */
    this.NORMAL_FORECAST_NAMES = {
      'WAY BELOW NORMAL': 'Way Below Normal',
      'BELOW NORMAL': 'Below Normal',
      'NEAR NORMAL': 'Near normal',
      'ABOVE NORMAL': 'Above Normal'
    }

    /** Normalized weather forecast codes */
    this.NORMAL_FORECAST_CODES = {
      'WAY BELOW NORMAL': 'wb_normal',
      'BELOW NORMAL': 'b_normal',
      'NEAR NORMAL': 'near_normal',
      'ABOVE NORMAL': 'above_normal'
    }
  }
}

module.exports = SeasonalTab
