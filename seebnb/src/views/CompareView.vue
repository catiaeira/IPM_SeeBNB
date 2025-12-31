<script>
    import Chart from '@/components/BaseChart.vue';
    import StatsComponent from '@/components/StatsCard.vue';7
    import getFilterParams from '@/utils/formatFilter.js';

    export default {
        components : {Chart, StatsComponent},
        data() {
            return {
            listings1: [],
            listings2: [],
            calendar1: [],
            calendar2: [],
            }
        },
        props: {
            city1: String,
            city2: String
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
          }
        },
        watch: {
            '$route.query': {
                handler: 'fetchData',
                deep: true
            },
            city1: {
                handler: 'fetchData',
                immediate: false
            },
            city2: {
                handler: 'fetchData',
                immediate: false
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {    
            async fetchData() {
                try {
                  const cities = [this.city1, this.city2];
                    for (let i = 0; i<2; i++){
                        const city = cities[i];
                        console.log("Fetching data for:", city);
                        let link = `http://localhost:3000/${city}.listings`;
                        const filter_str = getFilterParams (this.filters);
                        const link_w_filter = filter_str ? link + '?' + filter_str : link;
                        
                        console.log("link with filter :", link_w_filter);
                        const response = await fetch(link_w_filter);
                        
                        if (!response.ok) throw new Error('Network response was not ok');
                        
                        const data = await response.json();
                        if (i==0) this.listings1 = data;
                        else this.listings2 = data;

                        console.log(`Successfully loaded ${data.length} listings.`);
                    }
                    for (let i = 0; i<2; i++){
                        const city = cities[i];
                        console.log("Fetching calendar data for:", city);
                        let link = `http://localhost:3000/${city}.calendar`;
                        const response = await fetch(link);
                        if (!response.ok) throw new Error('Network response was not ok');

                        const data = await response.json();
                        
                        if (i==0) {
                          const availableIds = new Set(this.listings1.map(item =>  parseInt(item.id)));
                          this.calendar1 = data.filter(listing => {
                            return availableIds.has(listing.listing_id);
                          });
                          console.log(`Successfully loaded ${this.calendar1.length} listings.`);
                        }
                        else {
                          const availableIds = new Set(this.listings2.map(item =>  parseInt(item.id)));
                          this.calendar2 = data.filter(listing => {
                            return availableIds.has(listing.listing_id);
                          });
                          console.log(`Successfully loaded ${this.calendar2.length} listings.`);  
                        }
                        
                    }
                  } catch (error) {
                      console.error("Fetch failed:", error);
                }
            },
        }
    }
</script>   
<template>
  <div class="page">
    <div class="names">
      <div class="cityName1">{{ city1 }}</div> 
      <div class="cityName2">{{ city2 }}</div> 
    </div>

    <div class="top">

      <div class="stats">
        <StatsComponent
          :allListings="listings1"
          />
      </div>

      <div class="stats">
        <StatsComponent
          :allListings="listings2"
          />
      </div>
    </div>

    <div class="chart">
      <Chart
        :listings1= "calendar1"
        :listings2= "calendar2"
        mainLabel="listsPerMonths"
      />
    </div>
    <div class="chart">
      <Chart
        :listings1= "listings1"
        :listings2="listings2"
        mainLabel="ocupationCompare"
      />
    </div>
    <div class="chart">
      <Chart
        :listings1= "listings1"
        :listings2="listings2"
        mainLabel="listsPerHostCompare"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  width: 90%;
  margin: 0 auto;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.cityName {
  -webkit-text-stroke: 1px rgb(255, 255, 255);
  font-size: 30px;
  font-weight: bolder;
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

</style>