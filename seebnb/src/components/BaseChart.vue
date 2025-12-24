<template>
  <div class="chart-container">
    <Bar 
      v-if="chartData.labels.length > 0"
      :data="chartData" 
      :options="chartOptions" 
      :plugins="chartPlugins"
    />
    <p v-else>Loading data...</p>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const props = defineProps({
  listings: {
    type: Array,
    required: true,
    default: () => []
  },
  listings2: {
    type: Array,
    required: false,
    default: () => []
  },
  mainLabel : String
});

const chartData = computed(() => {
  switch (props.mainLabel) {
    case 'listsPerHost':
      return calcListsPerHost();

    case 'listsPerHostCompare':
      return calcListsPerHostCompare();

    case 'ocupationCompare':
      return calcOcupationCompare(); 
    default:
      return null;;
  }
});


const chartOptions = computed (() => ({
  responsive: true,
  layout: {
    padding: {
      top: 13,
      right: 5
    }
  },
  plugins: {
    datalabels: {
      align: 'end',   // positions text relative to the anchor
      anchor: 'end',  // anchoring the text to the top of the bar/point
      color: '#333'
    },
    legend: { display: false } 
  },
  scales: {
    y: {
      ticks: { display: false }, // hides the numbers on the Y axis
      grid: { display: false },  // hides grid lines 
      title: {
        display: true,
        text: chartData.value ? chartData.value.yAxisLabel : '', // Y-axis description
        font: { size: 15, weight: 'bold' }
      }
    },
    x : {
      grid: { display: false },  // hides grid lines 
      title: {
        display: true,
        text: chartData.value ? chartData.value.xAxisLabel : '', // X-axis description
        font: { size: 15, weight: 'bold' }
      }
    }
  }
}));

function getHostsTotalListings (listings, counts, LIMIT, LIMIT_TEXT) {
  listings.forEach(l => {
      let count = l.host_total_listings_count;
      if (count !== undefined && count !== null) {
        const bucket = count >= LIMIT ? LIMIT_TEXT : count.toString();
        counts[bucket] = (counts[bucket] || 0) + 1;
      }
    });
}

function calcListsPerHost() {
  const counts = {};
  const LIMIT = 15;
  const LIMIT_TEXT = LIMIT + "+";

  getHostsTotalListings(props.listings, counts, LIMIT, LIMIT_TEXT);

  const sortedKeys = Object.keys(counts).sort((a, b) => {
    if (a === LIMIT_TEXT) return 1;
    if (b === LIMIT_TEXT) return -1;
    return Number(a) - Number(b);
  });

  return {
    labels: sortedKeys, 
    yAxisLabel: 'Nº de Hosts',
    xAxisLabel: 'Listagens por Host',
    datasets: [
      {
        data: sortedKeys.map(key => counts[key]), 
        backgroundColor: '#E3E7FF', // --var(cor_fundo_light) 
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: 0.9,
        barPercentage: 0.8,
      }
    ]
  };
}

function calcListsPerHostCompare() {
  const counts1 = {};
  const counts2 = {};
  const LIMIT = 10;
  const LIMIT_TEXT = LIMIT + "+";

  getHostsTotalListings(props.listings, counts1, LIMIT, LIMIT_TEXT)
  getHostsTotalListings(props.listings2, counts2, LIMIT, LIMIT_TEXT)

  // list with both keys
  const allKeys = [...new Set([...Object.keys(counts1), ...Object.keys(counts2)])];
  const sortedKeys = allKeys.sort((a, b) => {
    if (a === LIMIT_TEXT) return 1;
    if (b === LIMIT_TEXT) return -1;
    return Number(a) - Number(b);
  });

  const data1 = sortedKeys.map(key => counts1[key] || 0);
  const data2 = sortedKeys.map(key => counts2[key] || 0);
  const averageData = data1.map((val, i) => (val + data2[i]) / 2);
  const categoryPercentage = 0.9;
  const barPercentage = 0.9; 

  return {
    labels: sortedKeys, 
    yAxisLabel: 'Nº de Hosts',
    xAxisLabel: 'Listagens por Host',
    datasets: [
      {
        type: 'line', 
        data: averageData,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        datalabels: {
          display: false
        }
      },
      {
        data: data1, 
        backgroundColor: '#E3E7FF',
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      {
        data: data2, 
        backgroundColor: '#AAE4E2',
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      
    ],
  };
}

function countOcupation(listings, counts, buckets) {
  listings.forEach(l => {
    const val = l.estimated_occupancy_l365d; 
    
    if (val !== undefined && val !== null) {
      const targetBucket = buckets.find(b => val >= b.min && val <= b.max);
      if (targetBucket) {
        counts[targetBucket.label] = (counts[targetBucket.label] || 0) + 1;
      }
    }
  });
}

function calcOcupationCompare() {
  const allValues = [
    ...props.listings.map(l => l.estimated_occupancy_l365d || 0),
    ...props.listings2.map(l => l.estimated_occupancy_l365d || 0)
  ];
  
  const actualMax = allValues.length > 0 ? Math.max(...allValues) : 0; // get the max value
  
  const MAX_BARS = 10;
  const chunksOf = Math.max(Math.ceil(actualMax / MAX_BARS), 1);
  
  const buckets = [];

  for (let i = 0; i < MAX_BARS; i++) {
    const min = i * chunksOf;
    const isLast = i === MAX_BARS - 1;
    
    // the last bucket needs to captures everything from the min to the actualMax
    const max = isLast ? actualMax + 1000000 : (i + 1) * chunksOf - 1;
    const label = isLast ? `${min}+` : `${min}-${max}`;
    
    buckets.push({ min, max, label });
  }

  const counts1 = {};
  const counts2 = {};
  
  buckets.forEach(b => {
    counts1[b.label] = 0;
    counts2[b.label] = 0;
  });

  countOcupation(props.listings, counts1, buckets);
  countOcupation(props.listings2, counts2, buckets);

  const labels = buckets.map(b => b.label);
  const data1 = labels.map(label => counts1[label]);
  const data2 = labels.map(label => counts2[label]);
  const averageData = data1.map((val, i) => (val + data2[i]) / 2);

  const categoryPercentage = 1;
  const barPercentage = 0.9; 

  return {
    labels: labels, 
    yAxisLabel: 'Nº de Listagens',
    xAxisLabel: 'Ocupação (últimos 12 meses)',
    datasets: [
      {
        type: 'line', 
        data: averageData,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        datalabels: {
          display: false
        }
      },
      {
        data: data1, 
        backgroundColor: '#E3E7FF',
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      {
        data: data2, 
        backgroundColor: '#AAE4E2',
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      
    ],
  };
}

const chartPlugins = [ChartDataLabels];
</script>