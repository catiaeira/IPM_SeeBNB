<template>
    <div class="page">
        <div class="top-half">
            <div class="background"
                :style="{backgroundImage:
                `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), var(--background)),
                url(${ImageDict.cityscape})` }">
                
                <Search class="search-wrapper" @search="handleSearch"/>
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
    import { useRouter } from 'vue-router';
    import getFilterParams from '@/utils/formatFilter';

    const router = useRouter();
    async function handleSearch(search) {
        const { location, location1, location2 } = search.locations;
        const filter = search.filters;

        const dataExists = async (name, filter) => {
            const filter_str = getFilterParams (filter);
            let link = `http://localhost:3000/${name}.listings?${filter_str}&_limit=1`;
            
            const res = await fetch(link);
            if (!res.ok) return false;
            const data = await res.json();
            return data.length > 0;
        };

        if (location) {
            if (await dataExists(location, filter)) {
                router.push({ name: 'City', params: { city: location }, 
                query: {...Object.fromEntries(
                    Object.entries(filter).filter(
                        ([, v]) => v !== null && v !== false && v !== 0
                    )
                    )
                }});
            } else {
                alert("No data found for that city / Filter too specific");
            }
        } else if (location1 && location2) {
            const [exists1, exists2] = await Promise.all([dataExists(location1, filter), dataExists(location2, filter)]);
            
            if (exists1 && exists2) {
                router.push({ 
                    name: 'Compare', 
                    params: { city1: location1, city2: location2 }, 
                    query: {...Object.fromEntries(
                        Object.entries(filter).filter(
                            ([, v]) => v !== null && v !== false && v !== 0
                    ))
                }});
            } else {
                alert("No data found for that city / Filter too specific");
            }
        }
    }
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