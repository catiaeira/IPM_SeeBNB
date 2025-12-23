<template>
    <div class="container">
        <h2 class="text">Cidades mais visitadas</h2>
        <div class="divider"></div>
        <div class="city-table">
            <CityCard
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

const cities = [
    { id: 1, cityname: "Milão", image: "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8" },
    { id: 2, cityname: "Manchester", image: "https://images.unsplash.com/photo-1619284518317-85b1ab8c7723" },
    { id: 3, cityname: "Sevilha", image: "https://images.unsplash.com/photo-1688404808661-92f72f2ea258" },
    { id: 4, cityname: "Roma", image: "https://plus.unsplash.com/premium_photo-1675975706513-9daba0ec12a8" },
    { id: 5, cityname: "Tokyo", image: "https://images.unsplash.com/photo-1557409518-691ebcd96038" },
    { id: 6, cityname: "Sydney", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9" },
    { id: 7, cityname: "Londres", image: "https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118" },
    { id: 8, cityname: "Paris", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114" },
]
</script>

<style scoped>
.container {
    border: 5px solid var(--secondary);
    border-radius: 20px;
    padding: 20px;
}

.divider {
    height: 7px;
    width: 100%;
    background-color: var(--accent);
    border-radius: 5px;
    margin: 0 0 20px 0;
}
.city-table {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.text {
    font-size: 2.2rem;
    font-weight: 600;
    color: var(--text);
}
</style>