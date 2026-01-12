<template>
  <!-- button -->
    <img
        :src="shareIcon"
        @click="togglePopup"
        width="20px"
        class="share-button"
        v-if="notOnHome"
        />

  <!-- backdrop -->
  <div
    v-if="state !== 'button'"
    class="backdrop"
    @click="togglePopup"
  ></div>

  <!-- popup -->
  <div v-if="state !== 'button'" id="popup" @click.stop>
    <div class="content">
        <img :src="ImageDict.shareDark"
            width="70px"
        />

        <div class="share">
            <span class="text">Partilhar página:</span>
            <div class="buttons">

              <!-- copy link -->
              <!-- a href="https://www.flaticon.com/free-icons/link" title="link icons">Link icons created by Freepik - Flaticon</a -->
              <svg @click="copyURL" id="copy-link" class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.000000 512.000000" fill="currentColor"
              preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                  <path d="M3785 5114 c-233 -36 -422 -112 -587 -238 -40 -30 -320 -303 -623
                  -606 -416 -417 -543 -549 -520 -543 17 4 104 7 195 7 185 -1 296 -17 448 -66
                  l95 -30 391 390 c366 364 396 392 466 426 241 117 504 74 691 -113 161 -161
                  217 -386 150 -601 -42 -135 -58 -152 -680 -773 -561 -560 -589 -586 -662 -622
                  -52 -25 -107 -42 -173 -53 -89 -15 -103 -15 -192 0 -121 20 -211 64 -316 151
                  -94 80 -152 102 -248 95 -93 -7 -146 -39 -270 -163 l-103 -103 49 -74 c172
                  -259 465 -443 793 -499 100 -17 312 -15 414 5 100 19 235 65 322 109 152 76
                  196 116 803 721 326 325 618 624 649 664 105 140 189 328 224 507 8 40 14 132
                  14 215 0 158 -12 235 -56 373 -130 399 -465 703 -879 798 -83 19 -327 33 -395
                  23z"/>
                  <path d="M2055 3424 c-169 -26 -337 -92 -489 -191 -87 -57 -1236 -1196 -1325
                  -1313 -100 -133 -180 -309 -217 -480 -26 -118 -26 -362 0 -480 102 -473 463
                  -834 936 -936 118 -26 362 -26 480 0 171 37 347 117 480 218 41 31 323 305
                  625 608 548 550 550 552 505 544 -77 -12 -330 -6 -425 10 -49 9 -136 30 -193
                  48 l-103 32 -392 -391 c-367 -365 -397 -393 -467 -427 -241 -117 -504 -74
                  -691 113 -161 161 -217 386 -150 601 42 135 57 152 685 777 569 567 594 591
                  662 621 234 106 484 71 673 -93 84 -74 132 -97 211 -102 110 -8 163 19 297
                  150 62 61 113 114 113 118 0 4 -23 42 -52 85 -241 360 -711 558 -1163 488z"/>
                </g>
              </svg>

              <!-- facebook -->
              <ShareNetwork network="facebook" :url=fullUrl v-slot="{ share }">
                <!-- a href="https://www.flaticon.com/free-icons/facebook" title="facebook icons">Facebook icons created by IconsBox - Flaticon</a -->
                <svg @click="share" id="facebook" class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512.000000 512.000000" fill="currentColor"
                  preserveAspectRatio="xMidYMid meet">

                  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                    <path d="M805 4748 c-89 -16 -204 -80 -278 -153 -77 -76 -138 -190 -156 -289
                    -15 -83 -15 -3409 0 -3492 18 -99 79 -213 156 -289 76 -76 190 -137 287 -154
                    39 -7 344 -11 888 -11 l828 0 0 915 0 915 -185 0 -185 0 0 365 0 365 179 0
                    178 0 6 233 c6 247 16 316 63 435 80 203 231 337 454 403 70 21 97 23 448 27
                    l372 4 0 -316 0 -316 -227 0 c-251 0 -274 -5 -317 -63 -19 -26 -21 -45 -24
                    -218 l-3 -189 291 0 291 0 -5 -42 c-4 -24 -17 -173 -31 -333 -14 -159 -28
                    -305 -31 -322 l-5 -33 -269 0 -270 0 0 -915 0 -915 493 0 c306 0 516 4 553 11
                    99 18 213 79 289 156 76 76 137 190 154 287 15 83 15 3409 0 3492 -38 213
                    -230 405 -443 443 -77 14 -3428 13 -3501 -1z"/>
                  </g>
                </svg>
              </ShareNetwork>

              <!-- twitter -->
              <ShareNetwork network="twitter" :url=fullUrl v-slot="{ share }">
                <!-- a href="https://www.flaticon.com/free-icons/tweet" title="tweet icons">Tweet icons created by Freepik - Flaticon</a -->
                <svg @click="share" id="twitter" class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512.000000 512.000000" fill="currentColor"
                  preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                        <path d="M412 5100 c-97 -26 -173 -70 -248 -144 -75 -76 -119 -151 -144 -252
                        -20 -76 -20 -115 -20 -2144 0 -2029 0 -2068 20 -2144 25 -101 69 -176 144
                        -252 76 -75 151 -119 252 -144 76 -20 115 -20 2144 -20 2029 0 2068 0 2144 20
                        101 25 176 69 252 144 75 76 119 151 144 252 20 76 20 115 20 2144 0 2029 0
                        2068 -20 2144 -26 103 -69 177 -149 256 -79 77 -142 114 -247 140 -76 20 -117
                        20 -2148 19 -2010 0 -2073 -1 -2144 -19z m1890 -1407 c244 -356 448 -648 454
                        -649 5 -1 252 281 549 627 297 346 549 639 561 650 19 18 33 19 169 17 l148
                        -3 -628 -730 c-345 -401 -635 -739 -645 -750 -18 -20 -5 -40 686 -1045 387
                        -564 704 -1026 704 -1027 0 -2 -233 -3 -518 -3 l-518 0 -473 690 c-261 379
                        -477 688 -480 685 -4 -2 -272 -312 -596 -689 l-590 -686 -153 0 -154 0 40 48
                        c22 26 328 382 680 790 l640 744 -586 851 c-321 469 -627 914 -679 990 l-94
                        137 519 0 520 0 444 -647z"/>
                        <path d="M1252 4088 c44 -67 2142 -3065 2152 -3076 9 -9 67 -12 244 -10 l231
                        3 -1083 1550 -1084 1550 -237 3 -238 2 15 -22z"/>
                    </g>
                </svg>
              </ShareNetwork>

              <!-- linkedin -->
              <ShareNetwork network="linkedin" :url=fullUrl v-slot="{ share }">
                <!-- a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons">Linkedin icons created by Dave Gandy - Flaticon</a -->
                <svg @click="share" id="linkedin" class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512.000000 512.000000" fill="currentColor"
                  preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                        <path d="M807 5109 c-304 -45 -588 -262 -722 -553 -19 -40 -44 -110 -57 -157
                        l-23 -84 0 -1755 0 -1755 23 -84 c92 -338 354 -600 692 -693 l85 -23 1750 0
                        1750 0 88 22 c339 87 613 361 700 700 l22 88 0 1745 0 1745 -22 88 c-45 175
                        -138 332 -271 459 -125 119 -255 194 -417 240 l-80 23 -1730 1 c-952 1 -1756
                        -2 -1788 -7z m474 -859 c217 -40 359 -241 322 -455 -15 -88 -47 -150 -108
                        -211 -60 -61 -111 -89 -197 -109 -270 -64 -506 75 -549 324 -21 120 23 255
                        110 339 106 102 259 142 422 112z m2329 -1064 c207 -34 375 -127 499 -275 92
                        -112 150 -240 193 -429 21 -95 22 -117 25 -874 l4 -778 -385 0 -386 0 0 664
                        c0 731 -3 782 -60 901 -37 78 -89 131 -159 164 -50 23 -68 26 -166 26 -100 0
                        -116 -3 -172 -29 -74 -34 -167 -126 -207 -203 -14 -29 -30 -83 -36 -120 -5
                        -39 -10 -353 -10 -736 l0 -667 -382 2 -383 3 3 1155 3 1155 380 3 379 2 0
                        -162 1 -163 26 35 c15 19 65 73 112 120 185 183 431 254 721 206z m-2050
                        -1196 l0 -1160 -385 0 -385 0 0 1160 0 1160 385 0 385 0 0 -1160z"/>
                    </g>
                </svg>
              </ShareNetwork>

              <!-- whatsapp -->
              <ShareNetwork network="whatsapp" :url=fullUrl v-slot="{ share }">
                <!-- a href="https://www.flaticon.com/free-icons/whatsapp" title="whatsapp icons">Whatsapp icons created by Pixel perfect - Flaticon</a -->
                <svg @click="share" id="whatsapp" class="icon" version="1.0" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512.000000 512.000000" fill="currentColor"
                  preserveAspectRatio="xMidYMid meet">
                
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
                        <path d="M2405 5114 c-16 -2 -73 -9 -125 -15 -840 -94 -1611 -626 -1990 -1374
                        -361 -710 -356 -1572 12 -2297 l59 -117 -180 -653 c-99 -359 -179 -654 -178
                        -655 2 -1 305 77 675 174 l672 175 93 -45 c266 -129 544 -212 832 -248 146
                        -18 455 -15 605 5 937 126 1727 733 2064 1586 122 310 171 578 171 935 -1 238
                        -12 349 -56 550 -91 416 -312 843 -593 1142 -40 43 -77 85 -82 95 -13 24 -155
                        149 -259 228 -193 147 -446 286 -670 368 -131 48 -359 105 -505 127 -99 15
                        -480 28 -545 19z m415 -429 c628 -75 1169 -407 1522 -934 361 -540 449 -1241
                        233 -1861 -250 -715 -886 -1245 -1655 -1381 -148 -26 -410 -36 -559 -20 -297
                        31 -572 119 -842 271 l-106 59 -397 -103 c-224 -58 -396 -98 -396 -92 0 6 47
                        181 105 389 l104 378 -43 67 c-434 672 -443 1523 -24 2221 168 278 429 543
                        703 711 94 58 312 161 409 194 151 51 362 96 511 109 103 9 331 5 435 -8z"/>
                        <path d="M1575 3741 c-82 -37 -202 -198 -258 -344 -30 -79 -32 -88 -32 -237 0
                        -150 1 -158 33 -250 61 -175 157 -336 326 -544 435 -538 718 -743 1296 -937
                        274 -92 499 -68 710 76 133 90 185 179 209 358 14 99 6 134 -38 163 -20 13
                        -52 27 -71 31 -19 3 -114 44 -210 91 -219 105 -261 122 -310 122 -38 0 -42 -4
                        -133 -117 -158 -198 -168 -208 -214 -207 -53 2 -267 105 -392 189 -211 141
                        -412 356 -531 568 -40 72 -37 87 40 176 72 83 136 182 145 221 9 41 -215 581
                        -261 628 l-32 32 -118 0 c-94 0 -128 -4 -159 -19z"/>
                    </g>
                </svg>
              </ShareNetwork>

            </div>
        </div>

        <div class="download">
            <span class="text">Baixar dados:</span>
            <div class="buttons">
              <button class="button" @click = "createPng">PNG</button>
              <button class="button" @click="createCSV" :disabled="isLoadingCSV">
                {{ isLoadingCSV ? '(...)' : 'CSV' }}
              </button>
              <button class="button" @click="createJson" :disabled="isLoadingJSON">
                {{ isLoadingJSON ? '(...)' : 'JSON' }}
              </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ImageDict from '@/assets/ImageDict'
