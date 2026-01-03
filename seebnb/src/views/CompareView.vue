<script>
    import Chart from '@/components/BaseChart.vue';
    import StatsComponent from '@/components/StatsCard.vue';
    import getFilterParams from '@/utils/formatFilter.js';
    import CityIntro from '@/components/CityIntro.vue';
    import ImageDict from '@/assets/ImageDict';
    
    export default {
        components : {Chart, StatsComponent, CityIntro},
        data() {
            return {
            listings1: [],
            listings2: [],
            calendar1: [],
            calendar2: [],

            stats1: null,
            stats2: null
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
          },
          getArrow() {
            return ImageDict.arrow
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
    <div class="cards">
      <CityIntro class="item" :cityname="city1" color="var(--seagreen)"/>
      <CityIntro class="item" :cityname="city2" color="var(--light-blue)"/>
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