require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/tasks/Locator",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polyline",
    "esri/symbols/SimpleLineSymbol",
    "esri/Graphic",
    "esri/widgets/Popup",
    "esri/PopupTemplate",
    "dojo/domReady!"
], function(Map,
    SceneView,
    Locator,
    GraphicsLayer,
    Polyline,
    SimpleLineSymbol,
    Graphic,
    Popup,
    PopupTemplate) {
    //$(document).ready(function() {

    var datas = [{
        path: [
            [112, 12],
            [116, 16]
        ]
    }, {
        path: [
            [112.5, 11.5],
            [116, 16]
        ]
    }, {
        path: [
            [113, 11],
            [116, 16]
        ]
    }, {
        path: [
            [113.5, 11.5],
            [116, 16]
        ]
    }, {
        path: [
            [114, 12],
            [116, 16]
        ]
    }]
    setView('oceans');
    $('.changeBT').click(function() {
        $('body').find('#viewDiv').remove();
        var newDiv = $('<div>').attr('id', 'viewDiv');
        $('body').append(newDiv);
        setView($(this).text());
    });

    function setView(baseType) {
        var map = new Map({
            basemap: baseType
        });

        console.log('mapped');
        var view = new SceneView({
            container: "viewDiv", //reference to the scene div created in step 5
            map: map, //reference to the map object created before the scene
            scale: 5000000, //sets the initial scale to 1:50,000,000
            center: [115, 15, 0], //sets the center point of view with lon/lat
        });
        view.on('click', function(evt) {
            console.log(evt);
            if (evt.graphic) {
                $('.panel-right').find('p').remove();
                evt.graphic.symbol = new SimpleLineSymbol({
                    color: [26, 119, 40], //RGB color values as an array
                    width: 4
                });
                $('.panel-right').append($('<p>').text(JSON.stringify(evt.graphic)));
                $('.cover-panel').show('fast');
                $('.panel-right').show('slide', {
                    direction: 'right'
                }, 1000);
            }
        });
        /* var view = new MapView({
            container: "viewDiv", //reference to the scene div created in step 5
            map: map, //reference to the map object created before the scene
            zoom: 7, //sets the zoom level based on level of detail (LOD)
            center: [115, 15] //sets the center point of view in lon/lat
        });
        */
        view.then(function() {
            console.log('viewed');
            $('#hide-right-panel').click(function() {
                $('.panel-right').hide('slide', {
                    direction: 'right'
                }, 1000);
                $('.cover-panel').hide('slow');
            })
            var graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);
            _.each(datas, function(data, index, list) {
                addNewGraphic(graphicsLayer, data);
            });
        })
    };

    function addNewGraphic(graphicsLayer, data) {
        var polyline = new Polyline({
            paths: data.path
        });
        var lineSymbol = new SimpleLineSymbol({
            color: [226, 119, 40], //RGB color values as an array
            width: 4
        });
        var lineAtt = {
            Name: "Keystone Pipeline", //The name of the pipeline
            Owner: "TransCanada", //The owner of the pipeline
            Length: "3,456 km" //The length of the pipeline
        };
        var polylineGraphic = new Graphic({
            geometry: polyline, //add the geometry created in step 4
            symbol: lineSymbol, //add the symbol created in step 5
            attributes: lineAtt, //add the attributes created in step 6
            popupTemplate: new PopupTemplate({
                title: "Popup Tile",
                //Four fields are used in this template. The value of the selected feature will be
                //inserted in the location of each field name below
                content: "<p>content of popup</p>" +
                    "<ul><li>li01</li>" +
                    "<li>li02</li>" +
                    "<li>li03</li><ul>"
            })
        });
        //Add the graphic to the GraphicsLayer
        graphicsLayer.add(polylineGraphic); //graphicsLayer was created in step 2
    };
    //})
});
