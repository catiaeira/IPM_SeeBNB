<script>    
    import MapComponent from '@/components/Map.vue';
    import Chart from '@/components/BaseChart.vue';
    import StatsComponent from '@/components/StatsCard.vue';
    import CityIntro from '@/components/CityIntro.vue';
    import getFilterParams from '@/utils/formatFilter.js';
    import Table from '@/components/Table.vue';
    import { filterBy, mostAffectedArea, percentChange } from '@/utils/listingAnalytics';

    export default {
        components : {MapComponent, Chart, StatsComponent, CityIntro, Table},
        data() {
            return {
            allListings: [],
            listingsTri1:[],
            listingsTri2:[],
            triStates: ['Listagens', 'Preço', 'Ocupação'],
            trimestralState: 0 // listings = 0, price, occupation
            }
        },
        props: {
          city: String,
        },
        computed: {
          filters() {
            return {
              private_room: this.$route.query.private_room === 'true',
              shared_room: this.$route.query.shared_room === 'true',
              apt: this.$route.query.apt === 'true',
              hotel: this.$route.query.hotel === 'true',
              priceMin: this.$route.query.priceMin
                ? Number(this.$route.query.priceMin)
                : null,
              priceMax: this.$route.query.priceMax
                ? Number(this.$route.query.priceMax)
                : null,
              rating: this.$route.query.rating
                ? Number(this.$route.query.rating)
                : 0,
              short: this.$route.query.short === 'true',
              long: this.$route.query.long === 'true'
            }
          },

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
          }
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
            }
        },
        methods: {    
            async fetchData() {
                if (!this.city) return;
                try {
                    console.log("Fetching data for:", this.city);
                    console.log ("Filters: ", this.filters)

                    for (let i = 0; i<3; i++){
                      let link = `http://localhost:3000/${this.city}.listings`;
                      if (i>0) link = link.concat (`(${i})`);
                      const filter_str = getFilterParams (this.filters);
                      const link_w_filter = filter_str ? link + '?' + filter_str : link
                      
                      console.log("link with filter :", link_w_filter);
                      const response = await fetch(link_w_filter);
                      if (!response.ok) throw new Error('Network response was not ok');
                      
                      const data = await response.json();
                      
                      switch (i) {
                        case 0:
                          this.allListings = data;
                          break;
                        case 1:
                          this.listingsTri1 = data;
                          break;
                        case 2:
                          this.listingsTri2 = data;
                          break;
                        default:
                          break;
                      }                      
                      const target =
                        i === 0 ? this.allListings :
                        i === 1 ? this.listingsTri1 :
                                  this.listingsTri2;

                      console.log(`Successfully loaded ${target.length} listings.`);
                    }
                  } catch (error) {
                      console.error("Fetch failed:", error);
                }
            },

            changeTrimestralDataState(direction) {
              let state = this.trimestralState;
              if (direction === 'up') state ++;
              else state --;
              if (state < 0) state = this.triStates.length - 1;
              else if (state > this.triStates.length - 1) state = 0;

              this.trimestralState = state;
            }
        }
    }

</script>

<template>
  <div class="page">
    <CityIntro :cityname="city" color="var(--seagreen)"/>

    <div class="top">

      <div class="stats">
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
    <div>Dados Trimestrais</div>
    <div class="trimestral-data">
      <div id="triButton">
        <button id="buttonUp" @click.stop="changeTrimestralDataState('up')"></button>
        <div id="buttonLabel">{{ triStates[trimestralState] }}</div>
        <button id="buttonDown" @click.stop="changeTrimestralDataState('down')"></button>
      </div>

      <div id="triDots">
        
      </div>

      <div class="trimestral-chart">
        <Chart
          :listings1="allListings"
          :listingsTri1="listingsTri1"
          :listingsTri2="listingsTri2"
          :triState="trimestralState"
          mainLabel="trimestral"
        />
      </div>
    </div>

    <div class="chart">
      <Chart
        :listings1= "allListings"
        mainLabel="listsPerHost"
      />
    </div>

    <div class="table">
      <h1>Elementos para regularização (último trimestre)</h1>
      <br>
      <Table
        :columns="['Indicador', 'Valor', 'Zona mais afetada', 'Comparação trimestral']"
        :rows="regulationTableRows">
      </Table>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.top {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: stretch;
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

</style>