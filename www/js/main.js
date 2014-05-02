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
    // Map declaration
    var eventsMap = {
      initMap: function(lat, long) {
        var options = {
          zoom: 15,
          center: new google.maps.LatLng(lat, long),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('eventsMap'), options);
        var markerPoint = new google.maps.LatLng(lat, long);
        var marker = new google.maps.Marker({
          position: markerPoint,
          map: map,
          title: 'Device\'s Location'
        });
      },
      onMapSuccess: function(position){
        var coords = position.coords;
        eventsMap.initMap(coords.latitude, coords.longitude);
      },
      onMapFailure: function(error){
        alert("onMapFailure :: " + error.message);
      },
      setGeolocation: function() {
        navigator.geolocation.getCurrentPosition(eventsMap.onMapSuccess, eventsMap.onMapFailure, {timeout: 5000, enableAccuracy: true});
      }
    };
    // Get events from events.json
    $.getJSON('./events.json', function(data){
      var events = data
        , container = $$(page.container).find('.events-content ul');
      $.each(events, function(i, event){
        var html =  '<a href="event.html" class="item-link">' +
                      '<li class="item-content">' +
                        '<div class="item-inner">' +
                          '<div class="item-title-row">' +
                            '<div class="item-title">' + event.name + '</div>' +
                          '</div>' +
                        '</div>' +
                      '</li>';
                    '</a>' +
        container.append(html);
        eventsMap.setGeolocation();
      });
    });
  }

  if(page.name === 'event') {

  }

  if(page.name === 'camera') {
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
