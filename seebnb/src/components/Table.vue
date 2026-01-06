<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(col, colIndex) in columns"
          :key="colIndex"
        >
          <span>{{ col.label }}</span>

          <button
            v-if="col.sortable"
            @click="toggleSort(colIndex)"
            class="sort-btn"
          >
            {{ sortIndicator(colIndex) }}
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, rowIndex) in sortedRows" :key="rowIndex">
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
          {{ formatCell(cell, cellIndex) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  columns: {
    type: Array, // array of objects {column label, sortable boolean}
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
})

const sortColumn = ref(null)   // index of the column currently sorted
const sortDirection = ref(1)   // 1 = asc, -1 = desc

function toggleSort(colIndex) {
  if (sortColumn.value === colIndex) {
    sortDirection.value *= -1
  } else {
    sortColumn.value = colIndex
    sortDirection.value = 1
  }
}

const sortedRows = computed(() => {
  if (sortColumn.value === null) return props.rows

  return [...props.rows].sort((a, b) => {
    const valA = a[sortColumn.value]
    const valB = b[sortColumn.value]

    if (valA === valB) return 0
    if (valA > valB) return sortDirection.value
    return -sortDirection.value
  })
})

function sortIndicator(colIndex) {
  if (sortColumn.value !== colIndex) return '⇅'
  return sortDirection.value === 1 ? '↑' : '↓'
}

function formatCell(value, colIndex) {
  const column = props.columns[colIndex]

  if(column.format) return column.format(value)

  return value
}

</script>


<style scoped>
    table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
    }

    th, td {
        border: 1px solid black;
        padding: 0.5rem;
        text-align: left;
        vertical-align: middle;
    }

    th {
        font-weight: bold;
        background-color: var(--light-blue);
    }

    .sort-btn {
        margin-left: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1em;
    }

</style>