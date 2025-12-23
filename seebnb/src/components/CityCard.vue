<template>
    <div class="city-card">
        <img class="city-image"
        :src="image"
        :alt="`Imagem de ${cityname}`"
        />
        <div class="overlay">
            <h2 class="city-name">{{ cityname }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: "CityCard",
    props: {
    cityname: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
  }
};
</script>

<style scoped>
.city-card {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.city-card:hover {
    transform: translateY(-5px);
}

.city-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    z-index: 1;
}

.city-card:hover .city-image {
    transform: scale(1.05);
}

.overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    padding: 16px;
    z-index: 2;
}

.city-name {
    color: var(--image_text);
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    text-shadow:
        0 0 2px var(--text),
        0 0 4px var(--text),
        0 0 6px var(--text),
        0 0 8px var(--text);
}
</style>