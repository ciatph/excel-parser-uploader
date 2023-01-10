const { CsvToFireStore } = require('csv-firestore')
const { CROP_STAGE_LABELS, MUNICIPALITIES_TO_REPLACE_WITH_PAGASA } = require('./constants')

class CroppingCalendar extends CsvToFireStore {
  constructor (csvFilePath) {
    super(csvFilePath)

    /** Province { id, name }  */
    this.provinces = []

    /** Municipality {id, name, province } */
    this.municipalities = []

    /** Crop { id, name } */
    this.crops = []

    /** Crop stages from months */
    this.crop_stages = []

    this.count = 0

    // Municipalities that have different naming convention from the 10-day weather forecast files
    this.susMunicipalities = MUNICIPALITIES_TO_REPLACE_WITH_PAGASA.map(item => item.municipality)
  }

  /**
   * Check if a value exists in a specified Object[] array
   * @param {String} param - Array name to check
   * @param {*} value - Value to find in the Object[] array
   */
  itemExists (param, value) {
    let exists = false

    switch (param) {
      case 'province':
        exists = Object.values(this.provinces).map(x => x.name).includes(value)
        break
      case 'municipality':
        exists = Object.values(this.municipalities).map(x => x.unique).includes(value)
        break
      case 'crop':
        exists = Object.values(this.crops).map(x => x.name).includes(value)
        break
      case 'crop_stage':
        exists = Object.values(this.crop_stages).map(x => x.name).includes(value)
        break
      default: break
    }

    return exists
  }

  /**
   * Remove whitespace on start and end of string
   * @param {String} value - String text
   */
  removeSpecialChars (value) {
    if (value === undefined) {
      return ''
    }

    return value.trim()
  }

  /**
   * Override CsvToFireStore's read() method to parse the crop recommedations CSV file
   * @param {Object} row - Read row in a CSV file with keys as CSV headers
   */
  read (row) {
    this.count += 1
    const headers = Object.keys(row)
    const obj = { id: this.count }

    headers.forEach(item => {
      const include = item.length > 0

      if (!include) {
        return
      }

      let key = item.toLowerCase()

      if (key === 'prov') {
        key = 'province'
      } else if (key === 'muni') {
        key = 'municipality'
      }

      const value = row[item].trim()
      let tempMunicipality = null

      // Extract unique provinces
      if (key === 'province' && !this.itemExists('province', value) && value !== '') {
        this.provinces.push({
          id: this.provinces.length + 1,
          name: value
        })
      }

      // Extract unique municipalities
      if (key === 'municipality' && value !== '') {
        tempMunicipality = value.trim()

        if (this.susMunicipalities.includes(tempMunicipality)) {
          tempMunicipality = MUNICIPALITIES_TO_REPLACE_WITH_PAGASA.find(x =>
            x.province === row.prov.trim() && x.municipality === value.trim())?.replace ?? value.trim()
        }

        const combo = `${row.prov.trim()}|${tempMunicipality}`

        if (!this.itemExists('municipality', combo)) {
          this.municipalities.push({
            id: this.municipalities.length + 1,
            province: row.prov.trim(),
            name: tempMunicipality,
            unique: combo
          })
        }
      }

      // Extract unique crop names
      if (key === 'crop' && !this.itemExists('crop', value) && value !== '') {
        this.crops.push({
          id: this.crops.length + 1,
          name: value
        })
      }

      // Extract unique crop stages
      if (!['province', 'municipality', 'crop'].includes(key)) {
        let cleanStage = value
        cleanStage = cleanStage.substring(0, cleanStage.indexOf('_'))

        if (!this.itemExists('crop_stage', cleanStage) && cleanStage !== '') {
          this.crop_stages.push({
            id: this.crop_stages.length + 1,
            name: cleanStage,
            label: CROP_STAGE_LABELS[cleanStage]
          })
        }
      }

      if (include && ['province', 'municipality', 'crop'].includes(key)) {
        obj[key] = (key === 'municipality')
          ? tempMunicipality
          : value
      }
    })

    // Extract and merge crop stages per month
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

    for (let i = 1; i <= 12; i += 1) {
      const mdata = []
      const index = (i < 10) ? `0${i}` : i
      const m1 = row[`${index}_15_CAL`].slice(0, row[`${index}_15_CAL`].indexOf('_'))
      const m2 = row[`${index}_30_CAL`].slice(0, row[`${index}_30_CAL`].indexOf('_'))

      const firstHalf = (m1 === '') ? 'none' : m1
      mdata.push(firstHalf)

      const secondHalf = (m2 === '') ? 'none' : m2
      mdata.push(secondHalf)

      obj[months[i - 1]] = mdata.toString()
    }

    this.csv_rows.push(obj)
  }
}

module.exports = CroppingCalendar
