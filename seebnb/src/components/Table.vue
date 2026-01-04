<template>
    <table>
        <thead>
            <tr>
                <th v-for="header in props.columns">{{ header }}</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="row in props.rows">
                <td v-for="cell in row">{{ cell }}</td>
            </tr>
        </tbody>
    </table>
</template>


<script setup>
    import { defineProps } from 'vue';
    const props = defineProps({
        columns: {
            type: Array,
            required: true
        },
        rows: {
            type: Array,
            required: true
        }
    })
</script>


<style scoped>
    table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
    }

    th, td{
        border: 1px solid black;
        padding: 0.5rem;
        text-align: left;
        vertical-align: middle;
    }

    th {
        font-weight: bold;
        background-color: var(--light-blue);
    }

</style>