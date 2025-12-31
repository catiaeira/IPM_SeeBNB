<script>    
    import MapComponent from '@/components/Map.vue';
    import Chart from '@/components/BaseChart.vue';
    import StatsComponent from '@/components/StatsCard.vue';
    import CityIntro from '@/components/CityIntro.vue';

    export default {
        components : {MapComponent, Chart, StatsComponent, CityIntro},
        data() {
            return {
            allListings: [],
            listingsTri1:[],
            listingsTri2:[],
            currentCity: 'lisbon',
            triStates: ['Listagens', 'Preço', 'Ocupação'],
            trimestralState: 0 // listings = 0, price, occupation
            }
        },
        async created() {
            await this.fetchData();
        },
        methods: {    
            async fetchData() {
                try {
                    console.log("Fetching data for:", this.currentCity);
                    for (let i = 0; i<3; i++){
                      let link = `http://localhost:3000/${this.currentCity}.listings`;
                      if (i>0) link = link.concat (`(${i})`);

                      const response = await fetch(link);
                      
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
                      console.log(`Successfully loaded ${this.allListings.length} listings.`);
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
    <CityIntro :cityname="currentCity" color="var(--seagreen)"/>

    <div class="top">

      <div class="stats">
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

</style>