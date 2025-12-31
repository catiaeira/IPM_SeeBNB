<template>
    <ul class="stats-card">
          <li class="stat-row">
            <span>Avaliação média</span>
            <span>
              <div class="stars-outer">
                <div class="stars-inner"
                     :style="{ width: `${(averageRating / 5) * 100}%` }"></div>
              </div>
            </span>
          </li>
          <li class="stat-row">
            <span>Preço médio por noite</span>
            <span>${{ averagePrice }}</span>
          </li>
          <li class="stat-row">
            <span>Nº noites tipicamente alugadas</span>
            <span>{{ averageRentedNights }}</span>
          </li>
          <li class="stat-row">
            <span>Rendimento médio (anual)</span>
            <span>${{ averageProfit}}</span>
          </li>
          <li class="stat-row">
            <span>Nº de alojamentos locais</span>
            <span>{{ new Intl.NumberFormat('pt-PT').format(allListings.length) }}</span>
          </li>
          <li class="stat-row">
            <span>Percentagem de short-rentals</span>
            <span>{{shortRentalPercentage}}%</span>
          </li>
    </ul>
</template>


<style>
    .stats-card {
        background: #f6f8ff;
        border-radius: 12px;
        padding: 1.5rem;
        display: grid;
        grid-auto-rows: 1fr;
        gap: 0.75rem;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #dde2ff;
        font-size: 1.1rem;
    }

    .stars-outer {
        font-family: serif;    
        font-size: 30px;    
        display: inline-block;
        position: relative;
        -webkit-text-stroke: 0.5px black;
        color: #CBD2FF; /* var (--cor_fundo*/
    }

    .stars-outer::before {
        content: "★★★★★";
    }

    .stars-inner {
        position: absolute;
        top: 0;
        left: 0;
        white-space: nowrap;
        overflow: hidden;
        width: 0; 
        color: #AAE4E2;  /*var(--cor_barra) */
    }

    .stars-inner::before {
        content: "★★★★★";
    }
</style>

<script>
    export default {
        data() {
            return {
                averageRating: 0,
                averagePrice: 0,
                averageRentedNights: 0,
                averageProfit: 0,
                shortRentalPercentage: 0,
            }
        },
        props: {
            allListings: {
                type: Array,
                required: true,
                default: () => []
            },
        },
        async created() {
            this.calcStats();
        },
        watch: {
            allListings: {   // whenever the parent updates the listings we need to refresh the data
                immediate: true, 
                handler(newListings) {
                    this.calcStats(newListings);
                }
            }
        },
        methods: { 
            calcStats() {
                const listings = this.allListings || [];

                console.log("first listing: ", listings[0])
                
                let totals = { rating: 0, price: 0, nights: 0, profit: 0, shortRental: 0 };
                let counts = { rating: 0, price: 0, nights: 0, profit: 0 };

                listings.forEach(l => {
                    const rating = parseFloat(l.review_scores_rating);
                    if (!isNaN(rating)) {
                        totals.rating += rating;
                        counts.rating++;
                    }

                    if (l.price) {
                        const cleanPrice = parseFloat(l.price.replace(/[$,]/g, ''));
                        if (!isNaN(cleanPrice)) {
                            totals.price += cleanPrice;
                            counts.price++;
                        }
                    }

                    const nights = parseInt(l.estimated_occupancy_l365d);
                    if (!isNaN(nights)) {
                        totals.nights += nights;
                        counts.nights++;
                    }

                    const profit = parseFloat(l.estimated_revenue_l365d);
                    if (!isNaN(profit)) {
                        totals.profit += profit;
                        counts.profit++;
                    }

                    if (parseInt(l.minimum_nights) < 30) {
                        totals.shortRental += 1;
                    }
                });

                const getAvg = (total, count) => (count > 0 ? (total / count) : 0);

                this.averageRating = getAvg(totals.rating, counts.rating).toFixed(2);
                this.averagePrice = getAvg(totals.price, counts.price).toFixed(2);
                this.averageRentedNights = Math.round(getAvg(totals.nights, counts.nights));
                this.averageProfit = new Intl.NumberFormat('pt-PT').format(getAvg(totals.profit, counts.profit).toFixed(2));
                this.shortRentalPercentage = listings.length > 0 
                    ? ((totals.shortRental / listings.length) * 100).toFixed(2) 
                    : 0;
            }
        }
    }
</script>