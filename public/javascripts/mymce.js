$(document).ready(function() {
    var startNewInput = function() {
        $(this).find('input').remove();
        var newInput = $('<input>').attr({
            'type': 'text',
            'autofocus':1,
            'class': 'temp-input'
        }).change(function() {
            var newWords = $(this).val();
            $(this).parent('p.active').append(newWords).startNewInput();
            /* Act on the event */
        });
        $(this).append(newInput);
    }
    $('p.active').click(startNewInput);
})
