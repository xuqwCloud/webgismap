<template>
    <div id="mapview"></div>
</template>

<script>
import { loadModules } from 'esri-loader';

const options = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};

export default {
    name: 'Mapview',
    components: {},
    mounted: function () {
        //console.log(this.$store.getters._defaultMapView);
        this._createMapView();
    },
    methods: {
        async _createMapView() {
            const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView'], options);

            const map = new Map({
                basemap: 'osm',
            });

            const mapView = new MapView({
                container: 'mapview',
                map: map,
                zoom: 10,
                center: [104.072745, 30.663774],
            });

            mapView.ui.components = [];

            this.$store.commit('_setDefaultMapView', mapView);
        },
    },
};
</script>

<style>
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
