'use strict';
angular.module('Shaketonbde.controllers', [])

.factory('Event', ['$resource',
  function($resource){
    return $resource('events.json', {}, {'query': {method: 'GET', isArray: false}});
  }]
)

.controller('AppCtrl', function($scope) {
})

.controller('EventsCtrl', function($scope, $ionicLoading, Event) {
  function initialize(callback) {
    var mapOptions = {
          center: new google.maps.LatLng(48.8588589,2.3470599),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        }
      , map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown',
      function(e) {
        e.preventDefault();
        return false;
      }
    );

    $scope.map = map;
    callback();
  };

  function makeInfoWindowEvent(map, infowindow, marker) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  function centreOnMe() {
    if(!$scope.map)
      return;

    $scope.loading = $ionicLoading.show({
      content: '<div class="spinner icon-spinner-3" aria-hidden="true"></div>',
      showBackdrop: true
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var position = pos.coords.latitude +','+pos.coords.longitude
        , myPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
        ,Events = new Event.query();

      Events.$promise.then(function(events) {
        $scope.events = events;
        angular.forEach($scope.events, function(event, key) {
          if(key === event.id) {
            var eventPosition = new google.maps.LatLng(event.coord.split(',')[0], event.coord.split(',')[1]);
            var marker = new google.maps.Marker({ position: eventPosition, map: $scope.map });
            var infowindow = new google.maps.InfoWindow({ content: event.name });
            makeInfoWindowEvent($scope.map, infowindow, marker);
          }
        });
      });

      $scope.map.setCenter(myPos);
      var marker = new google.maps.Marker({ position: myPos, map: $scope.map });
      // TODO : replace by perso icon
      var infowindow = new google.maps.InfoWindow({ content: "You" });
      makeInfoWindowEvent($scope.map, infowindow, marker);
      $ionicLoading.hide();
    }, function(error) {
      alert('Impossible de te trouver: ' + error.message);
    });
  };

  google.maps.event.addDomListener(window, 'load', initialize(centreOnMe));
})

.controller('EventCtrl', function($scope, $stateParams, Event) {
  Event.query().$promise.then(function(events) {
    var event = events[$stateParams.eventId];
    event.date = new Date(event.date);
    $scope.event = event;
  });
});