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
