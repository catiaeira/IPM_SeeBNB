<template>
    <div class="full-wrapper">
        <nav id="topbar">
            <button class="nav-btn" 
                id="listings"
                :class="{active: state === 'listings'}"
                @click="state = 'listings'">
                Localizações das ALs
            </button>

            <button class="nav-btn" 
                id="price"
                :class="{active: state === 'price'}"
                @click="state = 'price'">
                Preço por Zona
            </button>

            <button class="nav-btn" 
                id="occupancy"
                :class="{active: state === 'occupancy'}"
                @click="state = 'occupancy'">
                Ocupação por Zona
            </button>
        </nav>

        <div class="map-wrapper">
            <div ref="mapContainer" class="map"></div>
            <transition name="fade">
                <div v-if="state === 'price' || state === 'occupancy'" class="heatmap-legend">
                    <h4>{{ state === 'price' ? 'Price per Night' : 'Annual Occupancy' }}</h4>
                    
                    <div class="legend-bar"></div>
                    
                    <div class="legend-labels">
                        <span>$0</span>
                        <span>{{ currentIntensityLabel }}+</span>
                    </div>
                </div>
            </transition>
        </div>
  </div>
</template>

<style scoped>

.full-wrapper {
  position:fixed;
  top: 100px;   
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1000;
  border-radius: 8px;
  overflow: hidden;
  width: 80%;
  height: 60%;
  margin: auto;
  border-radius: 0px 45px;
  background: black;
}

#topbar {
  position: absolute;
  display: flex;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);

  flex-direction: row; 
  justify-content: space-evenly;
  align-items: center;
  z-index: 10;
  width: 100%;
  height: 50px;
  text-align: center;
  padding: 1%;
  border-radius: 0px 45px;
  background-color: #AAE4E2; /* var(--cor_barra) */
}

.nav-btn {
  background-color: white;
  color: #2f4f4f;
  border-color: white;
  border-width: 1px;
  border-radius: 7px;
  padding: 7px 20px;
  font-weight: 600;
  font-size: medium;
  cursor: pointer;

  box-shadow: 0px 2px 5px 1px #AFAFAF, 
              inset 0px 2px 5px 1px #AFAFAF;

  transition: box-shadow 0.2s ease;
}

.nav-btn.active {
  box-shadow: 0px 2px 6px 2px #CBD2FF, /* var(--cor_fundo)*/
              inset 0px 2px 6px 2px #CBD2FF; /* var(--cor_fundo)*/
}

.map-wrapper {
  width: 100%;
  height: 100%
}

.map {
  width: 100%;
  height: 100%;
}

.heatmap-legend {
  position: absolute;
  bottom: 30px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 180px;
  z-index: 1000;
  font-family: sans-serif;
}

