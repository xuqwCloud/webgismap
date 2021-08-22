<template>
    <div class="mapview-pannel">
        <div id="mapview"></div>
        <div id="basemapToggle"></div>
        <div id="scaleBar"></div>
        <div id="zoom"></div>
        <div class="view-change" @click="handleViewChale">
            <span>{{ viewModel }}</span>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './../config';

export default {
    name: 'Mapview',
    components: {},
    data() {
        return {
            viewModel: '3D',
        };
    },
    mounted: function () {
        //console.log(this.$store.getters._defaultMapView);
        this._createMapView();
    },
    methods: {
        async _createMapView() {
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scaleBar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                    'esri/widgets/Zoom',
                ],
                config.options,
            );

            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });

            const map = new Map({
                basemap,
            });

            const mapView = new MapView({
                container: 'mapview',
                map: map,
                zoom: 10,
                center: [104.072745, 30.663774],
            });

            //实例化底图切换控件
            this.basemapToggle = new BasemapToggle({
                view: mapView,
                nextBasemap: 'hybrid',
                container: 'basemapToggle',
            });
            mapView.ui.add(this.basemapToggle);

            //实例化比例尺
            this.scaleBar = new ScaleBar({
                view: mapView,
                unit: 'metric',
                container: 'scaleBar',
            });
            mapView.ui.add(this.scaleBar);

            //实例化缩放控件
            this.zoom = new Zoom({
                view: mapView,
                container: 'zoom',
            });
            mapView.ui.add(this.zoom);

            mapView.ui.components = [];

            this.$store.commit('_setDefaultMapView', mapView);
        },
        async _createSceneView() {
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scaleBar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            const [Map, SceneView, Basemap, TileLayer] = await loadModules(
                ['esri/Map', 'esri/views/SceneView', 'esri/Basemap', 'esri/layers/TileLayer'],
                config.options,
            );

            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });

            const map = new Map({
                basemap,
            });

            const sceneView = new SceneView({
                container: 'mapview',
                map: map,
            });

            setTimeout(() => {
                sceneView.goTo({
                    zoom: 10,
                    center: [104.072745, 30.663774],
                });
            }, 3000);

            sceneView.ui.components = [];

            this.$store.commit('_setDefaultMapView', sceneView);
        },
        //二三维切换
        handleViewChale() {
            if (this.viewModel === '3D') {
                this._createSceneView();
                this.viewModel = '2D';
            } else {
                this._createMapView();
                this.viewModel = '3D';
            }
        },
    },
};
</script>

<style>
.mapview-pannel,
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
}
#basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
}
#scaleBar {
    position: absolute;
    left: 15px;
    bottom: 15px;
}
#zoom {
    position: absolute;
    right: 15px;
    bottom: 100px;
}
.view-change {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 15px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-change span {
    line-height: 32px;
}
</style>
