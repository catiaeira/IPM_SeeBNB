const CityTranslation = {
  'lisboa' : 'lisbon',
  'milão'  : 'milan',
  'sevilha': 'seville',
  'tóquio' : 'tokyo',
};

export function normalizeCityName(original) {
  let normLocation = original.trim().toLowerCase();
  return CityTranslation[normLocation]  || normLocation;
}