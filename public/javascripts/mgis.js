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
    function MarianaGis() {
        var myGis = {
            baseType: 'oceans',
            viewType: '3D',
            viewContainer: 'viewDiv',
            graphicsLayers: {},
            graphics: {},
            contents: {},
            chunkIndex: {},
            options: {},
            highLightedGraphics: [],
            initGis: initGis,
            addNewGraphic: addNewGraphic,
            getData: getData,
            loadMoreGraphics: loadMoreGraphics,
            addContentToList: addContentToList,
            loadAllGraphics: loadAllGraphics,
            initGraphics: initGraphics,
            initLayer: initLayer,
            highLightGraphic: highLightGraphic,
            unHighLightAll: unHighLightAll
        };

        function initGis(options) {
            //gather the option args
            if (options) {
                this.options = options;
                this.baseType = options.baseType || this.baseType;
                this.viewType = options.viewType || this.viewType;
                this.viewContainer = options.viewContainer || this.viewContainer;
            }
            var view;
            //set map
            this.map = new Map({
                basemap: this.baseType
            });

            //set view
            if (this.viewType == '3D') {
                view = new SceneView({
                    container: this.viewContainer,
                    map: this.map,
                    scale: 6000000,
                    center: [146, 16, 0],
                    //camera: {
                    //    position: [146, 16, 2183],
                    //    tilt: 80
                    //}
                });
            } else {
                view = new MapView({
                    container: this.viewContainer,
                    map: this.map,
                    zoom: 7,
                    center: [146, 16]
                });
            }
            view.then(function() {
                view.on('click', function(evt) {
                    if (evt.graphic) {
                        myGis.highLightGraphic(evt.graphic);
                    }
                });
            });
            //if it's a re-init, restore the graphics
            _.forEach(this.graphicsLayers, function(graphicsLayer, layerId) {
                myGis.map.add(graphicsLayer);
            })
            this.view = view;
        }

        function addNewGraphic(layerId, data) {
            var graphicsLayer = this.graphicsLayers[layerId];
            var polyline = new Polyline(data.path);
            if (myGis.viewType === '2D') polyline = new Polyline(_.slice(data.path, 0, 2));
            var lineSymbol = new SimpleLineSymbol({
                color: graphicsLayer.color, //RGB color values as an array
                width: 3
            });

            var newContent = '<div>start: lat=' + data.path[0][0] + ' lon=' + data.path[0][1] + ' alt=' + data.path[0][2] + '</div>' +
                '<div>end: lat=' + data.path[1][0] + ' lon=' + data.path[1][1] + ' alt=' + data.path[1][2] + '</div>' +
                '<img class="prev-img" src=' + data.img.substring(0, data.img.lastIndexOf('.')) + "-min.jpg" + ' alt="image preview" data-raw=' + data.img + ' onclick="showImg(this)" />' +
                '<a href=' + data.img + ' download=' + data.img.substring(data.img.lastIndexOf('/')) + '><span class="glyphicon glyphicon-save" />download</a>';
            var polylineGraphic = new Graphic({
                id: data.id,
                layerId: layerId,
                title: data.name,
                geometry: polyline, //add the geometry created in step 4
                symbol: lineSymbol, //add the symbol created in step 5
                popupTemplate: new PopupTemplate({
                    title: data.name,
                    content: newContent
                })
            });
            $('.list-body').append($('<div>').attr('class', 'list-item').append($('<h4>').attr('class', 'list-item-name').text(data.name).click(function() {
                myGis.view.animateTo(polylineGraphic);
                myGis.highLightGraphic(polylineGraphic);
            })).append(newContent));
            this.graphics[data.id] = polylineGraphic;
            //Add the graphic to the GraphicsLayer
            graphicsLayer.add(polylineGraphic); //graphicsLayer was created in step 2
            //graphics.push(polylineGraphic);
        };


        function unHighLightAll() {
            var highLightedGraphics = this.highLightedGraphics
            _.forEach(highLightedGraphics, function(graphic, index) {
                myGis.graphicsLayers[graphic.layerId].remove(graphic);
                myGis.graphicsLayers[graphic.layerId].add(myGis.graphics[graphic.originId]);
            })
            this.highLightedGraphics = [];
        }

        function highLightGraphic(graphic) {
            if (!graphic.originId) { //only highlighted graphics have attr'originId'
                this.unHighLightAll();
                var lineSymbol = new SimpleLineSymbol({
                    color: [255, 0, 0],
                    width: 5
                });
                var highLightedGraphic = new Graphic({
                    id: graphic.id + '-H',
                    originId: graphic.id,
                    layerId: graphic.layerId,
                    title: graphic.title,
                    geometry: graphic.geometry, //add the geometry created in step 4
                    symbol: lineSymbol, //add the symbol created in step 5
                    popupTemplate: graphic.popupTemplate
                });
                this.graphicsLayers[graphic.layerId].remove(graphic);
                this.graphicsLayers[graphic.layerId].add(highLightedGraphic);
                this.highLightedGraphics.push(highLightedGraphic);
                console.log('highLighted');
            }
        }

        function getData(url, layerId) {
            $('#loader-holder').show();
            return $.get(url).then(function(datas) {
                $('#loader-holder').hide();
                _.forEach(datas, function(data, index) {
                    myGis.addNewGraphic(layerId, data);
                });
                console.log('datas.length---' + datas.length);
                return datas.length > 0;
            })
        }

        function loadMoreGraphics(layerId) {
            return function() {
                var url = '/map/graphics?layerId=' + layerId + '&chunkIndex=' + this.chunkIndex[layerId];
                this.chunkIndex[layerId]++;
                return this.getData(url, layerId); //returns false if nothing more
            }
        }

        function addContentToList(contents) {
            _.forEach(contents, function(content, index) {
                $('.list-body').append($('<div>').attr('class', 'list-item').append($('<h4>').attr('class', 'list-item-name').text(data.name).click(function() {
                    myGis.view.animateTo(polylineGraphic);
                })).append(newContent));
            });
        }

        function loadAllGraphics(layerId) {
            var url = '/map/graphics?layerId=' + layerId + '&chunkIndex=' + myGis.chunkIndex[layerId];

            function loadMore() {
                $('#loader-holder').show();
                $.get(url, function(datas) {
                    $('#loader-holder').hide();
                    _.forEach(datas, function(data, index) {
                        myGis.addNewGraphic(layerId, data);
                    });
                    console.log('datas.length---' + datas.length);
                    if (datas.length > 0) {
                        myGis.chunkIndex[layerId]++;
                        url = '/map/graphics?layerId=' + layerId + '&chunkIndex=' + myGis.chunkIndex[layerId];
                        loadMore();
                    }
                })
            };
            loadMore();
        }

        function initGraphics(layerId) {
            var initUrl = '/map/graphics?layerId=' + layerId + '&chunkIndex=0';
            this.getData(initUrl, layerId);
            this.chunkIndex[layerId] = 1;
            if (!(this.options.loadAllGraphics === false)) {
                console.log('start loading allllll');
                this.loadAllGraphics(layerId);
            }
        }
        myGis.getNextColor = function() {
            var colors = [{
                name: 'red',
                rgb: 'rgb(255, 0, 0)',
                hex: '#FF0000'
            }, {
                name: 'orange',
                rgb: 'rgb(255, 165, 0)',
                hex: '#FFA500'
            },  {
                name: 'green',
                rgb: 'rgb(0, 128, 0)',
                hex: '#008000'
            },{
                name: 'blue',
                rgb: 'rgb(0, 0, 255)',
                hex: '#0000FF'
            }, {
                name: 'purple',
                rgb: 'rgb(128, 0, 128)',
                hex: '#800080'
            }, {
                name: 'yellow',
                rgb: 'rgb(255, 255, 0)',
                hex: '#FFFF00'
            },  {
                name: 'teal',
                rgb: 'rgb(0, 128, 128)',
                hex: '#008080'
            }, {
                name: 'olive',
                rgb: 'rgb(128, 128, 0)',
                hex: '#808000'
            },{
                name: 'violet',
                rgb: 'rgb(238, 130, 238)',
                hex: '#EE82EE'
            }, {
                name: 'pink',
                rgb: 'rgb(255, 192, 203)',
                hex: '#FFC0CB'
            }, {
                name: 'brown',
                rgb: 'rgb(165, 42, 42)',
                hex: '#A52A2A'
            }, {
                name: 'gray',
                rgb: 'rgb(128, 128, 128)',
                hex: '#808080'
            }, {
                name: 'black',
                rgb: 'rgb(0, 0, 0)',
                hex: '#000000'
            }];
            var nextI = 0;
            return function() {
                nextI++;
                return colors[nextI];
            }
        }();

        function initLayer(layer) {
            var newLayer = new GraphicsLayer(layer);
            var newColor = this.getNextColor();
            newLayer.color = newColor.rgb;
            var newBtn = $('<button>').attr({
                'class': 'layer-btn ui button basic ' + newColor.name,
                'data-layerid': layer.id,
                'data-color': newColor.name
            }).text(layer.id); //.css('background-color', newColor.rgb);
            newBtn.click(function() {
                var btn = $(this);
                if (btn.hasClass(btn.data('color'))) {
                    myGis.map.remove(myGis.graphicsLayers[btn.data('layerid')]);
                    btn.removeClass(btn.data('color'));
                        /*btn.css({
                            'background-color': 'white',
                            'color': 'black'
                        });*/
                } else {
                    myGis.map.add(myGis.graphicsLayers[btn.data('layerid')]);
                    btn.addClass(btn.data('color'));
                    /* btn.css({
                         'background-color': btn.data('color'),
                         'color': 'white'
                     });*/
                }
            });
            $('#select-layers').append(newBtn);
            this.graphicsLayers[layer.id] = newLayer;
            this.map.add(newLayer);
            console.log('Layer--' + layer.id + ' initiated!');
            this.initGraphics(layer.id);
        }
        return myGis;
    };

    $(document).ready(function() {
        var mGis = new MarianaGis();
        mGis.initGis({
            loadAllGraphics: false
        });
        var layers = [{
            id: 'L000',
            name: 'random-layer0'
        }, {
            id: 'L002',
            name: 'random-layer2'
        }, {
            id: 'L001',
            name: 'random-layer1'
        }];
        mGis.view.then(function() {
            _.forEach(layers, function(layer, index) {
                mGis.initLayer(layer);
            })
        })
        $('.changeBT').change(function() {
            console.log($(this).val());
            mGis.initGis({
                baseType: $(this).val()
            });
        })
        $('.changeVT').change(function() {
            console.log($(this).val());
            mGis.initGis({
                viewType: $(this).val()
            });
        })
        $('.view-control-btn').click(function() {
            if ($('.view-control').hasClass('control-panel-hidden')) {
                $('.view-control').switchClass('control-panel-hidden', 'control-panel-shown');
                $(this).switchClass('btn-hidden', 'btn-shown');
                $(this).find('i').switchClass('right', 'left');
            } else {
                $('.view-control').switchClass('control-panel-shown', 'control-panel-hidden');
                $(this).switchClass('btn-shown', 'btn-hidden');
                $(this).find('i').switchClass('left', 'right');
            }
        })
    })
});

function showImg(ele) {
    console.log($(ele).data('raw'));
    var src = $(ele).data('raw');
    var img;
    if ($('img [src="' + src + '"]')[0]) {
        img = $('img [src="' + src + '"]')[0]
    } else {
        img = $('<img>').attr({
            'src': src,
            'class': 'full-img'
        })
        $('#gismap').append(img);
        Intense(img);
    }
    img.trigger('click');
}
