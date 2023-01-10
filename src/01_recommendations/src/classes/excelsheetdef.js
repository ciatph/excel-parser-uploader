const { CROP_STAGE_LABELS } = require('../../../02_crop_calendar/constants')

class ExcelTabDefinition {
  /** Excel sheet tab number */
  excelTabNumber = -1

  /** Recommendations type */
  type = ''

  /** Minimal text description */
  description = ''

  /** Raw excel column names */
  EXCEL_COLUMN_NAMES = {}

  /** Normalized excel column names */
  NORMAL_COLUMN_NAMES = {
    CROP_STAGE: 'crop_stage',
    FARM_OPERATION: 'farm_operation',
    FORECAST: 'forecast',
    IMPACT: 'impact',
    IMPACT_TAGALOG: 'impact_tagalog',
    PRACTICE: 'practice',
    PRACTICE_TAGALOG: 'practice_tagalog'
  }

  NORMAL_CROPSTAGE_CODES = {
    'Newly Planted': Object.keys(CROP_STAGE_LABELS).find(key => CROP_STAGE_LABELS[key] === 'Newly Planted'),
    'Vegetative/Reproductive': Object.keys(CROP_STAGE_LABELS).find(key => CROP_STAGE_LABELS[key] === 'Vegetative/Reproductive'),
    Maturing: Object.keys(CROP_STAGE_LABELS).find(key => CROP_STAGE_LABELS[key] === 'Maturing'),
    'Preparation Stage': Object.keys(CROP_STAGE_LABELS).find(key => CROP_STAGE_LABELS[key] === 'Preparation Stage')
  }
}

module.exports = ExcelTabDefinition
