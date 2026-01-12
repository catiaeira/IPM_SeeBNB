<template>
  <div class="chart-container">
    <Bar 
      v-if="chartData && chartData.labels && chartData.labels.length > 0"
      :key="theme + props.mainLabel" 
      :data="chartData" 
      :options="chartOptions" 
      :plugins="chartPlugins"
    />
    <p v-else>Loading data...</p>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 30vh;
}

</style>

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

import { computed , onMounted} from 'vue';
import { Bar } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ref, watch, nextTick } from 'vue';

const pluginBackground = {
  id: 'pluginBackground',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;

    if (!chartArea) return;

    const color = themeColors.value.background 

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

// making sure the colors follow the theme  v v v
onMounted(() => {
  const currentHTMLTheme = document.documentElement.getAttribute('theme') || 'light';
  theme.value = currentHTMLTheme;

  const observer = new MutationObserver(() => {
    theme.value = document.documentElement.getAttribute('theme') || 'light';
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['theme'] });
});

const theme = ref('light');

const themeColors = ref({
  light_blue: '',
  sea_green: '',
  text: '',
  background: ''
});

const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

watch(theme, async () => {
  await nextTick();

  themeColors.value = {
    light_blue: getCSSVar('--light-blue'),
    sea_green: getCSSVar('--seagreen'),
    text:      getCSSVar('--text'),
    background: getCSSVar('--background')
  };
}, { immediate: true });

// ^ ^ ^

const chartData = computed(() => {
  switch (props.mainLabel) {
    case 'listsPerHost':
      return calcListsPerHost.value;

    case 'listsPerHostCompare':
      return calcListsPerHostCompare.value;

    case 'ocupationCompare':
      return calcOcupationCompare.value; 
    
    case 'trimestral':
      if      (props.triState == 0) return calcTriListings.value;
      else if (props.triState == 1) return calcTriPrice.value;
      else if (props.triState == 2) return calcTriOccupation.value;
      else return { labels: [], datasets: [] };

    case 'listsPerMonths':
      return calcListsPerHostMonth.value;
    default:
      return { labels: [], datasets: [] };
  }
});


const chartOptions = computed (() => ({
  responsive: true,
  maintainAspectRatio: false,
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
      color: themeColors.value.text
    },
    legend: { display: false },

    customBackground: {
    color: themeColors.value.light_blue
    }
  },
  scales: {
    y: {
      ticks: { display: false }, // hides the numbers on the Y axis
      grid: { display: false },  // hides grid lines 
      title: {
        display: true,
        text: chartData.value ? chartData.value.yAxisLabel : '', // Y-axis description
        font: { size: 15, weight: 'bold' },
        color: themeColors.value.text,
      },
      border: {
        color: themeColors.value.text,
      }
    },
    x : {
      grid: { display: false },  // hides grid lines 
      ticks: { color: themeColors.value.text },
      title: {
        display: true,
        text: chartData.value ? chartData.value.xAxisLabel : '', // X-axis description
        font: { size: 15, weight: 'bold' },
        color: themeColors.value.text
      },
      border: {
        color: themeColors.value.text,
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
const calcListsPerHost = computed(() => {
  if (!props.listings1?.length) {
    return { labels: [], datasets: [] };
  }
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
        backgroundColor: themeColors.value.light_blue,
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: 0.9,
        barPercentage: 0.8,
      }
    ]
  };
});
const calcListsPerHostCompare = computed(() => {
  if (!props.listings1?.length || !props.listings2?.length) {
    return { labels: [], datasets: [] };
  }
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
        backgroundColor: themeColors.value.light_blue,
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      {
        data: data2, 
        backgroundColor: themeColors.value.sea_green,
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      
    ],
  };
});

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

const calcOcupationCompare = computed(() => {
  if (!props.listings1?.length || !props.listings2?.length) {
    return { labels: [], datasets: [] };
  }
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
        backgroundColor: themeColors.value.light_blue,
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      {
        data: data2, 
        backgroundColor: themeColors.value.sea_green,
        borderColor: '#000000',
        borderWidth: 1,
        categoryPercentage: categoryPercentage,
        barPercentage: barPercentage, 
      },
      
    ],
  }
});

const calcTriListings = computed(() => {
  if (!props.listings1?.length || !props.listingsTri1?.length || ! props.listingsTri2?.length) {
    return { labels: [], datasets: [] };
  }
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
        borderColor: themeColors.value.sea_green, 
        backgroundColor: themeColors.value.light_blue,
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: themeColors.value.sea_green, 
      }
    ]
  };
});

const calcTriPrice = computed(() => {
  if (!props.listings1?.length || !props.listingsTri1?.length || ! props.listingsTri2?.length) {
    return { labels: [], datasets: [] };
  }
  const labels = ['Mar-Mai', 'Jun-Ago', 'Set-Nov'];
  const triLists = [props.listingsTri2, props.listingsTri1, props.listings1];

  const averages = triLists.map(list => {
    let total = 0;
    let validCount = 0;

    list.forEach(l => {
      if (l.price) {
        
        if (!isNaN(l.price) && l.price !== null) {
          total += l.price;
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
        borderColor: themeColors.value.sea_green,
        backgroundColor: themeColors.value.light_blue,
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: themeColors.value.sea_green,
      }
    ]
  };
});

const calcTriOccupation = computed(() => {
  if (!props.listings1?.length || !props.listingsTri1?.length || ! props.listingsTri2?.length) {
    return { labels: [], datasets: [] };
  }
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
        borderColor: themeColors.value.sea_green,
        backgroundColor: themeColors.value.light_blue,
        borderWidth: 4,
        tension: 0.4, 
        pointRadius: 4,
        pointBackgroundColor: themeColors.value.sea_green,
      }
    ]
  };
})

const calcListsPerHostMonth = computed(() => {
  if (!props.listings1?.length || !props.listings2?.length) {
    return { labels: [], datasets: [] };
  }
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
        borderColor: themeColors.value.light_blue,
        backgroundColor: themeColors.value.light_blue,
        borderWidth: 3,
        tension: 0.4, 
        pointRadius: 4,
      },
      {
        type: 'line',
        data: dataPoints2,
        borderColor: themeColors.value.sea_green,
        backgroundColor: themeColors.value.sea_green,
        borderWidth: 3,
        tension: 0.4, 
        pointRadius: 4,
      }
    ]
  };
});

const chartPlugins = [ChartDataLabels, pluginBackground];
</script>