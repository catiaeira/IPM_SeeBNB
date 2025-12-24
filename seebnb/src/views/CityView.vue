<script>    
    import MapComponent from '@/components/Map.vue';
    import BarChart from '@/components/BaseChart.vue';

    export default {
        components : {MapComponent, BarChart},
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
                this.loading = true;
                try {
                    console.log("Fetching data for:", this.currentCity);
                    const response = await fetch(`http://localhost:3000/${this.currentCity}_listings`);
                    
                    if (!response.ok) throw new Error('Network response was not ok');
                    
                    const data = await response.json();
                    
                    this.allListings = data; 
                    
                    console.log(`Successfully loaded ${this.allListings.length} listings.`);
                    } catch (error) {
                        console.error("Fetch failed:", error);
                    } finally {
                        this.loading = false;
                }
            }
        }
    }
       
</script>
<template>
  <div class="page">

    <div class="top">

        <div class="stats-card">
            <ul class="stat-row">
            <span>Avaliação média</span>
            <span>★★★★☆</span>
            </ul>
            <ul class="stat-row">
            <span>Preço médio por noite</span>
            <span>290€</span>
            </ul>
            <ul class="stat-row">
            <span>Nº noites tipicamente alugadas</span>
            <span>75</span>
            </ul>
            <ul class="stat-row">
            <span>Rendimento médio</span>
            <span>$14.900</span>
            </ul>
            <ul class="stat-row">
            <span>Nº de alojamentos locais</span>
            <span>15.200</span>
            </ul>
            <ul class="stat-row">
            <span>Percentagem de short-rentals</span>
            <span>83.7%</span>
            </ul>
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

.top {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  align-items: stretch;
}

.stats-card {
  background: #f6f8ff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dde2ff;
  font-size: 0.95rem;
}

.stat-row span:last-child {
  font-weight: 600;
}

.map-card {
  background: #e9f4f3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 360px;
}

.chart {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

</style>