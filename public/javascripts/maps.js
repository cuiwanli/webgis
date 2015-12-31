require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polyline",
    "esri/symbols/SimpleLineSymbol",
    "esri/Graphic",
    "esri/widgets/Popup",
    "esri/PopupTemplate",
    "dojo/domReady!"
], function(Map,
    SceneView,
    GraphicsLayer,
    Polyline,
    SimpleLineSymbol,
    Graphic,
    Popup,
    PopupTemplate) {
    //$(document).ready(function() {
var map, view;
    setView('oceans');
    $('.changeBT').click(function() {
        $('body').find('#viewDiv').remove();
        var newDiv = $('<div>').attr('id', 'viewDiv');
        $('body').append(newDiv);
        setView($(this).text());
    });
    //var graphics = [];

    function setView(baseType) {
        map = new Map({
            basemap: baseType
        });

        console.log('mapped');
        view = new SceneView({
            container: "viewDiv", //reference to the scene div created in step 5
            map: map, //reference to the map object created before the scene
            scale: 6000000, //sets the initial scale to 1:50,000,000
            center: [146, 16, 0], //sets the center point of view with lon/lat
        });
        /*view = new MapView({
            container: "viewDiv", //reference to the scene div created in step 5
            map: map, //reference to the map object created before the scene
            zoom: 7, //sets the zoom level based on level of detail (LOD)
            center: [146, 16] //sets the center point of view in lon/lat
        });
        */
        view.then(function() {
            $('#hide-right-panel').click(function() {
                $('.panel-right').hide('slide', {
                    direction: 'right'
                }, 1000);
                $('.cover-panel').hide('slow');
            })
            var layer1 = new GraphicsLayer({
                id: 'layer1'
            });
            map.add(layer1);
            $.get('/graphics', function(datas) {
                _.each(datas, function(data, index) {
                    addNewGraphic(layer1, data);
                });
            })
        })
    };

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
        $('.list-body').append($('<div>').attr('class', 'list-item col-xs-12 col-sm-6 col-md-4 col-lg3').append($('<h4>').attr('class','list-item-name').text(data.name)).click(function(){
            view.animateTo(polylineGraphic);
        }).append(newContent));
        //Add the graphic to the GraphicsLayer
        graphicsLayer.add(polylineGraphic); //graphicsLayer was created in step 2
        //graphics.push(polylineGraphic);
    };
    //})
});
