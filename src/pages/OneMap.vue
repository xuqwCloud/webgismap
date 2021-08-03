<template>
    <div class="onemap-page">
        <Mapview />
        <MapTools />
    </div>
</template>

<script>
import Mapview from './../components/common/Mapview';
import MapTools from './../components/MapTools';

export default {
    name: 'OneMap',
    components: {
        Mapview,
        MapTools,
    },
    methods: {},
};
</script>

<style>
.onemap-page {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
