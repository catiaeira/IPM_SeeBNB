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
    
    <!-- Dates -->
    <div class="dates">
      <span class="text">Disponível</span>
      <label class="text">De <input type="date" v-model="filters.dateFrom" class="date-input" /></label>
      <label class="text">Até <input type="date" v-model="filters.dateTo" class="date-input" /></label>
    </div>

    <!-- Durations -->
    <div class="column">
      <OptionToggle label="Curto Prazo" v-model="filters.short" />
      <OptionToggle label="Longo Prazo" v-model="filters.long" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import DoubleSlider from "./DoubleSlider.vue"
import OptionToggle from "./OptionToggle.vue";

const filters = reactive({
  private_room: false,
  shared_room: false,
  apt: false,
  hotel: false,
  priceMin: null,
  priceMax: null,
  rating: 0,
  dateFrom: null,
  dateTo: null,
  short: false,
  long: false,
})
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--accent);
  border-radius: 18px;
  width: auto;
  gap: 30px;
}

.column {
  display: flex;
  flex-direction: column;
  width: auto;
  gap: 5px;
}

.price,
.rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-input {
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
}

.input {
  width: 60px;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
}

.text {
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 550;
}
</style>
