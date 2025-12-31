export default function getFilterParams(filter) {
    const params = new URLSearchParams();
    if (filter.private_room) params.append('room_type', 'Private room');
    if (filter.shared_room)  params.append('property_type', 'Shared room in home');
    if (filter.apt)          params.append('room_type_like', 'apt');
    if (filter.hotel)        params.append('room_type', 'Hotel room');
    
    if (filter.priceMin)     params.append('price_gte', filter.priceMin);
    if (filter.priceMax)     params.append('price_lte', filter.priceMax);
    
    if (filter.short)        params.append('minimum_nights_lte', 20);
    if (filter.long)         params.append('minimum_nights_gte', 20);

    if (filter.rating > 0)   params.append('review_scores_rating_gte', filter.rating );

    console.log (params)
    return params.toString();
}