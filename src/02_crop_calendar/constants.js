const CROP_STAGE_LABELS = {
  'plant/trans': 'Newly Planted',
  'veg/repro': 'Vegetative/Reproductive',
  mat: 'Maturing',
  lprep: 'Preparation Stage'
}

// Uncommon municipality names detected from /04_find_mismatching_municipalities
// Replace the following with municipality names from the 10-day weather forecast file
const MUNICIPALITIES_TO_REPLACE_WITH_PAGASA = [
  { province: 'Albay', municipality: 'Sto.Domingo', replace: 'Santo Domingo' },
  { province: 'Albay', municipality: 'Pioduran', replace: 'Pio Duran' },
  { province: 'Camarines Norte', municipality: 'Sta. Elena', replace: 'Santa Elena' },
  { province: 'Camarines Norte', municipality: 'SL Ruiz', replace: 'San Lorenzo Ruiz' },
  { province: 'Camarines Sur', municipality: 'Sangay', replace: 'Sagnay' },
  { province: 'Sorsogon', municipality: 'Pto. Diaz', replace: 'Prieto Diaz' },
  { province: 'Sorsogon', municipality: 'Sta. Magdalena', replace: 'Santa Magdalena' }
]

module.exports = {
  CROP_STAGE_LABELS,
  MUNICIPALITIES_TO_REPLACE_WITH_PAGASA
}
