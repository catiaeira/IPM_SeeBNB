export function filterBy(listings, predicate) {
  return listings.filter(predicate)
}

export function mostAffectedArea(listings) {
  const counts = {}

  for (const l of listings) {
    const area = l.neighbourhood_group_cleansed || 'Unknown'
    counts[area] = (counts[area] || 0) + 1
  }

  let maxArea = null
  let maxCount = 0

  for (const area in counts) {
    if (counts[area] > maxCount) {
      maxArea = area
      maxCount = counts[area]
    }
  }

  return maxArea
}

export function percentChange(curr, prev) {
  if (prev === 0) return null
  return (((curr - prev) / prev) * 100).toFixed(1)
}
