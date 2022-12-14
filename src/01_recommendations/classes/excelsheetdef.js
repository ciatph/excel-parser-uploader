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
}

module.exports = ExcelTabDefinition
