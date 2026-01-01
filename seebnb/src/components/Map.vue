<template>
  <div
    v-if="state !== 'preview'"
    class="backdrop"
    @click="state = 'preview'"
  />

  <div
    class="full-wrapper"
    :class="{ 'is-popup': state !== 'preview' }"
    @click="state === 'preview' ? state = 'listings' : null">

    <nav id="topbar" v-if= "state !== 'preview'">
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
          <button class="close-btn" @click.stop="state = 'preview'">x</button>
      </nav>
      <div class="map-wrapper">
          <div ref="mapContainer" class="map"></div>
          <transition name="fade">
              <div v-if="state === 'price' || state === 'occupancy'" class="heatmap-legend">
                  <h4>{{ state === 'price' ? 'Preço por noite' : 'Ocupação anual' }}</h4>
                  
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
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: none;
  box-shadow: none;
  overflow: hidden;
  cursor: pointer;
  z-index: 0; 
  transition: all 0.3s ease;
}

.full-wrapper.is-popup {
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

.map-wrapper, .map {
  width: 100%;
  height: 100%;
}

#topbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 10;
  background-color: var(--seagreen);
  border-radius: 0px 45px 0 0;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999; 
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
  box-shadow: 0px 2px 6px 2px var(--blue),
              inset 0px 2px 6px 2px var(--blue);
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

.close-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.1);
  background: #ff4747;
}

</style>


<script>
  import RBush from "rbush";
  import {MarkerClusterer} from "@googlemaps/markerclusterer";
  import {ClusterRenderer} from '../utils/ClusterRenderer.js';
  import {MapStyle} from "../utils/MapStyle.js";

  export default {
    name: "MapView",
    props: {
      listings: {
        type: Array,
        required: true,
        default: () => []
      },
      cityName: String
    },
    data() {
      return {
        allListings: null,          // json of the listings
        allMarkers: new Map(),      // stores all created markers
        spatialIndex: null,         // index with the listings' locations
        state: 'preview'            // state: preview, listings, price, occupancy
      }
    },
    watch: {
      listings: {   // whenever the parent updates the listings we need to refresh the data
        immediate: true, 
        handler(newListings) {
          this.restartMap(newListings);
        }
      },

      async state(newState) {   // change the viewing mode
        if (!this.map || !this.spatialIndex) return;
        console.log("current mode:", newState);

        this.markerCluster.setMap(null);
        this.allMarkers.forEach(m => m.setVisible(false));
        this.heatmap.setMap(null);
        
        if (newState === 'listings') {
          this.fetchVisibleListings();
        } else if (newState === 'price') {
          this.showHeatmap('price');
        } else if (newState === 'occupancy') {
          this.showHeatmap('estimated_occupancy_l365d');
        } else {
          this.centerMapOnData();
          this.map.setZoom(13);
        }
      }
    },
    
    async mounted() {
      if (window.google && window.google.maps) {
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

        // Create map
        this.map = new window.google.maps.Map(this.$refs.mapContainer, {
          styles: MapStyle,
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 13,
          mapTypeId: "roadmap"
        });
        this.centerMapOnData();

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

        this.infoWindow = new window.google.maps.InfoWindow({ maxWidth: 300 });

        this.map.addListener("click", () => { // close info window when clicking outside of it
          if (this.infoWindow) this.infoWindow.close();
        });
      },

      async restartMap(newListings) {
        if (!this.map || newListings.length === 0) return;

        this.markerCluster.clearMarkers();
        this.markerCluster.setMap(null);
        this.heatmap.setMap(null);

        this.centerMapOnData();

        this.allListings = newListings.map(item => ({
          ...item,
          _latLng: new window.google.maps.LatLng( // precalculating the latlng 
            parseFloat(item.latitude),
            parseFloat(item.longitude)
          )
        }));
        this.spatialIndex = new RBush();

        this.spatialIndex.load(
          this.allListings.map(item => ({
            minX: item._latLng.lng(),
            minY: item._latLng.lat(),
            maxX: item._latLng.lng(),
            maxY: item._latLng.lat(),
            item: item,
          }))
        );
        this.calculateHeatmaps();

        if (this.state === "listings") {
            this.fetchVisibleListings();
          }

        // listens when the user isnt moving the map (idle)     
        let debounceTimer;
        this.map.addListener("idle", () => {
            if (this.state === "listings") {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.fetchVisibleListings();
                }, 100); // wait before calculating the markers
            }
        });
      },

      fetchVisibleListings() {  // only loads the visible markers
        if (!this.map || !this.spatialIndex) return;

        const bounds = this.map.getBounds();
        if (!bounds) return;

        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        console.log ("calculating spatial index")
        const results = this.spatialIndex.search({
          minX: sw.lng(),
          minY: sw.lat(),
          maxX: ne.lng(),
          maxY: ne.lat(),
        });
        console.log("finished using spatial index")

        const visibleItems = results
          .map(r => r.item);

        console.log(visibleItems.length , " visible items");
        console.log ("first item: ", visibleItems[0])
        this.updateMarkers(visibleItems);
      },

      updateMarkers(listings) {
        const markers = [];

        for (const item of listings) {
          if (!item._latLng) {
            console.log("no lat lng!")
            continue;
          }

          let marker = this.allMarkers.get(item.id);

          if (!marker) {                       // create a new marker if its a new one
            marker = new window.google.maps.Marker({
              position: item._latLng,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#d6f07ad9",
                fillOpacity: 0.9,
                scale: 5,
                strokeColor: "white",
                strokeWeight: 1,
              },
              title: item.name,
            });

            marker.addListener("click", () => { // click listener, adds popup for marker
              const contentString = `
                <div style="color: #333; font-family: sans-serif; padding: 3px">
                  <h3 style="margin: 0 0 5px 0; font-size: 16px;">${item.name}</h3>
                  <a href="${item.listing_url}" target="_blank" style="color: #e2849d; font-weight: bold;">
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
          marker.setVisible(true);
          markers.push(marker);
        }
        if (markers.length > 0) {
          this.markerCluster.clearMarkers();
          this.markerCluster.setMap(this.map);
          this.markerCluster.addMarkers(markers);
        }
      },

      calculateHeatmaps() {
        const modes = ['price', 'estimated_occupancy_l365d'];
        this.heatmapCache = {}; 

        modes.forEach(mode => {
          const data = this.allListings.map(item => {
            let weight = 0;
            if (mode === 'price') {
              weight = item.price ? item.price : 0;
            } else {
              weight = parseFloat(item[mode]);
            }
            
            if (isNaN(weight) || weight <= 0) return null;
            return { location: item._latLng, weight };
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
      },
      centerMapOnData() {
        this.geocoder = new window.google.maps.Geocoder();
        this.geocoder.geocode({ address: this.cityName }, (results, status) => {
        if (status === "OK") {
          const cityCenter = results[0].geometry.location;
          
          this.map.setCenter(cityCenter);
        } else {
          console.error("Geocode failed: " + status);
        }
      });
      }
    }
};
</script>