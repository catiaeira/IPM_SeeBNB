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


const pluginBackground = {
  id: 'pluginBackground',
  beforeDraw: (chart) => {
    const { ctx, chartArea, config } = chart;

    if (!chartArea) return;

    const color = config.options.plugins?.chartAreaBackground?.color || '#F2FAFF' // --var(background) 

    ctx.save();
    ctx.fillStyle = color;
    const extraHeight = 23;
    ctx.fillRect(
      chartArea.left, 
      chartArea.top - extraHeight, 
      chartArea.width, 
      chartArea.height + extraHeight
    );
    
    ctx.restore();
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  pluginBackground
)
const props = defineProps({
  listings1: { // normal listing 
    type: Array,
    required: true,
    default: () => []
  },
  listings2: {  // normal listing, 2nd city
    type: Array,
    required: false,
    default: () => []
  },
  listingsTri1: { // archived listing of the trimester
    type: Array,
    required: false,
    default: () => []
  },
  listingsTri2: { // archived listing of the trimester
    type: Array,
    required: false,
    default: () => []
  },
  triState: {
    required: false,
    default: 0
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
    
    case 'trimestral':
      if      (props.triState == 0) return calcTriListings();
      else if (props.triState == 1) return calcTriPrice();
      else if (props.triState == 2) return calcTriOccupation();
      else return null;

    case 'listsPerMonths':
      return calcListsPerHostMonth();
    default:
      return null;;
  }
});


const chartOptions = computed (() => ({
  responsive: true,
  layout: {
    padding: {
      top: 35,
      bottom: -5,
      right: 5
    }
  },
  plugins: {
    datalabels: {
      align: 'end',   // positions text relative to the anchor
      anchor: 'end',  // anchoring the text to the top of the bar/point
      color: '#333'
    },
    legend: { display: false },

    customBackground: {
      color: '#E3E7FF', // --var(cor_fundo_light) 
    }
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
      if (count !== undefined && count !== null && count > 0) {
        const bucket = count >= LIMIT ? LIMIT_TEXT : count.toString();
        counts[bucket] = (counts[bucket] || 0) + 1;
      }
    });
}

function calcListsPerHost() {
  const counts = {};
  const LIMIT = 15;
  const LIMIT_TEXT = LIMIT + "+";

  getHostsTotalListings(props.listings1, counts, LIMIT, LIMIT_TEXT);

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

  getHostsTotalListings(props.listings1, counts1, LIMIT, LIMIT_TEXT)
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
        pointRadius: 2,
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
    ...props.listings1.map(l => l.estimated_occupancy_l365d || 0),
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

  countOcupation(props.listings1, counts1, buckets);
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
        pointRadius: 2,
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
  }
}

function calcTriListings() {
  const labels = ['Mar-Mai', 'Jun-Ago', 'Set-Nov'];

  const dataPoints = [
    props.listingsTri2?.length || 0,
    props.listingsTri1?.length || 0,
    props.listings1?.length || 0
  ];

  return {
    labels: labels,
    datasets: [
      {
        type: 'line',
        data: dataPoints,
        borderColor: '#AAE4E2', // --var(cor_barra) 
        backgroundColor: '#E3E7FF', // --var(cor_fundo_light) 
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: '#AAE4E2', // --var(cor_barra) 
      }
    ]
  };
}

function calcTriPrice() {
  const labels = ['Mar-Mai', 'Jun-Ago', 'Set-Nov'];
  const triLists = [props.listingsTri2, props.listingsTri1, props.listings1];

  const averages = triLists.map(list => {
    let total = 0;
    let validCount = 0;

    list.forEach(l => {
      if (l.price) {
        const cleanPrice = parseFloat(l.price.replace(/[$,]/g, ''));

        if (!isNaN(cleanPrice) && cleanPrice !== null) {
          total += cleanPrice;
          validCount++;
        }
      }
    });

    return validCount > 0 ? parseFloat((total / validCount).toFixed(2)) : 0;
  });

  return {
    labels: labels,
    datasets: [
      {
        type: 'line',
        data: averages,
        borderColor: '#AAE4E2', // --var(cor_barra) 
        backgroundColor: '#E3E7FF', // --var(cor_fundo_light) 
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: '#AAE4E2', // --var(cor_barra) 
      }
    ]
  };
}

function calcTriOccupation() {
  const labels = ['Mar-Mai', 'Jun-Ago', 'Set-Nov'];
  const triLists = [props.listingsTri2, props.listingsTri1, props.listings1];

  const averages = triLists.map(list => {
    let total = 0;
    let validCount = 0;

    list.forEach(l => {
      if (l.estimated_occupancy_l365d) {
        const cleanOccupancy = parseInt(l.estimated_occupancy_l365d);

        if (!isNaN(cleanOccupancy) && cleanOccupancy !== null) {
          total += cleanOccupancy;
          validCount++;
        }
      }
    });

    return validCount > 0 ? parseFloat((total / validCount).toFixed(2)) : 0;
  });

  return {
    labels: labels,
    datasets: [
      {
        type: 'line',
        data: averages,
        borderColor: '#AAE4E2', // --var(cor_barra) 
        backgroundColor: '#E3E7FF', // --var(cor_fundo_light) 
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: '#AAE4E2', // --var(cor_barra) 
      }
    ]
  };
}

function calcListsPerHostMonth() {
  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const aggregateByMonth = (data) => {
    const monthlyTotals = {};
    for (let i = 1; i <= 12; i++) monthlyTotals[i] = 0;

    data.forEach(item => {
      const m = parseInt(item.month);
      const days = parseInt(item.available_days);
      if (!isNaN(m) && !isNaN(days)) {
        monthlyTotals[m] += days;
      }
    });
    return monthlyTotals;
  };

  const totals1 = aggregateByMonth(props.listings1);
  const totals2 = aggregateByMonth(props.listings2);

  // ordered 1 to 12
  const dataPoints1 = Object.keys(totals1).map(m => totals1[m]);
  const dataPoints2 = Object.keys(totals2).map(m => totals2[m]);

  return {
    labels: monthNames,
    yAxisLabel: 'Nº de Listagens',
    datasets: [
      {
        type: 'line',
        data: dataPoints1,
        borderColor: '#E3E7FF',
        backgroundColor: '#E3E7FF',
        borderWidth: 3,
        tension: 0.4, 
        pointRadius: 4,
      },
      {
        type: 'line',
        data: dataPoints2,
        borderColor: '#AAE4E2',
        backgroundColor: '#AAE4E2',
        borderWidth: 3,
        tension: 0.4, 
        pointRadius: 4,
      }
    ]
  };
}

const chartPlugins = [ChartDataLabels];
</script>