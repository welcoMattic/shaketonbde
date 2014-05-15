'use strict';

/*=====================================
=            Menu Controller          =
=====================================*/

Shaketonbde.controller('AppCtrl', function($scope) {
});



/*========================================
=            Events Controller           =
========================================*/

Shaketonbde.controller('EventsCtrl', function($scope, $ionicLoading, Event) {
  var markersArray = [];

  // Map washer
  var clearMap = function() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }

  function initialize(callback) {
    var mapOptions = {
          center: new window.google.maps.LatLng(48.8588589,2.3470599),
          zoom: 12,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        },
        map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    window.google.maps.event.addDomListener(document.getElementById('map'), 'mousedown',
      function(e) {
        e.preventDefault();
        return false;
      }
    );

    $scope.map = map;
    callback();
  }

  // Tooltip marker helper
  function makeInfoWindowEvent(map, infowindow, marker) {
    window.google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  }

  $scope.centreOnMe = function() {
    if(!$scope.map) {
      return;
    }

    clearMap();

    $ionicLoading.show({
      template: '<div class="spinner icon-spinner-3" aria-hidden="true"></div>'
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var myPos = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          Events = new Event.query();

      Events.$promise.then(function(events) {
        $scope.events = events;
        angular.forEach($scope.events, function(event, key) {
          if(key === event.id) {
            var eventPosition = new window.google.maps.LatLng(event.coord.split(',')[0], event.coord.split(',')[1]);
            var marker = new window.google.maps.Marker({ position: eventPosition, map: $scope.map });
            markersArray.push(marker);
            var infowindow = new window.google.maps.InfoWindow({ content: event.name });
            makeInfoWindowEvent($scope.map, infowindow, marker);
          }
        });
      })
      .catch(function(e){
        console.log(e);
      });

      $scope.map.setCenter(myPos);
      var userMarker = new window.google.maps.Marker({ position: myPos, map: $scope.map });
      markersArray.push(userMarker);
      /**
        TODO:
        - replace by perso icon
      **/
      var infowindow = new window.google.maps.InfoWindow({ content: 'You' });
      makeInfoWindowEvent($scope.map, infowindow, userMarker);
      $ionicLoading.hide();
    }, function(error) {
      window.alert('Impossible de te trouver: ' + error.message);
    },
    { enableHighAccuracy: true });
  };

  window.google.maps.event.addDomListener(window, 'load', initialize($scope.centreOnMe));
});



/*===============================================
=            Single Event Controller            =
===============================================*/

Shaketonbde.controller('EventCtrl', function($scope, $stateParams, Event) {
  Event.query().$promise.then(function(events) {
    var event = events[$stateParams.eventId];
    event.date = new Date(event.date);
    $scope.event = event;
  });
});



/*=========================================
=            Camera Controller            =
=========================================*/

Shaketonbde.controller('CameraCtrl', function($scope) {
  function onSuccess(imageURI) {
    $scope.$apply(function() {
      $scope.imageURI = imageURI;
    });
    $scope.shareFB = function() {
      window.plugins.socialsharing.shareViaFacebook(
        null,
        null,
        imageURI,
        function() {
          alert('share ok');
        },
        function(errormsg) {
          alert(errormsg);
        }
      )
    };
  }

  function onFail(message) {
    alert('Erreur lors de la récupération de la photo');
    console.log('Failed because: ' + message);
  }

  $scope.takePicture = function() {
    navigator.camera.getPicture(
      onSuccess,
      onFail,
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      }
    );
  };
});



/*=========================================
=            Invite Controller            =
=========================================*/

