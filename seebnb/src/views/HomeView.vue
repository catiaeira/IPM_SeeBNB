<template>
    <div class="page">
        <div class="top-half">
            <div class="background"
                :style="{backgroundImage:
                `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), var(--background)),
                url(${ImageDict.cityscape})` }">
                
                <Search class="search-wrapper"/>
            </div>
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
    import ImageDict from '@/assets/ImageDict';
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
    height: 60vh;
    overflow: hidden;
}

.search-wrapper {
    position: absolute;
    width: 60%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.background {
    position: absolute;
    inset: 0;
    z-index: 8;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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