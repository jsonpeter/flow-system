<template>
    <v-app :dark="inputValue">
        <core-filter />
        <!--<core-toolbar />-->
        <core-drawer />
        <core-view />
    </v-app>
</template>
<script>
    // Utilities
    import {
        mapMutations,
        mapState
    } from 'vuex'
    export default {
        computed: {
            ...mapState('app', ['bgcolor']),
            inputValue: {
                get () {
                    return this.$store.state.app.bgcolor
                }
            }
        }
    }
</script>
<style lang="scss">
    @import '@/styles/index.scss';

    /* Remove in 1.2 */
    .v-datatable thead th.column.sortable i {
        vertical-align: unset;
    }
    .v-datatable.v-table{
        th,td{
            text-align: center!important;
        }
    }
</style>
