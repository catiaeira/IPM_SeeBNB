<template>
    <div class="container">
        <h2 class="text">Cidades mais visitadas</h2>
        <div class="divider"></div>
        <div class="city-table">
            <CityCard class="city-card"
                v-for="city in cities"
                :key="city.id"
                :cityname="city.cityname"
                :image="city.image"
            />
        </div>
    </div>
</template>

<script setup>
import CityCard from "@/components/CityCard.vue"
import ImageDict from "@/assets/ImageDict";

const cities = [
    { id: 1, cityname: "Milão", image:  ImageDict.milan },
    { id: 2, cityname: "Manchester", image: ImageDict.manchester },
    { id: 3, cityname: "Sevilha", image: ImageDict.sevilla },
    { id: 4, cityname: "Roma", image: ImageDict.rome },
    { id: 5, cityname: "Tokyo", image: ImageDict.tokyo },
    { id: 6, cityname: "Sydney", image: ImageDict.sydney },
    { id: 7, cityname: "Londres", image: ImageDict.london },
    { id: 8, cityname: "Paris", image: ImageDict.paris },
]
</script>

<style scoped>
.container {
    border: 5px solid var(--blue);
    border-radius: 20px;
    padding: 20px;
}

.divider {
    height: 7px;
    width: 100%;
    background-color: var(--seagreen);
    border-radius: 5px;
    margin: 0 0 20px 0;
}
.city-table {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.city-card {
    height: 15rem;
}

.text {
    font-size: 2.2rem;
    font-weight: 600;
    color: var(--text);
}
</style>