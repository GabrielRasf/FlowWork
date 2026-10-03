const inputFoto = document.getElementById('input-foto');
const previewFoto = document.getElementById('preview-foto');

inputFoto.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        previewFoto.src = URL.createObjectURL(file);
    }
});
