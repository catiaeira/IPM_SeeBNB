<script>    
  import MapComponent from '@/components/Map.vue';
  import Chart from '@/components/BaseChart.vue';
  import StatsComponent from '@/components/StatsCard.vue';
  import CityIntro from '@/components/CityIntro.vue';
  import Filters from '@/components/Filters/Filters.vue';
  import Table from '@/components/Table.vue';
  import { useFilters } from '@/composables/useFilters'
  import { fetchCityData } from '@/utils/FetchCityData';
  import { filterBy, mostAffectedArea, percentChange } from '@/utils/listingAnalytics';

  export default {
    components : {MapComponent, Chart, StatsComponent, CityIntro, Filters, Table},
    setup() {
      const { filters } = useFilters()
      return { filters }
    },
    data() {
      return {
        allListings: [],
        listingsTri1:[],
        listingsTri2:[],
        triStates: ['Listagens', 'Preço', 'Ocupação'],
        trimestralState: 0, // listings = 0, price, occupation
      }
    },
    props: {
      city: String,
    },
    async created() {
        await this.fetchData();
    },
    watch: {
        '$route.query': {
            handler: 'fetchData',
            deep: true
        },
        city: {
            handler: 'fetchData',
            immediate: false
        },
        filters: {
          deep: true,
          handler(newFilters) {
            this.$router.replace({
              query: Object.fromEntries(
                Object.entries(newFilters).filter(
                  ([, v]) => v !== null && v !== false && v !== 0
                )
              )
            })
          }
        }
    },
    computed: {

      listingsOver250Current() {
        return filterBy(this.allListings, l => l.estimated_occupancy_l365d > 250)
      },

      listingsOver250Prev() {
        return filterBy(this.listingsTri1, l => l.estimated_occupancy_l365d > 250)
      },

      hostsOver5ListingsCurrent() {
        return filterBy(this.allListings, l => l.host_total_listings_count > 5)
      },

      hostsOver5ListingsPrev() {
        return filterBy(this.listingsTri1, l => l.host_total_listings_count > 5)
      },

      unregisteredListingsCurrent() {
        return filterBy(this.allListings, l => !l.license)
      },

      unregisteredListingsPrev() {
        return filterBy(this.listingsTri1, l => !l.license)
      },

      countOver250Current() {
        return this.listingsOver250Current.length
      },

      countOver250Prev() {
        return this.listingsOver250Prev.length
      },

      countHostsOver5Current() {
        return this.hostsOver5ListingsCurrent.length
      },

      countHostsOver5Prev() {
        return this.hostsOver5ListingsPrev.length
      },

      countUnregisteredCurrent() {
        return this.unregisteredListingsCurrent.length
      },

      countUnregisteredPrev() {
        return this.unregisteredListingsPrev.length
      },

      over250PrevComparePercent() {
        return percentChange(this.countOver250Current, this.countOver250Prev)
      },

      hostsOver5PrevComparePercent() {
        return percentChange(this.countHostsOver5Current, this.countHostsOver5Prev)
      },

      unregisteredPrevComparePercent() {
        return percentChange(this.countUnregisteredCurrent, this.countUnregisteredPrev)
      },

      mostAffectedAreaOver250() {
        return mostAffectedArea(this.listingsOver250Current)
      },

      mostAffectedAreaHostsOver5() {
        return mostAffectedArea(this.hostsOver5ListingsCurrent)
      },

      mostAffectedAreaUnregistered() {
        return mostAffectedArea(this.unregisteredListingsCurrent)
      },

      regulationTableRows() {
        return [
          [
            'Alojamentos >250 dias/ano',
            this.countOver250Current,
            this.mostAffectedAreaOver250,
            this.over250PrevComparePercent !== null ? `${this.over250PrevComparePercent}%` : '-'
          ],
          [
            'Hosts com 5+ listagens',
            this.countHostsOver5Current,
            this.mostAffectedAreaHostsOver5,
            this.hostsOver5PrevComparePercent !== null ? `${this.hostsOver5PrevComparePercent}%` : '-'
          ],
          [
            'ALs sem registo',
            this.countUnregisteredCurrent,
            this.mostAffectedAreaUnregistered,
            this.unregisteredPrevComparePercent !== null ? `${this.unregisteredPrevComparePercent}%` : '-'
          ]
        ]
      },

      zoneStats() {
        const zones = {}

        for(const l of this.allListings) {
          const zone = l.neighbourhood_group_cleansed || 'Unknown'

          if(!zones[zone]) {
            zones[zone] = {
              listingsCount: 0,
              totalOccupancy: 0,
              totalPrice: 0
            }
          }
          
          const stats = zones[zone]
          stats.listingsCount++
          stats.totalOccupancy += l.estimated_occupancy_l365d || 0
          stats.totalPrice += Number(l.price) || 0
        }

        return zones
      },

      zoneTableRows() {
        const rows = []

        for(const zone in this.zoneStats) {
          const stats = this.zoneStats[zone]
          const averageOccupancy = stats.totalOccupancy / stats.listingsCount
          const averagePrice = stats.totalPrice / stats.listingsCount
          rows.push([zone, averageOccupancy, stats.listingsCount, averagePrice])
        }

        return rows
      }
    },
    methods: {    
      async fetchData() {
        if (!this.city) return;
        this.setFilters();

        try {
          const data = await fetchCityData(this.city, this.filters);
          
          this.allListings = data.mainListings;
          this.listingsTri1 = data.trimestral1;
          this.listingsTri2 = data.trimestral2;

          console.log(`Loaded ${this.allListings.length + this.listingsTri1.length + this.listingsTri2.length} total listings.`);
        } catch (error) {
          console.error("Fetch failed, redirecting:", error);
          this.$router.push({ 
            name: 'NotFound',
            params: { notFound: 'data-not-found' }
          });
        }
      },
      changeTrimestralDataState(direction) {
        let state = this.trimestralState;
        if (direction === 'up') state ++;
        else state --;
        if (state < 0) state = this.triStates.length - 1;
        else if (state > this.triStates.length - 1) state = 0;

        this.trimestralState = state;
      },

      setFilters(){
        const query = this.$route.query
          this.filters.private_room = query.private_room === 'true';
          this.filters.shared_room  = query.shared_room === 'true';
          this.filters.apt          = query.apt === 'true';
          this.filters.hotel        = query.hotel === 'true';
          this.filters.priceMin     = query.priceMin ? Number(query.priceMin) : null;
          this.filters.priceMax     = query.priceMax ? Number(query.priceMax) : null;
          this.filters.fromRating   = query.fromRating ? Number(query.fromRating) : 1;
          this.filters.toRating     = query.toRating ? Number(query.toRating) : 5;
          this.filters.short        = query.short === 'true';
          this.filters.long         = query.long === 'true';
      }
    }
  }