import * as htmlToImage from '@jpinsonneau/html-to-image';
import { fetchCityData, fetchComparisonData } from '@/utils/FetchCityData';
import { ShareNetwork } from "vue3-social-sharing";
import { useRoute } from 'vue-router'

const route = useRoute()
const notOnHome = computed(() => route.path !== '/home')
const fullUrl = computed(() => window.location.origin + route.fullPath)

const theme = ref('light')

const updateTheme = () => {
  theme.value =
    document.documentElement.getAttribute('theme') || 'light'
}

onMounted(() => {
  updateTheme()

  const observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['theme']
  })

  onUnmounted(() => observer.disconnect())
})

const shareIcon = computed(() =>
  theme.value === 'dark'
    ? ImageDict.shareDark
    : ImageDict.shareLight
)

const state = ref('button')

const togglePopup = () => {
  state.value = state.value === 'popup' ? 'button' : 'popup'
}

function copyURL() {
  navigator.clipboard.writeText(fullUrl.value)
  alert('Link copied!')
}

const isLoadingJSON = ref(false)
const isLoadingCSV = ref(false)

const city1 = computed(() =>
  route.params.city1 || route.params.city
)
const city2 = computed(() => route.params.city2)

const atCityView = computed(() => route.path.startsWith('/city'))

