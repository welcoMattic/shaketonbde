// Add view
var mainView = app.addView('.view-main', {
  modalTitle: 'Shake ton BDE',
  dynamicNavbar: true
});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function () {
    app.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    app.hideIndicator();
});

// Event listener to run specific code for specific pages
$$(document).on('pageInit', function (e) {
  var page = e.detail.page;
console.log(page.name);
  if (page.name === 'events') {
    $.getJSON('http://einna.net/events.json?callback=?', function(remoteData){
      console.log(remoteData)
    });
  }
  if(page.name === 'camera')
  {
    var app = {

        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },


        // CAMERAAPI:6/6 << BEGIN
        cameraOptions: {
            targetWidth: 300,
            targetHeight: 400,
            saveToPhotoAlbum: true,
            allowEdit: true
        },
        takePicture: function(evt) {
            evt.preventDefault();
            navigator.camera.getPicture(this.onCameraSuccess, this.onCameraError, this.cameraOptions);
        },
        onCameraSuccess: function(imageData){
            alert("onCameraSuccess");
            document.querySelector('#shot').src = imageData;
        },
        onCameraError: function(error){
            //navigator.notification.alert(error, null);
            alert("onCameraError (maybe on Simulator: camera disabled!) :: " + error.code);
        },
        updatePreferences: function(evt){
            evt.preventDefault();
            app.cameraOptions[evt.target.id] = evt.target.checked;
        },
        onChoosePictureURISuccess: function(imageURI) {
            // Uncomment to view the image file URI
            // console.log(imageURI);
            var image = document.querySelector('#shot');
            image.style.display = 'block';
            image.src = imageURI;
        },
        onChoosePictureError: function(error){
            alert("onChoosePictureError :: " + error.code);
        },
        choosePicture: function(source) {
            navigator.camera.getPicture(this.onChoosePictureURISuccess, this.onChoosePictureError,
                                        { quality: 50,
                                        destinationType: Camera.DestinationType.FILE_URI,
                                        sourceType: source });
        },
        choosePictureLibrary: function(e) {
            app.choosePicture(Camera.PictureSourceType.PHOTOLIBRARY);
        },
        choosePictureAlbum: function(e) {
            app.choosePicture(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        },
        // CAMERAAPI:6/6 << END 


        onDeviceReady: function() {
            console.log('>>>>> READY!');
            // CAMERAAPI:5/6
            var takePictureButton = document.getElementById('takePicture');
            takePictureButton.addEventListener('click', function(event) { app.takePicture(event); }, true);
            var saveToPhotoAlbum = document.querySelector('#saveToPhotoAlbum');
            saveToPhotoAlbum.addEventListener('change', app.updatePreferences);
            var allowEdit = document.querySelector('#allowEdit');
            allowEdit.addEventListener('change', app.updatePreferences);
            var choosePictureAlbum = document.getElementById('choosePictureAlbum');
            choosePictureAlbum.addEventListener('click', function(event) { app.choosePictureAlbum(event); }, true);
            var choosePictureLibrary = document.getElementById('choosePictureLibrary');
            choosePictureLibrary.addEventListener('click', function(event) { app.choosePictureLibrary(event); }, true);
        
            app.receivedEvent('deviceready');
        },

        // Update DOM on a Received Event
        receivedEvent: function(id) {
            var parentElement = document.getElementById(id);

            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            var item = document.getElementById('modalLauncher');
            item.setAttribute('href', '#myModal');

            console.log('Received Event: ' + id);
        }
    };
  }
});