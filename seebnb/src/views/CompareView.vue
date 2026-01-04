<script>
  import Chart from '@/components/BaseChart.vue';
  import StatsComponent from '@/components/StatsCard.vue';
  import Filters from '@/components/Filters/Filters.vue';
  import CityIntro from '@/components/CityIntro.vue';
  import ImageDict from '@/assets/ImageDict';
  import { useFilters } from '@/composables/useFilters'
  import { fetchComparisonData } from '@/utils/FetchCityData';

  export default {
    components : {Chart, StatsComponent, Filters, CityIntro},
    setup() {
      const { filters } = useFilters()
      return { filters }
    },
    data() {
      return {
        listings1: [],
        listings2: [],
        calendar1: [],
        calendar2: [],

        stats1: null,
        stats2: null,
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
    async created() {
        await this.fetchData();
    },
    methods: {   
      async fetchData() {
        if (!this.city1 || !this.city2) return;
        this.setFilters();
        try {
          const data = await fetchComparisonData(
            this.city1, 
            this.city2, 
            this.filters
          );

          this.listings1 = data.city1.listings;
          this.calendar1 = data.city1.calendar;
          this.listings2 = data.city2.listings;
          this.calendar2 = data.city2.calendar;

          console.log("Comparison data loaded successfully");
        } catch (error) {
          console.error("Fetch failed:", error);
          this.$router.push({ 
            name: 'NotFound',
            params: { notFound: 'data-not-found' }
          });
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
      }
    },
    computed: {
      getArrow() {
        return ImageDict.arrow
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
      <Filters />
    </div>

    <div class="top" id="citiesStats">

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

    <div class="chart" id="monthChart">
      <Chart
        :listings1= "calendar1"
        :listings2= "calendar2"
        mainLabel="listsPerMonths"
      />
    </div>
    <div class="chart" id="ocupationChart">
      <Chart
        :listings1= "listings1"
        :listings2="listings2"
        mainLabel="ocupationCompare"
      />
    </div>
    <div class="chart" id="listsChart">
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
  padding: 0 2%; 
  box-sizing: border-box;
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