Shaketonbde.controller('InviteCtrl', function($scope, $ionicLoading) {

  function onSuccess(data) {
    var contacts = [];
    angular.forEach(data, function(c) {
      var contact = {};
      contact.name = c.name.formatted;
      contact.phoneNumber = (c.phoneNumbers) ? c.phoneNumbers[0].value : '';
      contact.email = (c.emails) ? c.emails[0].value : '';
      contact.facebook = (c.ims) ? c.ims[0].value : '';
      contacts.push(contact);
    });
    $scope.contacts = contacts;
    $ionicLoading.hide();
  }

  function onError(contactError) {
    alert('Erreur lors du chargement des contacts');
    console.log('onError ContactsLoad: ', contactError.code);
    $ionicLoading.hide();
  }

  if(ionic.Platform.isWebView()) {
    // Code executed on simulator or device
    var options = new ContactFindOptions();
    options.filter = '';
    options.multiple = true;
    var fields = ['name', 'emails', 'ims', 'phoneNumbers'];
    $ionicLoading.show({
      template: '<div class="spinner icon-spinner-3" aria-hidden="true"></div>'
    });
    navigator.contacts.find(fields, onSuccess, onError, options);
  } else {
    // Code executed in browser (ONLY FOR TEST)
    $scope.contacts = [];
    var contacts = [{ 'addresses' : null,    'birthday' : null,    'categories' : null,    'displayName' : null,    'emails' : [ { 'id' : 0,          'pref' : false,          'type' : 'other',          'value' : 'mathieu.santostefano@gmail.com'        },        { 'id' : 1,          'pref' : false,          'type' : 'work',          'value' : 'mathieu@kontestapp.com'        },        { 'id' : 2,          'pref' : false,          'type' : 'home',          'value' : 'mathieu.santostefano@hotmail.fr'        },        { 'id' : 3,          'pref' : false,          'type' : 'other',          'value' : 'zic_it_cellar@hotmail.fr'        },        { 'id' : 4,          'pref' : false,          'type' : 'other',          'value' : 'welcomattic@me.com'        }      ],    'id' : 134,    'ims' : [ { 'id' : 0,          'type' : 'other',          'value' : 'mathieu.santostefano'        } ],    'name' : { 'familyName' : 'Santostefano',        'formatted' : 'Mathieu Santostefano',        'givenName' : 'Mathieu',        'honorificPrefix' : null,        'honorificSuffix' : null,        'middleName' : null      },    'nickname' : null,    'note' : null,    'organizations' : null,    'phoneNumbers' : [ { 'id' : 0, 'pref' : false,        'type' : 'home',        'value' : '0659295103'      } ],    'photos' : null,    'rawId' : null,    'urls' : null  },  { 'addresses' : null,    'birthday' : null,    'categories' : null,    'displayName' : null,    'emails' : null,    'id' : 136,    'ims' : null,    'name' : { 'familyName' : 'Bango',        'formatted' : 'Howard Bango',        'givenName' : 'Howard',        'honorificPrefix' : null,        'honorificSuffix' : null,        'middleName' : null      },    'nickname' : null,    'note' : null,    'organizations' : null,    'phoneNumbers' : null,    'photos' : null,    'rawId' : null,    'urls' : null  },  { 'addresses' : null,    'birthday' : null,    'categories' : null,    'displayName' : null,    'emails' : null,    'id' : 138,    'ims' : null,    'name' : { 'familyName' : 'Anne',        'formatted' : 'Cécile Anne',        'givenName' : 'Cécile',        'honorificPrefix' : null,        'honorificSuffix' : null,        'middleName' : null      },    'nickname' : null,    'note' : null,    'organizations' : null,    'phoneNumbers' : null,    'photos' : null,    'rawId' : null,    'urls' : null  },  { 'addresses' : null,    'birthday' : null,    'categories' : null,    'displayName' : null,    'emails' : null,    'id' : 140,    'ims' : null,    'name' : { 'familyName' : 'Dubreuil',        'formatted' : 'Clémence Dubreuil',        'givenName' : 'Clémence',        'honorificPrefix' : null,        'honorificSuffix' : null,        'middleName' : null      },    'nickname' : null,    'note' : null,    'organizations' : null,    'phoneNumbers' : null,    'photos' : null,    'rawId' : null,    'urls' : null  },  { 'addresses' : null,    'birthday' : null,    'categories' : null,    'displayName' : null,    'emails' : null,    'id' : 141,    'ims' : null,    'name' : { 'familyName' : 'Santostefano',        'formatted' : 'Nanou Santostefano',        'givenName' : 'Nanou',        'honorificPrefix' : null,        'honorificSuffix' : null,        'middleName' : null      },    'nickname' : null,    'note' : null,    'organizations' : null,    'phoneNumbers' : null,    'photos' : null,    'rawId' : null,    'urls' : null  }];  //   $scope.contacts = [];
    angular.forEach(contacts, function(c) {
      var contact = {};
      contact.name = c.name.formatted;
      contact.phoneNumber = (c.phoneNumbers) ? c.phoneNumbers[0].value : '';
      contact.email = (c.emails) ? c.emails[0].value : '';
      contact.facebook = (c.ims) ? c.ims[0].value : '';
      $scope.contacts.push(contact);
    });
  }

});