const cities = computed(() => {
  if (city2.value) return `${city1.value}-${city2.value}`
  return `${city1.value}`
})

async function createJson() {
  if (isLoadingJSON.value) return

  try {
    isLoadingJSON.value = true

    const exportData = atCityView.value
      ? await fetchCityData(city1.value, route.query)
      : await fetchComparisonData(city1.value, city2.value, route.query)

    if (!exportData) return

    const jsonString = JSON.stringify(exportData, null, 2)

    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${cities.value}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

  } catch (err) {
    console.error('Export failed:', err)
  } finally {
    isLoadingJSON.value = false
  }
}

// util
function jsonToCSV(array) {
  if (!array || array.length === 0) return '';
  
  const headers = Object.keys(array[0]);
  
  const rows = array.map(obj => 
    headers.map(header => {
      const value = obj[header] ?? '';
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

async function createCSV() {
  if (isLoadingCSV.value) return;
  
  try {
    isLoadingCSV.value = true;
    
    const exportData = atCityView.value
      ? await fetchCityData(city1.value, route.query)
      : await fetchComparisonData(city1.value, city2.value, route.query);

    if (!exportData) return;

    let dataToConvert = [];
    if (atCityView.value) {
      dataToConvert = exportData.mainListings; 
    } else {
      dataToConvert = [...exportData.city1.listings, ...exportData.city2.listings];
    }

    // convert JSON to CSV string
    const csv = jsonToCSV(dataToConvert);
    if (!csv) {
      console.warn("No data available to export");
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `${atCityView.value ? city1.value : 'comparison'}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (err) {
    console.error('Export failed:', err);
  } finally {
    isLoadingCSV.value = false;
  }
}


async function createPng() {
  let elements = []
  if (atCityView.value) {
    elements = ['stats', 'export-tri-list', 'export-tri-price', 'export-tri-ocup', 'cityChart', 'tableReg', 'tableZone']
  } else {
    elements = ['citiesStats', 'monthChart', 'ocupationChart', 'listsChart']
  }
  for (const elementId of elements) {
    const node = document.getElementById(elementId);
    
    if (!node) {
      console.warn(`Element with ID ${elementId} not found.`);
      continue;
    }
    try {
      const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background');
    
      const width = node.offsetWidth;
      const height = node.offsetHeight;

      const dataUrl = await htmlToImage.toPng(node, {
        backgroundColor: backgroundColor,
        width: width,   
        height: height,
        style: {
          margin: 0,    
          transform: 'none',
          left: 0,
          top: 0
        }
      });

      const link = document.createElement('a');
      link.download = `${cities.value}_${elementId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(`Error capturing ${elementId}:`, err);
    }
  }
}
</script>


<style scoped>
#popup {
    position: fixed;
    top: 25%;
    left: 25%;
    z-index: 15;
    background-color: #E3E7FF;
    border-radius: 50px;
    width: 50vw;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: inherit;
    height: inherit;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
  cursor: pointer;
}

.share, .download {
  width: inherit;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
}

.share-button {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.button {
  height: 50px;
  width: 80px;
  border: none;
  border-radius: 20px;
  background-color: black;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.1s ease, transform 0.1s ease;
}

.button:hover { background-color: var(--seagreen); }

.button:active { transform: scale(0.90); }

.icon {
  cursor: pointer;
  width: 50px;
  height: 50px;
}

svg { fill: black; }
svg:active { transform: scale(0.90); }

#copy-link:hover { fill: #838383 }
#copy-link:active { fill: #4B4B4B; }

#facebook { scale: 1.2; }
#facebook:hover { fill: #1877F2; }
#facebook:active { fill: #4267B2; }

#instagram:hover { fill: #E1306C; }
#instagram:active { fill: #C13584; }

#twitter:hover { fill: #838383; }
#twitter:active { fill: #4B4B4B; }

#linkedin:hover { fill: #0077B5; }
#linkedin:active { fill: #064687; }

#whatsapp:hover { fill: #25D366; }
#whatsapp:active { fill: #075E54; }

.text {
  color: black;
  font-size: 1.7rem;
}
</style>