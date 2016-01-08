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
        var myGis;
        myGis = {
            baseType: 'oceans',
            viewType: '3D',
            viewContainer: 'viewDiv',
            graphicsLayers: {},
            graphics: {},
            contents: {},
            chunkIndex: {},
            options: {}
        };
        myGis.initGis = function(options) {
            //gather the option args
            if (options) {
                this.options = options;
                this.baseType = options.baseType || this.baseType;
                this.viewType = options.viewType || this.viewType;
                this.viewContainer = options.viewContainer || this.viewContainer;
            }

            //set map
            this.map = new Map({
                basemap: this.baseType
            });

            //set view
            if (this.viewType == '3D') {
                this.view = new SceneView({
                    container: this.viewContainer,
                    map: this.map,
                    scale: 6000000,
                    center: [146, 16, 0],
                });
            } else {
                this.view = new MapView({
                    container: this.viewContainer,
                    map: this.map,
                    zoom: 7,
                    center: [146, 16]
                });
            }

            //if it's a re-init, restore the graphics
            _.forEach(this.graphicsLayers, function(graphicsLayer, layerId) {
                console.log(layerId);
                myGis.map.add(graphicsLayer);
            })
        }
        myGis.addNewGraphic = function(layerId, data) {
            var graphicsLayer = this.graphicsLayers[layerId];
            var polyline = new Polyline(data.path);
            var lineSymbol = new SimpleLineSymbol({
                color: graphicsLayer.color, //RGB color values as an array
                width: 3
            });
            var newContent = '<div>start: lat=' + data.path[0][0] + ' lon=' + data.path[0][1] + '</div>' +
                '<div>end: lat=' + data.path[1][0] + ' lon=' + data.path[1][1] + '</div>' +
                '<img class="prev-img" src=' + data.img.substring(0, data.img.lastIndexOf('.')) + "-min.jpg" + ' alt="image preview" data-raw=' + data.img + ' onclick="showImg(this)" />' +
                '<a href=' + data.img + ' download=' + data.img.substring(data.img.lastIndexOf('/')) + '><span class="glyphicon glyphicon-save" />download</a>';
            var polylineGraphic = new Graphic({
                id: data.id,
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
            })).append(newContent));
            this.graphics[data.id] = polylineGraphic;
            //Add the graphic to the GraphicsLayer
            graphicsLayer.add(polylineGraphic); //graphicsLayer was created in step 2
            //graphics.push(polylineGraphic);
        };


        myGis.getData = function(url, layerId) {
            $('#loader-holder').show();
            $.get(url, function(datas) {
                $('#loader-holder').hide();
                _.forEach(datas, function(data, index) {
                    myGis.addNewGraphic(layerId, data);
                });
                return datas.length > 0
            })
        }

        myGis.loadMoreGraphics = function(layerId) {
            return function() {
                var url = '/graphics?layerId=' + layerId + '&chunkIndex=' + this.chunkIndex[layerId];
                this.chunkIndex[layerId]++;
                return this.getData(url, layerId); //returns false if nothing more
            }
        }

        myGis.addContentToList = function(contents) {
            _.forEach(contents, function(content, index) {
                $('.list-body').append($('<div>').attr('class', 'list-item').append($('<h4>').attr('class', 'list-item-name').text(data.name).click(function() {
                    myGis.view.animateTo(polylineGraphic);
                })).append(newContent));
            });
        }

        myGis.loadAllGraphics = function(layerId) {
            for (;; this.chunkIndex[layerId]++) {
                var newUrl = '/graphics?layerId=' + layerId + '&chunkIndex=' + this.chunkIndex[layerId];
                if (!this.getData(newUrl, layerId)) {
                    console.log('Layer--' + layerId + ' all graphics loaded!');
                    break;
                }
            }
        }
        myGis.initGraphics = function(layerId) {
            var initUrl = '/graphics?layerId=' + layerId + '&chunkIndex=0';
            this.getData(initUrl, layerId);
            this.chunkIndex[layerId] = 1;
            console.log('this.options.loadAllGraphics---' + this.options.loadAllGraphics);
            if (!(this.options.loadAllGraphics) === false) {
                this.loadAllGraphics(layerId);
            }
        }
        myGis.initLayer = function(layer) {
            var newLayer = new GraphicsLayer(layer);
            var newColor = '#' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
            newLayer.color = newColor;
            var newBtn = $('<div>').attr({
                'class': 'layer-btn',
                'data-layerid': layer.id,
                'data-color': newColor
            });
            newBtn.append($('<label>').text(layer.id))
                .append($('<div>').attr('class', 'layer-symbol').css('border-color', newColor));
            newBtn.click(function() {
                var sym = $(this).find('.layer-symbol');
                console.log(myGis.graphicsLayers[$(this).data('layerid')]);
                if (sym.hasClass('layer-symbol-inactive')) {
                    sym.removeClass('layer-symbol-inactive');
                    console.log(myGis.graphicsLayers[$(this).data('layerid')]);
                    myGis.map.add(myGis.graphicsLayers[$(this).data('layerid')]);
                } else {
                    sym.addClass('layer-symbol-inactive');
                    myGis.map.remove(myGis.graphicsLayers[$(this).data('layerid')]);
                }
            });
            $('.select-layers').append(newBtn);
            this.graphicsLayers[layer.id] = newLayer;
            this.map.add(newLayer);
            console.log('Layer--' + layer.id + ' initiated!');
            this.initGraphics(layer.id);
        }

        //})
        return myGis;
    };


    $(document).ready(function() {
        var mGis = new MarianaGis();
        mGis.initGis({
            loadAllGraphics: 1
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
        $('.changeBT').click(function() {
            mGis.initGis({
                baseType: $(this).text()
            });
        })
        $('.list-btn').click(function() {
            if ($('.view-control').hasClass('control-panel-hidden')) {
                $('.view-control').switchClass('control-panel-hidden', 'control-panel-shown');
                $(this).switchClass('glyphicon-menu-right', 'glyphicon-menu-left');
            } else {
                $('.view-control').switchClass('control-panel-shown', 'control-panel-hidden');
                $(this).switchClass('glyphicon-menu-left', 'glyphicon-menu-right');
            }
        })
        $('.hide-view-control-btn').click(function() {
                $('.view-control').switchClass('view-control-shown', 'view-control-hidden');
            })
            /*$('.list-btn').click(function() {
                if ($(this).hasClass('glyphicon-pushpin')) {
                    if ($(this).hasClass('btn-pinned')) {
                        $(this).removeClass('btn-pinned').removeClass('glyphicon-pushpin').addClass('glyphicon-menu-up').attr('title', 'come out!');
                        $('.list-div').css({
                            'bottom': '-260px',
                            'opacity': 0.8
                        }).addClass('list-div-toggle');
                    } else {
                        $(this).addClass('btn-pinned');
                        $('.list-div').css({
                            'bottom': '0px',
                            'opacity': 1
                        }).removeClass('list-div-toggle');
                    }
                }
            })*/
        $('.list-div').hover(function() {
            $(this).css({
                'bottom': '0px',
                'opacity': 1
            })
            var btn = $(this).find('.list-btn');
            if (btn.hasClass('glyphicon-menu-up')) {
                btn.removeClass('glyphicon-menu-up').addClass('glyphicon-pushpin').attr('title', 'stop hidding!');
            }
        }, function() {
            var btn = $(this).find('.list-btn');
            if (btn.hasClass('btn-pinned')) {
                btn.removeClass('glyphicon-menu-up').addClass('glyphicon-pushpin').attr('title', 'move some space!');
            } else {
                $(this).css({
                    'bottom': '-260px',
                    'opacity': 0.8
                })
                btn.removeClass('glyphicon-pushpin').addClass('glyphicon-menu-up').attr('title', 'come out!');
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
