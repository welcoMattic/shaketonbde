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
  var infoWindows = [];

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
  };

  function makeInfoWindowEvent(map, infowindow, marker) {
    window.google.maps.event.addListener(marker, 'click', function() {
      angular.forEach(infoWindows, function(iw, key) {
        iw.close();
      });
      infowindow.open(map, marker)
    });
    window.google.maps.event.addListener(marker, 'touch', function() {
      angular.forEach(infoWindows, function(iw, key) {
        iw.close();
      });
      infowindow.open(map, marker)
    });
  }

  $scope.centreOnMe = function() {
    if(!$scope.map) {
      return;
    }

    clearMap();

    $ionicLoading.show({
      template: '<i class="icon ion-loading-c page-loader"></i>'
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      var myPos = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          Events = new Event.query();

      Events.$promise.then(function(events) {
        $scope.events = [];
        angular.forEach(events[0], function(event, key) {
          var letterId = String.fromCharCode(96 + parseInt(event.id)).toUpperCase();
          var eventPosition = new window.google.maps.LatLng(event.coord.split(',')[0], event.coord.split(',')[1]);
          var icon = new google.maps.MarkerImage('http://maps.google.com/mapfiles/marker' + letterId + '.png', null, null, null, new google.maps.Size(20,34));
          var marker = new window.google.maps.Marker({
            position: eventPosition,
            map: $scope.map,
            icon: icon
          });
          event.letterId = letterId;
          $scope.events.push(event);
          markersArray.push(marker);
          var infowindow = new window.google.maps.InfoWindow({ content: event.name });
          infoWindows.push(infowindow);
          makeInfoWindowEvent($scope.map, infowindow, marker);
        });
      })
      .catch(function(e){
        console.log(e);
      });

      $scope.map.setCenter(myPos);
      var icon = new google.maps.MarkerImage('http://maps.google.com/mapfiles/marker_green.png', null, null, null, new google.maps.Size(20,34));
      var userMarker = new window.google.maps.Marker({
        position: myPos,
        map: $scope.map,
        icon: icon
      });
      markersArray.push(userMarker);
      var infowindow = new window.google.maps.InfoWindow({ content: 'You' });
      infoWindows.push(infowindow);
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
    var event = events[0][$stateParams.eventId];
    event.date = new Date(event.date);
    $scope.event = event;
  });
});



/*=========================================
=            Camera Controller            =
=========================================*/

Shaketonbde.controller('CameraCtrl', function($scope, Camera) {
  $scope.takePhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      setTimeout(function() {
        $scope.$apply(function() {
          if(imageURI) {
            $scope.isImageURI = true;
            $scope.imageURI = imageURI;
          } else {
            $scope.isImageURI = false;
          }
        });
        // Scope function use to open native share action menu
        $scope.sharePhoto = function() {
          window.plugins.socialsharing.share(
            null, null, imageURI, null,
            function() {
              window.location.replace('#/app/camera');
            },
            function(errormsg) {
              console.log(errormsg);
              window.location.replace('#/app/camera');
            }
          )
        };
      }, function(err) {
        console.log('Failed because: ' + err);
      });
    }, 0);
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
    $scope.invite = function(num) {
        console.log(num);
        if (num == 1) {
            window.plugins.socialsharing.shareViaSMS(
                'My cool message', '0650560218',
                function(msg) {
                    console.log("ok");//window.location.replace('#/app/invite');
                },
                function(msg) {
                    console.log("error");//window.location.replace('#/app/invite');
                }
            )
        } else if (num == 2) {
          window.plugins.socialsharing.share(
                'Here my message;. Hey '+ contact.name +' !', 'Here the subject',
                function(msg) {
                    console.log("ok");
                },
                function(msg) {
                    console.log("error");
                }
            )
        } else {

        }
    };
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
      template: '<i class="icon ion-loading-c page-loader"></i>'
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
