<template>
    <div class="page">
        <div class="top-half">
            <img src="https://images.unsplash.com/photo-1708474660686-7a00a0ffe4ac" class="city-image"/>
            <Search class="search-wrapper"/>
        </div>
        <div class="table">
            <p class="text">Visualize o impacto do AirBNB em comunidades residenciais.</p>
            <MostVisitedCities></MostVisitedCities>
        </div>
    </div>
</template>

<script setup>
    import MostVisitedCities from '@/components/MostVisitedCities.vue';
    import Search from '@/components/Search.vue';
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--background);
}

.top-half {
    position: relative;
    width: 100%;
}

.search-wrapper {
    position: absolute;
    width: 60%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.city-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.table {
    background-color: var(--background);
    padding: 2rem;
    transition: background-color 0.2s ease;
}

.text {
    font-size: 2.2rem;
    font-weight: 600;
    color: var(--text);
    transition: color 0.2s ease;
}
</style>