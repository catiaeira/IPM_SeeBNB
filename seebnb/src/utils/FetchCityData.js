export default function getFilterParams(filter, tri = null) {
    const params = new URLSearchParams();
    if (filter.private_room) params.append('room_type', 'Private room');
    if (filter.shared_room)  params.append('room_type', 'Shared room');
    if (filter.apt)          params.append('room_type', 'Entire home/apt');
    if (filter.hotel)        params.append('room_type', 'Hotel room');
    
    if (filter.priceMin)     params.append('price_gte', filter.priceMin);
    if (filter.priceMax)     params.append('price_lte', filter.priceMax);
    
    if (filter.short)        params.append('minimum_nights_lte', 30);
    if (filter.long)         params.append('minimum_nights_gte', 30);
    
    if (!tri){
        if (filter.fromRating)   params.append('review_scores_rating_gte', filter.fromRating);
        if (filter.toRating)     params.append('review_scores_rating_lte', filter.toRating);
    }
    return params.toString();
}

// gets the data for one city (cityview)
export async function fetchCityData(city, filters) {
  if (!city) return null;

  const requests = [0, 1, 2].map(i => {
    let link = `http://localhost:3000/${city}.listings`;
    if (i > 0) link += `(${i})`;

    const filterStr = getFilterParams(filters, i>0);
  
    const url = filterStr ? `${link}?${filterStr}` : link;
    
    return fetch(url).then(res => {
      if (!res.ok) throw new Error(`Failed to fetch index ${i}`);
      return res.json();
    });
  });

  const [main, tri1, tri2] = await Promise.all(requests);

  return {
    mainListings: main,
    trimestral1: tri1,
    trimestral2: tri2
  };
}

// this will get the data we use to compare cities
async function getCitySet(city, filters) {
  const filterStr = getFilterParams(filters);
  const listingsUrl = filterStr 
    ? `http://localhost:3000/${city}.listings?${filterStr}` 
    : `http://localhost:3000/${city}.listings`;
  const calendarUrl = `http://localhost:3000/${city}.calendar`;

  const [resListings, resCalendar] = await Promise.all([
    fetch(listingsUrl),
    fetch(calendarUrl)
  ]);

  if (!resListings.ok || !resCalendar.ok) {
    throw new Error(`Data not found for ${city}`);
  }

  const listings = await resListings.json();
  const rawCalendar = await resCalendar.json();

  // filter calendar
  const availableIds = new Set(listings.map(l => parseInt(l.id)));
  const filteredCalendar = rawCalendar.filter(entry => 
    availableIds.has(entry.listing_id)
  );

  return { listings, calendar: filteredCalendar };
}
// combines getCitySet to fetch the 2 cities
export async function fetchComparisonData(city1, city2, filters) {
  if (!city1 || !city2) return null;

  const [data1, data2] = await Promise.all([
    getCitySet(city1, filters),
    getCitySet(city2, filters)
  ]);

  return { city1: data1, city2: data2 };
}