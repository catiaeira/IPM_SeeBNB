import { reactive } from 'vue'

const filters = reactive({
  private_room: false,
  shared_room: false,
  apt: false,
  hotel: false,
  priceMin: null,
  priceMax: null,
  fromRating: 1,
  toRating: 5,
  short: false,
  long: false
})

export function useFilters() {
  return {
    filters
  }
}
