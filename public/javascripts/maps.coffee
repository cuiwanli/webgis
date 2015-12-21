require [
    "esri/Map"
    "esri/views/MapView"
    "esri/tasks/Locator"
    "esri/layers/GraphicsLayer"
    "esri/geometry/Polyline"
    "esri/symbols/SimpleLineSymbol"
    "esri/Graphic"
    "esri/widgets/Popup"
    "esri/PopupTemplate"
    "dojo/domReady!"
], (
	Map
    MapView
    Locator
    GraphicsLayer
    Polyline
    SimpleLineSymbol
    Graphic
    Popup
    PopupTemplate
) ->
	setView = (baseType) ->
		map = new Map basemap: baseType
		view = new MapView
	    	container: "viewDiv"
	    	map: map
	    	zoom: 7
	    	center: [115, 15]

	    view.on 'click', (evt) ->
	        console.log evt
	        if  evt.graphic
	            $('.panel-right').find('p').remove()
	            evt.graphic.symbol = new SimpleLineSymbol
	                color: [26, 119, 40]
	                width: 4

	            $('.panel-right').append $('<p>').text JSON.stringify evt.graphic
	            $('.cover-panel').show('fast')
	            $('.panel-right').show 'slide',  direction: 'right' , 1000
            return
		view.then ->
		    $('#hide-right-panel').click ->
		        $('.panel-right').hide 'slide',  direction: 'right' , 1000
		        $('.cover-panel').hide('slow')
		        return

		    graphicsLayer = new GraphicsLayer()
		    map.add graphicsLayer
		    _.each datas, (data, index, list) ->
		        addNewGraphic(graphicsLayer, data)
		        return
	        return
        return
	addNewGraphic = (graphicsLayer, data) ->
        polyline = new Polyline paths: data.path

        lineSymbol = new SimpleLineSymbol
            color: [226, 119, 40]
            width: 4

        lineAtt =
            Name: "Keystone Pipeline"
            Owner: "TransCanada"
            Length: "3,456 km"

        polylineGraphic = new Graphic
            geometry: polyline
            symbol: lineSymbol
            attributes: lineAtt
            popupTemplate: new PopupTemplate
                title: "Popup Tile"
                content: "<p>content of popup</p>" +
                    "<ul><li>li01</li>" +
                    "<li>li02</li>" +
                    "<li>li03</li><ul>"

        graphicsLayer.add polylineGraphic
        return

	datas = [{
		path: [
			[112, 12]
			[116, 16]
		]}
			{
        path: [
            [112.5, 11.5]
            [116, 16]
        ]}
        {
        path: [
            [113, 11]
            [116, 16]
        ]}
        {
        path: [
            [113.5, 11.5]
            [116, 16]
        ]}
        {
        path: [
            [114, 12]
            [116, 16]
        ]}
    ]

	setView 'oceans'

	$('.changeBT').click ->
	    $('body').find('#viewDiv').remove()
	    newDiv = $('<div>').attr('id', 'viewDiv')
	    $('body').append(newDiv)
	    setView($(this).text())
	    return
	return
