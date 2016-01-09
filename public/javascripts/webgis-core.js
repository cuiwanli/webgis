$(document).ready(function() {
    var mGis = new MarianaGis();
    $('.changeBT').click(function() {
        $('body').find('#viewDiv').remove();
        var newDiv = $('<div>').attr('id', 'viewDiv');
        $('body').append(newDiv);
        mGis.setView($(this).text());
    });
})


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