.heatmap-legend h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.legend-bar {
  height: 12px;
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(to right, 
    rgba(0, 80, 200, 0.7), 
    rgba(214, 240, 122, 0.8), 
    rgba(255, 227, 107, 0.9), 
    rgba(255, 42, 42, 1)
  );
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 11px;
  font-weight: bold;
  color: #666;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>


<script>
    /*
    falta definições de popup (fechar quando se clica fora)
    falta passar a cidade q estamos a pesquisar (lisboa hardcoded)
    adicionar lista com as coordenadas das cidades? fazer fetch automático?
    */

  import { MarkerClusterer } from "@googlemaps/markerclusterer";
  import { ClusterRenderer } from '../utils/ClusterRenderer.js';
  import { MapStyle } from "../utils/MapStyle.js";

  export default {
    name: "MapView",
    data() {
      return {
        allListings: [],            // json of the listings
        allMarkers: new Map(),      // stores all created markers
        visibleMarkers: new Map(),  // stores the visible markers

        state: 'listings' // state: listings, price, occupancy
      }
    },
    watch: {
      state(newState) {
        console.log("current mode:", newState);

        this.markerCluster.clearMarkers();
        this.visibleMarkers.clear();
        this.heatmap.setMap(null);
        
        if (newState === 'listings') {
          this.fetchVisibleListings();
        } else if (newState === 'price') {
          this.showHeatmap('price');
        } else if (newState === 'occupancy') {
          this.showHeatmap('estimated_occupancy_l365d');
        }
      }
    },
    
    async mounted() {
      if (window.google && window.google.maps) {
        const response = await fetch('http://localhost:3000/lisbon_listings'); // << hardcoded!!!
        this.allListings = await response.json();
        console.log(`Successfully loaded ${this.allListings.length} APs.`);
        console.log (this.allListings[0]);

        this.initMap();
      } else {
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            this.initMap();
          }
        }, 100);
      }
    },
    computed: {
        currentIntensityLabel() {
            const key = this.state === 'occupancy' ? 'estimated_occupancy_l365d' : this.state;
            
            if (!this.heatmapCache[key]) return '0';

            const val = this.heatmapCache[key].intensity;
            return this.state === 'price' 
                ? `$${Math.round(val)}` 
                : Math.round(val);
        }
    },

    methods: {
      async initMap() {
        await window.google.maps.importLibrary("marker");
        await window.google.maps.importLibrary("visualization");

        const center = { lat: 38.7223, lng: -9.1393 }; // Lisbon
        // Create map
        this.map = new window.google.maps.Map(this.$refs.mapContainer, {
          styles: MapStyle,
          center,
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 13,
          mapTypeId: "roadmap"
        });

        this.markerCluster = new MarkerClusterer({ 
          map: this.map, 
          markers: [], 
          renderer: ClusterRenderer,
          onClusterClick: (event, cluster, map) => {
            map.panTo(cluster.position);
            map.setZoom(map.getZoom() + 2);
          }
        });

        this.heatmap = new window.google.maps.visualization.HeatmapLayer({
          map: null, 
          radius: 20, 
          opacity: 0.8,
          gradient: ['rgba(0, 0, 0, 0)',          // transparent
                     'rgba(0, 78, 152, 0.4)',     // navy
                     'rgba(0, 123, 255, 0.5)',    // bright blue
                     'rgba(255, 255, 255, 0.6)',  // white
                     'rgba(255, 227, 107, 0.8)',  // yellow
                     'rgba(255, 180, 92, 0.9)',   // orange
                     'rgba(255, 42, 42, 1)',      // red
                     'rgba(210, 30, 30, 1)'       // stronger red
                    ]
        });
        this.calculateHeatmaps();

        this.infoWindow = new window.google.maps.InfoWindow({ maxWidth: 300 });

        this.map.addListener("click", () => { // close info window when clicking outside of it
          if (this.infoWindow) this.infoWindow.close();
        });

        // listens when the user isnt moving the map (idle)
        this.map.addListener("idle", () => {
          if (this.state === "listings")
            this.fetchVisibleListings();
        });
      },

      fetchVisibleListings() {  // only loads the visible markers
        if (!this.map || this.allListings.length === 0) return;

        const bounds = this.map.getBounds();
        if (!bounds) return;

        const visibleItems = this.allListings.filter(item => {
          const lat = parseFloat(item.latitude);
          const lng = parseFloat(item.longitude);

          return bounds.contains(new window.google.maps.LatLng(lat, lng));
        });

        this.updateMarkers(visibleItems);
      },

      updateMarkers(listings) {
        const currentIds = new Set(listings.map(item => item.id));
        const markersToAdd = [];

        // removing markers that are no longer in the current view
        for (const [id, marker] of this.visibleMarkers.entries()) {
          if (!currentIds.has(id)) {
            this.markerCluster.removeMarker(marker, true); // remove from cluster
            this.visibleMarkers.delete(id);                // delete from visible
          }
        }

        listings.forEach(item => {
          if (!this.visibleMarkers.has(item.id)) { 
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);

            let marker = null;

            if (!isNaN(lat) && !isNaN(lng)) { 
              if (this.allMarkers.has(item.id)) {
                marker = this.allMarkers.get(item.id);     // fetch from existing map
              }
              else {                                       // or create a new marker if its a new one
                marker = new window.google.maps.Marker({
                  position: { lat, lng },
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "#d6f07ad9",
                    fillOpacity: 0.9,
                    scale: 5,
                    strokeColor: "white",
                    strokeWeight: 1,
                  },
                  title: item.name
                });

                // click listener
                marker.addListener("click", () => {
                  const contentString = `
                    <div style="color: #333; font-family: sans-serif; padding: 3px">
                      <h3 style="margin: 0 0 5px 0; font-size: 16px;">${item.name}</h3>
                      <a href="${item.listing_url}" target="_blank" style="color: #e2849d; text-decoration: none; font-weight: bold;">
                        View Listing
                      </a>
                      ${item.picture_url ? `<img src="${item.picture_url}" style="width:100%; border-radius:8px; margin-top:8px;" />` : ''}
                    </div>
                  `;
                  
                  this.infoWindow.setContent(contentString);
                  this.infoWindow.open(this.map, marker);
                });

                this.allMarkers.set(item.id, marker);
              }
              this.visibleMarkers.set(item.id, marker);
              markersToAdd.push(marker);
            }
          }
        });
        if (markersToAdd.length > 0) {
          console.log("Adding ", markersToAdd.length, " markers");
          this.markerCluster.addMarkers(markersToAdd);
        }
      },

      calculateHeatmaps() {
        const modes = ['price', 'estimated_occupancy_l365d'];
        this.heatmapCache = {}; 

        modes.forEach(mode => {
          const data = this.allListings.map(item => {
            let weight = 0;
            if (mode === 'price') {
              weight = item.price ? parseFloat(item.price.replace(/[$,]/g, '')) : 0;
            } else {
              weight = parseFloat(item[mode]);
            }
            
            if (isNaN(weight) || weight <= 0) return null;
            return { location: new window.google.maps.LatLng(item.latitude, item.longitude), weight };
          }).filter(Boolean);

          let intensity = 1;
          if (data.length) {
            const sortedWeights = data.map(d => d.weight).sort((a, b) => a - b);
            intensity = sortedWeights[Math.floor(sortedWeights.length * 0.95)];
          }
          this.heatmapCache[mode] = { data, intensity };
        });
      },
      showHeatmap(property) {
        const cached = this.heatmapCache[property];
        
        if (cached) {
          this.heatmap.set('maxIntensity', cached.intensity);
          this.heatmap.setData(cached.data);
          this.heatmap.setMap(this.map);
        }
      }
    }
  };
</script>