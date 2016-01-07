function MarianaGis() {
    function GLayer() {
        this.
    }
    var m = {
        graphicsLayers: {},
        graphics: {},
        contents: {}
    };
    var layerIndex = 0;
    var graphicIndex = 0;
    var contentIndex = 0;
    var baseType = 'oceans',
        viewType
    var chunkIndex = {};
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/geometry/Polyline",
        "esri/symbols/SimpleLineSymbol",
        "esri/Graphic",
        "esri/widgets/Popup",
        "esri/PopupTemplate",
        "dojo/domReady!"
    ], function(Map,
        MapView,
        SceneView,
        GraphicsLayer,
        Polyline,
        SimpleLineSymbol,
        Graphic,
        Popup,
        PopupTemplate) {
        setView(baseType);

        function setView(baseType, viewType) {
            m.map = new Map({
                basemap: baseType
            });
            if (viewType == '3D') {
                m.view = new SceneView({
                    container: "viewDiv", //reference to the scene div created in step 5
                    map: m.map, //reference to the map object created before the scene
                    scale: 6000000, //sets the initial scale to 1:50,000,000
                    center: [146, 16, 0], //sets the center point of view with lon/lat
                });
            } else {
                m.view = new MapView({
                    container: "viewDiv", //reference to the scene div created in step 5
                    map: m.map, //reference to the map object created before the scene
                    zoom: 7, //sets the zoom level based on level of detail (LOD)
                    center: [146, 16] //sets the center point of view in lon/lat
                });
            }
            m.view.then(function() {})
        };

        function getData(url, graphicsLayer) {
            $('#loader-holder').show();
            $.get(url, function(datas) {
                $('#loader-holder').hide();
                _.each(datas, function(data, index) {
                    addNewGraphic(graphicsLayer, data);
                });
                return datas.length > 0
            })
        }

        function loadMoreGraphics(graphicsLayer) {
            chunkIndex[graphicsLayer.id]++;
            return function() {
                var url = '/graphics?chunkIndex=' + chunkIndex[graphicsLayer.id];
                return getData(url, graphicsLayer); //returns false if nothing more
            }
        }

        function addContentToList(contents) {
            _.each(contents, function(data, index) {
                addNewGraphic(layer1, data);
            });
        }

        function initLayer(layerId) {
            layer1 = new GraphicsLayer({
                id: layerId
            });
            m.graphicsLayers.push(layer1);
            m.map.add(layer1);
            initGraphics(layer1);
        }

        function initGraphics(graphicsLayer) {
            var initUrl = '/graphics?layerid=' + graphicsLayer.id + 'chunkIndex=0';
            getData(initUrl, graphicsLayer);
            chunkIndex[graphicsLayer.id] = 0;
        }

        function addNewGraphic(graphicsLayer, data) {
            var polyline = new Polyline(data.path);
            var lineSymbol = new SimpleLineSymbol({
                color: 'red', //RGB color values as an array
                width: 2
            });
            var newContent = '<div>start: lat=' + data.path[0][0] + ' lon=' + data.path[0][1] + '</div>' +
                '<div>end: lat=' + data.path[1][0] + ' lon=' + data.path[1][1] + '</div>' +
                '<img class="prev-img" src=' + data.img.substring(0, data.img.lastIndexOf('.')) + "-min.jpg" + ' alt="image preview" data-raw=' + data.img + ' onclick="showImg(this)" />' +
                '<a href=' + data.img + ' download=' + data.img.substring(data.img.lastIndexOf('/')) + '><span class="glyphicon glyphicon-save" />download</a>';
            var polylineGraphic = new Graphic({
                geometry: polyline, //add the geometry created in step 4
                symbol: lineSymbol, //add the symbol created in step 5
                popupTemplate: new PopupTemplate({
                    title: data.name,
                    content: newContent
                })
            });
            m.graphics.push({
                graphic: polylineGraphic,
                layerId: graphicsLayer.id
            });
            $('.list-body').append($('<div>').attr('class', 'list-item').append($('<h4>').attr('class', 'list-item-name').text(data.name).click(function() {
                view.animateTo(polylineGraphic);
            })).append(newContent));
            //Add the graphic to the GraphicsLayer
            graphicsLayer.add(polylineGraphic); //graphicsLayer was created in step 2
            //graphics.push(polylineGraphic);
        };
        //})
    });

    m.setView = setView;
    m.loadMoreGraphics = loadMoreGraphics;
    return m;
};
