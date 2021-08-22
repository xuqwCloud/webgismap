<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="xzqh">行政区导航</span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="maptree">目录树管理</span>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="area">面积测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="diymeasurement_distance"
                    >自定义测量(长度)</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-edit" command="diymeasurement_area">自定义测量(面积)</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-search" command="spacequery">空间查询</el-dropdown-item>
                <el-dropdown-item icon="el-icon-film" command="morescreen">多屏对比</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="swipanalyst">卷帘分析</el-dropdown-item>
                <el-dropdown-item icon="el-icon-picture-outline" command="printmap">地图打印</el-dropdown-item>
                <el-dropdown-item icon="el-icon-view" command="openPopup">开启图层弹窗</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="clear">清屏</span>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';

export default {
    name: 'MapTools',
    mounted: function () {
        const checkView = setInterval(() => {
            if (this.$store.getters._getDefaultMapView) {
                this._initSketchTool();
                clearInterval(checkView);
            }
        }, 200);
    },
    methods: {
        //初始化绘制工具
        async _initSketchTool() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            //1、绘制面状区域
            const [SketchViewModel, GraphicsLayer] = await loadModules(
                ['esri/widgets/Sketch/SketchViewModel', 'esri/layers/GraphicsLayer'],
                config.options,
            );

            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);

            _self.graphicsLayer = new GraphicsLayer({
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            view.map.add(_self.graphicsLayer);

            const polygonSymbol = {
                type: 'simple-fill',
                color: 'rgba(216,30,6, 0.4)',
                style: 'solid',
                outline: {
                    color: '#d81e06',
                    width: 1,
                },
            };
            _self.sketchViewModel = new SketchViewModel({
                updateOnGraphicClick: false,
                view,
                layer: _self.graphicsLayer,
                polygonSymbol,
            });
        },
        handleMapToolsitemClick(e) {
            switch (e.target.id) {
                case 'xzqh':
                    this.openXZQHPannel();
                    break;
                case 'maptree':
                    this.openMapTreePannel();
                    break;
                case 'clear':
                    this.handleClearMap();
                    break;
                default:
                    break;
            }
        },
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    this.initDistanceMap();
                    break;
                case 'area':
                    this.initAreaMap();
                    break;
                case 'diymeasurement_distance':
                    this.initDIYMeasurement('distance');
                    break;
                case 'diymeasurement_area':
                    this.initDIYMeasurement('area');
                    break;
                case 'spacequery':
                    this.initSpaceQuery();
                    break;
                case 'morescreen':
                    this.$router.push('/onemap/one');
                    break;
                case 'swipanalyst':
                    this._initSwipe();
                    break;
                case 'printmap':
                    this.handlePrintMap();
                    break;
                case 'openPopup':
                    this.openMapPopup();
                    break;
                default:
                    break;
            }
        },
        openXZQHPannel() {
            let currentVisible = this.$store.getters._getDefaultXZQHVisible;
            this.$store.commit('_setDefaultXZQHVisible', !currentVisible);
        },
        openMapTreePannel() {
            let currentVisible = this.$store.getters._getDefaultMapTreeVisible;
            this.$store.commit('_setDefaultMapTreeVisible', !currentVisible);
        },
        //地图距离量算
        async initDistanceMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [DistanceMeasurement2D] = await loadModules(['esri/widgets/DistanceMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new DistanceMeasurement2D({
                view: view,
            });
            view.ui.add(this.measurementWidget, 'top-left');
        },
        //地图面积量算
        async initAreaMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [AreaMeasurement2D] = await loadModules(['esri/widgets/AreaMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new AreaMeasurement2D({
                view: view,
            });
            view.ui.add(this.measurementWidget, 'top-left');
        },
        //自定义测量
        async initDIYMeasurement(type) {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const resultLayer = view.map.findLayerById('measurementGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);
            const [
                SketchViewModel,
                Graphic,
                GraphicsLayer,
                GeometryService,
                LengthsParameters,
                AreasAndLengthsParameters,
            ] = await loadModules(
                [
                    'esri/widgets/Sketch/SketchViewModel',
                    'esri/Graphic',
                    'esri/layers/GraphicsLayer',
                    'esri/tasks/GeometryService',
                    'esri/tasks/support/LengthsParameters',
                    'esri/tasks/support/AreasAndLengthsParameters',
                ],
                config.options,
            );
            const graphicsLayer = new GraphicsLayer({
                id: 'measurementGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            view.map.add(graphicsLayer);

            if (type === 'distance') {
                const polylineSymbol = {
                    type: 'simple-line',
                    color: '#d81e06',
                    width: '2',
                    style: 'solid',
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view: view,
                    layer: graphicsLayer,
                    polylineSymbol,
                });
                sketchViewModel.create('polyline');

                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol,
                    });
                    graphicsLayer.add(graphic);
                });
                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        console.log(graphicsLayer);
                        console.log(event);

                        //获取线段长度
                        const geometryService = new GeometryService({
                            url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
                        });

                        const lengthsParameters = new LengthsParameters();
                        lengthsParameters.polylines = event.graphic.geometry;
                        lengthsParameters.lengthUnit = 9036;
                        lengthsParameters.geodesic = true;

                        geometryService.lengths(lengthsParameters).then(function (result) {
                            console.log('长度', result);
                        });
                    }
                });
            } else if (type === 'area') {
                const polygonSymbol = {
                    type: 'simple-fill',
                    color: 'rgba(216,30,6, 0.4)',
                    style: 'solid',
                    outline: {
                        color: '#d81e06',
                        width: 1,
                    },
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view: view,
                    layer: graphicsLayer,
                    polygonSymbol,
                });
                sketchViewModel.create('polygon');

                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol,
                    });
                    graphicsLayer.add(graphic);
                });
                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        console.log(graphicsLayer);
                        console.log(event);

                        //获取周长和面积
                        const geometryService = new GeometryService({
                            url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
                        });

                        const areasAndLengthsParameters = new AreasAndLengthsParameters();
                        areasAndLengthsParameters.polygons = event.graphic.geometry;
                        areasAndLengthsParameters.areaUnit = 'square-kilometers';
                        areasAndLengthsParameters.lengthUnit = 'kilometers';

                        geometryService.areasAndLengths(areasAndLengthsParameters).then(function (result) {
                            console.log('周长和面积', result);
                        });
                    }
                });
            }
        },
        //初始化空间查询
        async initSpaceQuery() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [Graphic, GraphicsLayer] = await loadModules(
                ['esri/Graphic', 'esri/layers/GraphicsLayer'],
                config.options,
            );

            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);
            _self.graphicsLayer = new GraphicsLayer({
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            view.map.add(_self.graphicsLayer);

            _self.sketchViewModel.create('polygon');

            _self.sketchViewModel.on('create-complete', function (event) {
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: _self.sketchViewModel.graphic.symbol,
                });
                _self.graphicsLayer.add(graphic);
            });
            _self.sketchViewModel.on('create', function (event) {
                if (event.state === 'complete') {
                    // console.log(graphicsLayer);
                    // console.log(event);
                    //2、执行空间查询
                    _self.handleSpaceQuery(event.graphic);
                }
            });
        },
        handleSpaceQuery(graphic) {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;

            const resultLayer = view.map.findLayerById('layerid');
            if (!resultLayer) {
                _self.$message({
                    message: '尚未添加业务图层，不能进行空间查询',
                    type: 'warning',
                });
                return;
            }

            const queryPoint = resultLayer.createQuery();
            queryPoint.geometry = graphic.geometry;
            resultLayer
                .queryFeatures(queryPoint)
                .then(function (results) {
                    let currentData = [];
                    if (results.features.length > 0) {
                        //符号化渲染图层
                        _self.renderResultLayer(results.features);
                        //实例化表格数据
                        results.features.map((item, index) => {
                            currentData.push({
                                name: item.attributes.name,
                                type: item.attributes.type,
                                tieluju: item.attributes.tieluju,
                                address: item.attributes.address,
                                lon: item.attributes.lon,
                                lat: item.attributes.lat,
                                key: index,
                            });
                        });
                    } else {
                        currentData.length = 0;
                    }
                    _self.$message({
                        message: `查询成功，共查到 ${results.features.length} 条数据`,
                        type: 'success',
                    });
                    _self.$store.commit('_setDefaultQueryResult', currentData);
                    _self.$store.commit('_setDefaultQueryResultVisible', true);
                })
                .catch(function (error) {
                    console.log(error);
                    _self.$message.error('空间查询失败，请联系管理员');
                });
        },
        async renderResultLayer(resultFeatures) {
            const view = this.$store.getters._getDefaultMapView;
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], config.options);

            const resultLayer = view.map.findLayerById('initResultLayer');
            if (resultLayer) view.map.remove(resultLayer);

            const resultData = this._translateLonLat(resultFeatures);
            //实例化弹窗
            let template = {
                title: '{name}-{tieluju}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '名称',
                            },
                            {
                                fieldName: 'type',
                                label: '类型',
                            },
                            {
                                fieldName: 'tieluju',
                                label: '铁路局',
                            },
                            {
                                fieldName: 'address',
                                label: '地址',
                            },
                        ],
                    },
                ],
            };
            const queryResultLayer = new FeatureLayer({
                source: resultData,
                id: 'initResultLayer',
                objectIdField: 'ObjectID',
                renderer: {
                    type: 'simple', // autocasts as new SimpleRenderer()
                    symbol: {
                        type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                        url: `static/icon/train.png`,
                        width: '32px',
                        height: '32px',
                    },
                },
                fields: [
                    {
                        name: 'OBJECTID',
                        type: 'oid',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'type',
                        type: 'string',
                    },
                    {
                        name: 'tieluju',
                        type: 'string',
                    },
                    {
                        name: 'address',
                        type: 'string',
                    },
                ],
                popupTemplate: template,
            });
            view.map.add(queryResultLayer);
        },
        //处理经纬度数据，返回features
        _translateLonLat(data) {
            const _self = this;
            if (data.length > 0) {
                _self.geoData = [];
                data.map((value, key) => {
                    _self.geoData.push({
                        geometry: {
                            type: 'point',
                            x: Number(value.attributes.lon),
                            y: Number(value.attributes.lat),
                        },
                        attributes: {
                            ObjectID: key + 1,
                            name: value.attributes.name,
                            type: value.attributes.type,
                            tieluju: value.attributes.tieluju,
                            address: value.attributes.address,
                        },
                    });
                });
            }

            return _self.geoData;
        },
        //卷帘分析
        async _initSwipe() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [Swipe] = await loadModules(['esri/widgets/Swipe'], config.options);
            const topLayer = view.map.findLayerById('swipeLayerTop');
            const bottomLayer = view.map.findLayerById('swipeLayerBottom');
            if (topLayer && bottomLayer) {
                _self.swipe = new Swipe({
                    leadingLayers: [topLayer],
                    trailingLayers: [bottomLayer],
                    position: 35,
                    view: view,
                });

                view.ui.add(_self.swipe);
            } else {
                _self.$message({
                    message: '请添加至少两张业务图层',
                    type: 'warning',
                });
                return;
            }
        },
        //地图打印
        async handlePrintMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const [PrintTask, PrintTemplate, PrintParameters] = await loadModules(
                ['esri/tasks/PrintTask', 'esri/tasks/support/PrintTemplate', 'esri/tasks/support/PrintParameters'],
                config.options,
            );
            let printTask = new PrintTask({
                url: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
            });

            let template = new PrintTemplate({
                format: 'pdf',
                exportOptions: {
                    dpi: 100,
                },
                layout: 'a4-portrait',
                layoutOptions: {
                    titleText: '地图出图demo',
                    authorText: 'X北辰北',
                    customTextElements: [{ location: '四川省 成都市' }, { date: '08/11/2021, 08:20:20 AM' }],
                },
            });

            let params = new PrintParameters({
                view: view,
                template: template,
            });

            printTask.execute(params).then((printResult, printError) => {
                console.log(printResult, printError);
                if (printResult.url) window.open(printResult.url);
                if (printError) this.$message.error('地图打印失败');
            });
        },
        //开启图层弹窗
        openMapPopup() {
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            const resultLayer = view.map.findLayerById('layerid');
            if (resultLayer) {
                // Get the screen point from the view's click event
                view.on('click', function (event) {
                    view.hitTest(event).then(function (response) {
                        console.log('1', response);
                        if (response.results.length) {
                            let graphic = response.results.filter(function (result) {
                                return result.graphic.layer.id === 'layerid';
                            })[0].graphic;

                            console.log(graphic.attributes);
                        }
                    });
                });
            } else {
                _self.$message({
                    message: '请添加业务图层',
                    type: 'warning',
                });
            }
        },
        //清屏
        handleClearMap() {
            const view = this.$store.getters._getDefaultMapView;
            const resultLayer1 = view.map.findLayerById('swipeLayerTop');
            const resultLayer2 = view.map.findLayerById('swipeLayerBottom');
            const resultLayer3 = view.map.findLayerById('layerid');
            const resultLayer4 = view.map.findLayerById('measurementGraphicLayer');
            if (resultLayer1) view.map.remove(resultLayer1);
            if (resultLayer2) view.map.remove(resultLayer2);
            if (resultLayer3) view.map.remove(resultLayer3);
            if (resultLayer4) view.map.remove(resultLayer4);
            if (this.swipe) this.swipe.destroy();
            if (this.measurementWidget) this.measurementWidget.destroy();
        },
    },
};
</script>

<style>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>
