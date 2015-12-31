var showImg = function(ele) {
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
$('.view-control-btn').click(function() {
    $('.view-control').switchClass('view-control-hidden','view-control-shown');
})
$('.hide-view-control-btn').click(function() {
    $('.view-control').switchClass('view-control-shown','view-control-hidden');
})
$('.list-btn').click(function() {
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
})
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
