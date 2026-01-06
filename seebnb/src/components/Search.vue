<template>
  <div class="container">
    <div class="search-tabs">
      <div class="search" :class="{ selected: selected === 'search' }" @click="selectTab('search')">Pesquisar</div>
      <div class="compare" :class="{ selected: selected === 'compare' }" @click="selectTab('compare')">Comparar</div>
    </div>

    <div class="search-bar">
      <div class="top-half">
        <div id="when-search" v-if="selected==='search'">
          <input type="text"
            v-model="locations.location"
            placeholder="Localidade..."
          />
        </div>

        <div id="when-compare" v-if="selected==='compare'">
          <input type="text"
            v-model="locations.location1"
            placeholder="Localidade 1"
          />
          <input type="text"
            v-model="locations.location2"
            placeholder="Localidade 2"
          />
        </div>

        <button class="search-btn" @click="submitSearch"><span class="magnifier">🔍︎</span></button>
      </div>

      <Filters/>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import Filters from './Filters/Filters.vue'
import { normalizeCityName } from "@/utils/CityTranslation"
import { useFilters } from '@/composables/useFilters'

const emit = defineEmits(['search'])

const selected = ref('search')

const locations = reactive({
  location: '',
  location1: '',
  location2: ''
})

const { filters } = useFilters()

function submitSearch() {
  let locations_normalized = {
    location: normalizeCityName(locations.location),
    location1: normalizeCityName(locations.location1),
    location2: normalizeCityName(locations.location2),
  }
  console.log(locations_normalized)
  console.log(filters)
  emit('search', { filters, locations: locations_normalized })
}


function selectTab(tab) {
  console.log('Selected tab:', tab)
  selected.value = tab
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.search-tabs {
  display: flex;
}

.search,
.compare {
  border-radius: 12px 12px 0 0;
  background-color: var(--light-blue);
  padding: 0.5rem 1rem;
  font-size: larger;
  color: var(--text);
  cursor: pointer;
  text-align: center;
}

.selected {
  background-color: var(--blue);
}

.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--blue);
  border-radius: 0 12px 12px 12px;
  position: relative;
  z-index: 2;
}

.top-half {
  display: flex;
  gap: 1rem;
}

#when-compare {
  display: flex;
  gap: 1rem;
}

input {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 180px;
}

.search-btn {
  width: 2.2rem;
  background: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.magnifier {
  color: black;
  font-size: 1.2rem;
}
</style>
