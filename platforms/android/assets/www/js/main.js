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
});
