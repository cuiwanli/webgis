tinymce.init({
    selector: '#input-body', // change this value according to your HTML
    //inline:true,
    plugins: "advlist link anchor autoresize image preview imagetools",
    toolbar: 'undo redo styleselect fontsizeselect bold italic link image preview',
    image_caption: true,
    fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
    menubar: false,
    images_upload_url: '/tinymce',
    //images_upload_base_path: '/some/basepath',
    images_upload_credentials: true,
    file_browser_callback_types: 'file image media',
    file_browser_callback: function(field_name, url, type, win) {
        console.log(field_name + '--:' + url + '--:' + type + '--:' + win);
        $('#file').click();
    }
});
console.log(tinymce.activeEditor);
$('.replace').click(function(){
	$('img [alt="Smiley face"]').css('width','100%');
})
function uploadimg() {
    var xhr, formData;
    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/tinymce');

    xhr.onload = function() {
        var json;

        if (xhr.status != 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
        }

        console.log(json.location);
        tinymce.activeEditor.execCommand('mceInsertContent', true, '<img alt="Smiley face" src="' + json.location + '"/>');
        $('#file').val('');
    };

    //xhr.addEventListener("progress", updateProgress);
    var ffrm = document.getElementById('frm_file');
    formData = new FormData(ffrm);
    xhr.send(formData);
}
$('#file').change(uploadimg);
