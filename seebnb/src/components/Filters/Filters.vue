<template>
  <div class="filter-bar">
    <!-- Room type -->
    <div class="column">
      <OptionToggle label="Quarto privado" v-model="filters.private_room" />
      <OptionToggle label="Quarto partilhado" v-model="filters.shared_room" />
    </div>

    <!-- Housing type -->
    <div class="column">
      <OptionToggle label="APT/Casas" v-model="filters.apt" />
      <OptionToggle label="Hotel" v-model="filters.hotel" />
    </div>

    <div class="column">
      <!-- Price -->
      <div class="price">
        <span class="text">Preço por noite de</span>
        <input type="number" v-model="filters.priceMin" class="input" />
        <span class="text">a</span>
        <input type="number" v-model="filters.priceMax" class="input" />
      </div>

      <!-- Rating -->
      <div class="rating">
        <span class="text">Avaliação:</span>
        <DoubleSlider v-model="filters.rating" />
      </div>
    </div>

    <!-- Durations -->
    <div class="column">
      <OptionToggle label="Curto Prazo" v-model="filters.short" />
      <OptionToggle label="Longo Prazo" v-model="filters.long" />
    </div>
  </div>
</template>

<script setup>
import DoubleSlider from "./DoubleSlider.vue"
import OptionToggle from "./OptionToggle.vue";
import { watch } from "vue";

const props = defineProps({ filters: Object })
const filters = props.filters
const emit = defineEmits(['update']);

watch(() => props.filters, (newVal) => 
        {emit('update', newVal);
          console.log("new filters: ", newVal)
        },
        { deep: true });
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--blue);
  border-radius: 18px;
  gap: 2rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.price,
.rating {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.dates {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input {
  padding: 4px 6px;
  border: none;
  border-radius: 6px;
  background: white;
  width: 60px;
}

.text {
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 550;
}

</style>
