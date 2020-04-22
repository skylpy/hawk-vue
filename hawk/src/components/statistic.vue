<template>
   <statistic-index></statistic-index>
</template>

<script>
    import statisticIndex from 'components/report/statisticsindex.vue';
export default {
    name: "statistic",
    components: {
        statisticIndex
    },
    props: {

    }, 

    data: () => {
        return {
            initComplete :false
        }
    },

    computed: {

    },

    methods: {
        initStatistics(){
            this.initComplete = true
        }
    }
}
</script>
