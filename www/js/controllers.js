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

  $scope.centreOnMe = function() {
    if(!$scope.map)
      return;

    $scope.loading = $ionicLoading.show({
      content: '<div class="spinner icon-spinner-3" aria-hidden="true"></div>',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var position = pos.coords.latitude +','+pos.coords.longitude
        , myPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
        , Events = new Event.query();

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
      /**
        TODO:
        - replace by perso icon
      **/
      var infowindow = new google.maps.InfoWindow({ content: "You" });
      makeInfoWindowEvent($scope.map, infowindow, marker);
      $ionicLoading.hide();
    }, function(error) {
      alert('Impossible de te trouver: ' + error.message);
    },
    { enableHighAccuracy: true });
  };

  google.maps.event.addDomListener(window, 'load', initialize($scope.centreOnMe));
});



/*===============================================
=            Single Event Controller            =
===============================================*/

Shaketonbde.controller('EventCtrl', function($scope, $stateParams, Event) {
  Event.query().$promise.then(function(events) {
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
    console.log(imageURI);
    $scope.$apply(function() {
      $scope.imageURI = imageURI;
    });
  }

  function onFail(message) {
    alert('Failed because: ' + message);
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

Shaketonbde.controller('InviteCtrl', function($scope) {
  function onSuccess(data) {
    var contacts = [];
    angular.forEach(data, function(c, key) {
      var contact = {};
      contact.name = c.name.formatted;
      contact.phoneNumber = (c.phoneNumbers) ? c.phoneNumbers[0].value : '';
      contact.email = (c.emails) ? c.emails[0].value : '';
      contact.facebook = (c.ims) ? c.ims[0].value : '';
      contacts.push(contact);
    });
    $scope.contacts = contacts;
  };

  function onError(contactError) {
    console.log('onError ContactsLoad: ', contactError.code);
  };
  if(ionic.Platform.isWebView()) {
    var options      = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    console.log(options);
    var fields       = ["name", "emails", "ims", "phoneNumbers"];
    navigator.contacts.find(fields, onSuccess, onError, options);
  } else {
    $scope.contacts = [];
    var contacts = [{ "addresses" : null,    "birthday" : null,    "categories" : null,    "displayName" : null,    "emails" : [ { "id" : 0,          "pref" : false,          "type" : "other",          "value" : "mathieu.santostefano@gmail.com"        },        { "id" : 1,          "pref" : false,          "type" : "work",          "value" : "mathieu@kontestapp.com"        },        { "id" : 2,          "pref" : false,          "type" : "home",          "value" : "mathieu.santostefano@hotmail.fr"        },        { "id" : 3,          "pref" : false,          "type" : "other",          "value" : "zic_it_cellar@hotmail.fr"        },        { "id" : 4,          "pref" : false,          "type" : "other",          "value" : "welcomattic@me.com"        }      ],    "id" : 134,    "ims" : [ { "id" : 0,          "type" : "other",          "value" : "mathieu.santostefano"        } ],    "name" : { "familyName" : "Santostefano",        "formatted" : "Mathieu Santostefano",        "givenName" : "Mathieu",        "honorificPrefix" : null,        "honorificSuffix" : null,        "middleName" : null      },    "nickname" : null,    "note" : null,    "organizations" : null,    "phoneNumbers" : [ { "id" : 0, "pref" : false,        "type" : "home",        "value" : "0659295103"      } ],    "photos" : null,    "rawId" : null,    "urls" : null  },  { "addresses" : null,    "birthday" : null,    "categories" : null,    "displayName" : null,    "emails" : null,    "id" : 136,    "ims" : null,    "name" : { "familyName" : "Bango",        "formatted" : "Howard Bango",        "givenName" : "Howard",        "honorificPrefix" : null,        "honorificSuffix" : null,        "middleName" : null      },    "nickname" : null,    "note" : null,    "organizations" : null,    "phoneNumbers" : null,    "photos" : null,    "rawId" : null,    "urls" : null  },  { "addresses" : null,    "birthday" : null,    "categories" : null,    "displayName" : null,    "emails" : null,    "id" : 138,    "ims" : null,    "name" : { "familyName" : "Anne",        "formatted" : "Cécile Anne",        "givenName" : "Cécile",        "honorificPrefix" : null,        "honorificSuffix" : null,        "middleName" : null      },    "nickname" : null,    "note" : null,    "organizations" : null,    "phoneNumbers" : null,    "photos" : null,    "rawId" : null,    "urls" : null  },  { "addresses" : null,    "birthday" : null,    "categories" : null,    "displayName" : null,    "emails" : null,    "id" : 140,    "ims" : null,    "name" : { "familyName" : "Dubreuil",        "formatted" : "Clémence Dubreuil",        "givenName" : "Clémence",        "honorificPrefix" : null,        "honorificSuffix" : null,        "middleName" : null      },    "nickname" : null,    "note" : null,    "organizations" : null,    "phoneNumbers" : null,    "photos" : null,    "rawId" : null,    "urls" : null  },  { "addresses" : null,    "birthday" : null,    "categories" : null,    "displayName" : null,    "emails" : null,    "id" : 141,    "ims" : null,    "name" : { "familyName" : "Santostefano",        "formatted" : "Nanou Santostefano",        "givenName" : "Nanou",        "honorificPrefix" : null,        "honorificSuffix" : null,        "middleName" : null      },    "nickname" : null,    "note" : null,    "organizations" : null,    "phoneNumbers" : null,    "photos" : null,    "rawId" : null,    "urls" : null  }];  //   $scope.contacts = [];
    angular.forEach(contacts, function(c, key) {
      var contact = {};
      contact.name = c.name.formatted;
      contact.phoneNumber = (c.phoneNumbers) ? c.phoneNumbers[0].value : '';
      contact.email = (c.emails) ? c.emails[0].value : '';
      contact.facebook = (c.ims) ? c.ims[0].value : '';
      $scope.contacts.push(contact);
    });
  }

});