</script>

<template>
  <div class="page">
    <CityIntro :cityname="city" color="var(--seagreen)"/>
    
    <div class="filter-wrapper">
      <Filters />
    </div>
    <span class="text">Dados do último trimestre</span>
    <div class="top">

      <div class="stats" id="stats">
        <StatsComponent
          :allListings="allListings"
          />
      </div>

      <div class="map-card">
        <MapComponent
          :listings="allListings"
          :cityName="city"
        />
      </div>
    </div>
    <span class="text">Dados Trimestrais</span>
    <div class="graphs-wrapper">
      <div class="trimestral-data">
        <div id="triButton">
          <button class="button up" @click.stop="changeTrimestralDataState('up')">▲</button>
          <div id="label">{{ triStates[trimestralState] }}</div>
          <button class="button down" @click.stop="changeTrimestralDataState('down')">▼</button>
        </div>

        <div id="triDots">
          <div
            class="dot"
            :style="{ backgroundColor: triStates[trimestralState] === 'Ocupação' ? 'var(--seagreen)' : 'var(--text)' }"
          ></div>
        
          <div
            class="dot"
            :style="{ backgroundColor: triStates[trimestralState] === 'Preço' ? 'var(--seagreen)' : 'var(--text)' }"
          ></div>
        
          <div
            class="dot"
            :style="{ backgroundColor: triStates[trimestralState] === 'Listagens' ? 'var(--seagreen)' : 'var(--text)' }"
          ></div>
        </div>

        <!-- to export -->
        <div class="off-screen-stage trimestral-chart">
          <div id="export-tri-list">
            <Chart :listings1="allListings"
            :listingsTri1="listingsTri1"
            :listingsTri2="listingsTri2" 
            :triState="0" 
            mainLabel="trimestral"/>
          </div>
          <div id="export-tri-price">
            <Chart :listings1="allListings"
            :listingsTri1="listingsTri1"
            :listingsTri2="listingsTri2" 
            :triState="1" 
            mainLabel="trimestral"/>
          </div>
          <div id="export-tri-ocup">
            <Chart :listings1="allListings"
            :listingsTri1="listingsTri1"
            :listingsTri2="listingsTri2" 
            :triState="2" 
            mainLabel="trimestral"/>
          </div>
        </div>

        <div class="trimestral-chart" id="trimestralChart">
          <Chart
            :listings1="allListings"
            :listingsTri1="listingsTri1"
            :listingsTri2="listingsTri2"
            :triState="trimestralState"
            mainLabel="trimestral"
          />
        </div>
      </div>
    </div>

    <div class="chart" id="cityChart">
      <Chart
        :listings1= "allListings"
        mainLabel="listsPerHost"
      />
    </div>

    <div class="table">
      <h1>Elementos para regularização (último trimestre)</h1>
      <br>
      <Table
        :columns="[
          { label: 'Indicador', sortable: false },
          { label: 'Valor', sortable: false },
          { label: 'Zona mais afetada', sortable: false },
          { label: 'Comparação trimestral', sortable: false }
        ]"
        :rows="regulationTableRows"
      />
    </div>

    <div class="table">
      <h1>Dados por zona (último trimestre)</h1>
      <br>
      <Table
        :columns="[
          { label: 'Zona', sortable: true },
          { label: 'Ocupação média', sortable: true, format: v => `${Number(v).toFixed(1)}` },
          { label: 'Número de Listagens', sortable: true, format: v => `${Number(v).toFixed(0)}` },
          { label: 'Preço médio ($)', sortable: true, format: v => `${Number(v).toFixed(2)}` },
        ]"
        :rows="zoneTableRows"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
}

