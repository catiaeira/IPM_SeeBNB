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

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function translateToPT(englishName) {
  const target = englishName.trim().toLowerCase();
  
  const ptName = Object.keys(CityTranslation).find(
    (key) => CityTranslation[key] === target
  );

  return capitalize(ptName || target);
}