<script>    
    import MapComponent from '../components/Map.vue';

    export default {
        components : {MapComponent},
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
    <MapComponent 
        :listings="this.allListings" 
        :cityName="this.currentCity"></MapComponent>
</template>

<style scoped></style>