.filter-wrapper {
    width: 90%;
    align-self: center;
}

.text {
  margin-left: 2%;
  font-size: 1.5rem;
}

.top {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: stretch;
  margin: 0 2%;
}

.map-card {
  align-self: center;
  height: 90%;
  background: #e9f4f3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 360px;
}

.trimestral-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  gap: 2rem; 
}

.trimestral-chart {
  border-radius: 12px;
}

.chart {
  border-radius: 12px;
  padding: 1.5rem;
}

.table {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.table Table {
  font-size: 1.3em;
}
  
.off-screen-stage {
  position: absolute;
  left: -9999px;
  top: 0;
}

.graphs-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 40vh;
}

#triButton {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2rem;
  height: 8rem;
  border-radius: 12px
}

#triDots {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50px;
  width: 50px;
  gap: 0.5rem;
}

.dot{
  height: 1rem;
  width: 1rem;
  border-radius: 100%;
  transition: 0.2s ease-in-out;
  border: 1px solid var(--text);
}

#label {
  padding: 2px;
  height: 60%;
  text-align: center;
  border: 2px solid var(--text);
}

.button {
  height: 20%;
  background: none;
  background-color: var(--blue);
  border: none;
  cursor: pointer;
  color: var(--text);
  border: 2px solid var(--text);
}

.up{
  border-radius: 12px 12px 0 0;
}

.down{
  border-radius: 0 0 12px 12px;
}

#label {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

</style>