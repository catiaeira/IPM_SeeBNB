<script>
  import Chart from '@/components/BaseChart.vue';
  import StatsComponent from '@/components/StatsCard.vue';
  import getFilterParams from '@/utils/formatFilter.js';
  import Filters from '@/components/Filters/Filters.vue';
  import CityIntro from '@/components/CityIntro.vue';
  import ImageDict from '@/assets/ImageDict';

  export default {
    components : {Chart, StatsComponent, Filters},
    data() {
      return {
        listings1: [],
        listings2: [],
        calendar1: [],
        calendar2: [],

        stats1: null,
        stats2: null,

        filters: {
          private_room: false,
          shared_room: false,
          apt: false,
          hotel: false,
          priceMin: null,
          priceMax: null,
          rating: 0,
          short: false,
          long: false
        }
      }
    },
    props: {
        city1: String,
        city2: String
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
      getArrow() {
        return ImageDict.arrow
      },
      
      async fetchData() {
        if (!this.city1 || !this.city2) return; 

        this.setFilters();
        try {
            const cities = [this.city1, this.city2];
            for (let i = 0; i<2; i++){
              const city = cities[i];
              console.log("Fetching data for:", city);
              let link = `http://localhost:3000/${city}.listings`;
              const filter_str = getFilterParams (this.filters);
              const link_w_filter = filter_str ? link + '?' + filter_str : link;
              
              const response = await fetch(link_w_filter);
              let data = null;
              if (response.ok) data = await response.json();
              
              if (!response.ok) {
                this.$router.push({ 
                  name: 'NotFound',
                  params: { notFound: 'data-not-found' }
                });
                return;
              }
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

      setFilters(){
        const query = this.$route.query
          this.filters.private_room = query.private_room === 'true';
          this.filters.shared_room  = query.shared_room === 'true';
          this.filters.apt          = query.apt === 'true';
          this.filters.hotel        = query.hotel === 'true';
          this.filters.priceMin     = query.priceMin ? Number(query.priceMin) : null;
          this.filters.priceMax     = query.priceMax ? Number(query.priceMax) : null;
          this.filters.rating       = query.rating ? Number(query.rating) : 0;
          this.filters.short        = query.short === 'true';
          this.filters.long         = query.long === 'true';
      },

      handleFilterUpdate(updatedFilters) {
        this.$router.push({
          query: {
            ...Object.fromEntries(
              Object.entries(updatedFilters).filter(
                ([, v]) => v !== null && v !== false && v !== 0
              )
            )
          }
        });
      }
    }
  }
</script>   
<template>
  <div class="page">
    <div class="cards">
      <CityIntro class="item" :cityname="city1" color="var(--seagreen)"/>
      <CityIntro class="item" :cityname="city2" color="var(--light-blue)"/>
    </div>

    <div class="filter-wrapper">
      <Filters :filters="filters" @update="handleFilterUpdate" />
    </div>

    <div class="top">

      <div class="stats">
        <StatsComponent
          :allListings="listings1"
          @stats="s => stats1 = s"
          :style="{ borderRadius: '12px 0 0 12px' }"
          />
      </div>

      <div class="arrows">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.rating > stats2.rating ? 'point-left' : 'point-right'">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.price > stats2.price ? 'point-left' : 'point-right'">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.nights > stats2.nights ? 'point-left' : 'point-right'">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.profit > stats2.profit ? 'point-left' : 'point-right'">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.numListings > stats2.numListings ? 'point-left' : 'point-right'">
        <img :src="getArrow" :class="stats1 && stats2 && stats1.shortRental > stats2.shortRental ? 'point-left' : 'point-right'">
      </div>

      <div class="stats">
        <StatsComponent
          :allListings="listings2"
          @stats="s => stats2 = s"
          :style="{ borderRadius: '0 12px 12px 0' }"
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
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cards{
  display: flex;
}

.item {
  width: 50%;
}
  
.filter-wrapper {
    width: 90%;
    align-self: center;
}

.cityName {
  -webkit-text-stroke: 1px rgb(255, 255, 255);
  font-size: 30px;
  font-weight: bolder;
}

.top {
  display: flex;
  margin: 0 2%;
}

.stats {
  width: 50%;
}

.arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.3rem;
  background-color: var(--blue);
  padding: 0 2rem;
}

.point-left {
 rotate: -45deg;
 width: 50px;
}

.point-right {
  rotate: 45deg;
  width: 50px;
}

.chart {
  border-radius: 12px;
  padding: 1.5rem;
}

</style>