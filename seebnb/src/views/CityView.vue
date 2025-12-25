<script>    
    import MapComponent from '@/components/Map.vue';
    import BarChart from '@/components/BaseChart.vue';
    import StatsComponent from '@/components/StatsCard.vue';

    export default {
        components : {MapComponent, BarChart, StatsComponent},
        data() {
            return {
            allListings: [],
            currentCity: 'lisbon',
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {    
            async fetchData() {
                try {
                    console.log("Fetching data for:", this.currentCity);
                    const response = await fetch(`http://localhost:3000/${this.currentCity}.listings`);
                    
                    if (!response.ok) throw new Error('Network response was not ok');
                    
                    const data = await response.json();
                    
                    this.allListings = data; 
                    
                    console.log(`Successflily loaded ${this.allListings.length} listings.`);
                    } catch (error) {
                        console.error("Fetch failed:", error);
                }
            }
        }
    }

</script>
<template>
  <div class="page">
    <div class="cityName">{{ currentCity }}</div> 

    <div class="top">

      <div class="stats-card">
        <StatsComponent
          :allListings="allListings"
          />
      </div>

      <div class="map-card">
        <MapComponent
          :listings="allListings"
          :cityName="currentCity"
        />
      </div>
    </div>

    <div class="chart">
      <BarChart
        :listings= "allListings"
        mainLabel="listsPerHost"
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
  background: #e9f4f3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 360px;
  height: 0.95rem;
  top:50%;
  transform: translateY(-50%);
}

.chart {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

</style>