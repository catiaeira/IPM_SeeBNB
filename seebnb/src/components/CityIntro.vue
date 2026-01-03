<template>
    <div class="background"
        :style="{backgroundImage: image}">
        <div class="overlay">
            <span class="name">{{ cityname }}</span>
            <div class="circle" :style="{ '--circle-color': color }"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import ImageDict from "@/assets/ImageDict"

const props = defineProps({
    cityname: String,
    color: String
})

const image = computed(() =>
    `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0), var(--background)),
    url(${ImageDict[props.cityname]})`
)
</script>

<style scoped>
.background {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 40vh;
    position: relative;
}

.overlay {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: absolute;
    inset: auto auto 20% 5%;
}

.name {
    color: var(--image_text);
    font-size: 2rem;
    font-weight: 600;
    text-shadow:
        0 0 2px var(--text),
        0 0 4px var(--text),
        0 0 6px var(--text),
        0 0 8px var(--text);

}

.circle {
    height: 3vh;
    width: 3vh;
    border-radius: 50%;
    background-color: var(--circle-color);
    border: 2px solid var(--text);
    box-shadow:
        0 0 2px var(--text),
        0 0 4px var(--text),
        0 0 6px var(--text),
        0 0 8px var(--text);
}

</style>