/*=====================================
=            Menu Controller          =
=====================================*/

Shaketonbde.controller('AppCtrl', function($scope, $ionicActionSheet, gettextCatalog, gettext) {
  $scope.openSettings = function() {
    $ionicActionSheet.show({
      buttons: [
         { text: gettextCatalog.getString(gettext('French')) },
         { text: gettextCatalog.getString(gettext('English')) },
      ],
      titleText: gettextCatalog.getString(gettext('Change language')),
      cancelText: gettextCatalog.getString(gettext('Cancel')),
      buttonClicked: function(index) {
        if(index === 0) gettextCatalog.currentLanguage = 'fr';
        if(index === 1) gettextCatalog.currentLanguage = 'en';
        return true;
      }
    });
  };
});



/*========================================
=            Events Controller           =
========================================*/

Shaketonbde.controller('EventsCtrl', function($scope, $ionicLoading, $ionicPlatform, $q, $window, Event, gettext, gettextCatalog, CordovaNetwork) {
  $scope.reload = function() {
    $window.location.reload();
  };

  var markersArray = [];
  var infoWindows = [];

  // Map washer
  function clearMap() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }

  function makeInfoWindowEvent(map, infowindow, marker) {
    window.google.maps.event.addListener(marker, 'click', function() {
      angular.forEach(infoWindows, function(iw) { iw.close(); });
      infowindow.open(map, marker);
    });
    window.google.maps.event.addListener(marker, 'touch', function() {
      angular.forEach(infoWindows, function(iw) { iw.close(); });
      infowindow.open(map, marker);
    });
  }

  function initialize(callback) {
    var mapOptions = {
          // Center on Paris by default
          center: new window.google.maps.LatLng(48.8588589,2.3470599),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    google.maps.event.addDomListener(document.getElementById('map'), 'mousedown',
      function(e) {
        e.preventDefault();
        return false;
      }
    );

    $scope.map = map;
    callback();
  }

  function onGeolocSuccess(pos) {
    var myPos = new window.google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        Events = new Event.query();

    Events.$promise.then(function(events) {
      $scope.events = [];
      angular.forEach(events[0], function(event) {
        var letterId = String.fromCharCode(97 + parseInt(event.id)).toUpperCase();
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
    });

    $scope.map.setCenter(myPos);
    var icon = new google.maps.MarkerImage('http://maps.google.com/mapfiles/marker_green.png', null, null, null, new google.maps.Size(20,34));
    var infowindow = new window.google.maps.InfoWindow({ content: 'You' });
    var userMarker = new window.google.maps.Marker({
      position: myPos,
      map: $scope.map,
      icon: icon
    });
    markersArray.push(userMarker);
    infoWindows.push(infowindow);
    makeInfoWindowEvent($scope.map, infowindow, userMarker);
    $ionicLoading.hide();
  }

  function onGeolocFail(error) {
    navigator.notification.alert(gettextCatalog.getString(gettext('You are invisible: ')) + error.message, function(){}, 'Shake Ton BDE', 'Ok');
  }

  $scope.centreOnMe = function() {
    if(!$scope.map) { return; }
    clearMap();
    $ionicLoading.show({ template: '<i class="icon ion-loading-c page-loader"></i>' });
    navigator.geolocation.getCurrentPosition(onGeolocSuccess, onGeolocFail, { enableHighAccuracy: true });
  };

  // wait ready event to fire
  $ionicPlatform.ready(function() {
    // Promise that return boolean isConnected
    CordovaNetwork.isOnline().then(function(isConnected) {
      $scope.isConnected = isConnected;

      if(isConnected) {
        // if device is connected
        window.google.maps.event.addDomListener(window, 'load', initialize($scope.centreOnMe));
      } else {
        // device is not connected
        var LSlength = window.localStorage.length;
        var events = [];
        for(var i = 0 ; i < LSlength ; i++) {
          var event = JSON.parse(window.localStorage.getItem(i));
          var letterId = String.fromCharCode(97 + parseInt(event.id)).toUpperCase();
          event.letterId = letterId;
          events.push(event);
        }
        if(events.length > 0)
          $scope.events = events;
      }
    }).catch(function(err) {
      // In case of promise rejection
      console.log('Connection promise error : ', err);
      // For desktop browser
      // $scope.isConnected = false;

      // if($scope.isConnected) {
      //   // if device is connected
      //   window.google.maps.event.addDomListener(window, 'load', initialize($scope.centreOnMe));
      // } else {
      //   // device is not connected
      //   var LSlength = window.localStorage.length;
      //   var events = [];
      //   for(var i = 0 ; i < LSlength ; i++) {
      //     var event = JSON.parse(window.localStorage.getItem(i));
      //     var letterId = String.fromCharCode(97 + parseInt(event.id)).toUpperCase();
      //     event.letterId = letterId;
      //     events.push(event);
      //   }
      //   if(events.length > 0)
      //     $scope.events = events;
      // }

    });
  });

});



/*===============================================
=            Single Event Controller            =
===============================================*/

Shaketonbde.controller('EventCtrl', function($scope, $stateParams, $ionicPlatform, Event, CordovaNetwork, gettext, gettextCatalog) {
  $ionicPlatform.ready(function() {
      // if device is connected
      CordovaNetwork.isOnline().then(function(isConnected) {
        if(isConnected) {
          Event.query().$promise.then(function(events) {
            var event = events[0][$stateParams.eventId];
            event.date = new Date(event.date);
            $scope.event = event;
            $scope.saveEvent = function(idSavedEvent) {
              window.localStorage.setItem(idSavedEvent, JSON.stringify($scope.event));
              navigator.notification.alert(gettextCatalog.getString(gettext('Event is bookmarked')), function(){}, 'Shake Ton BDE', 'Ok');
            }
          });
        } else {
          $scope.event = JSON.parse(window.localStorage.getItem($stateParams.eventId));
        }
      }).catch(function(err) {
        console.log('Connection promise error : ', err);
        // For desktop browser
        // isConnected = false;

        // if(isConnected) {
        //   Event.query().$promise.then(function(events) {
        //     var event = events[0][$stateParams.eventId];
        //     event.date = new Date(event.date);
        //     $scope.event = event;
        //     $scope.saveEvent = function(idSavedEvent) {
        //       window.localStorage.setItem(idSavedEvent, JSON.stringify($scope.event));
        //       navigator.notification.alert(gettextCatalog.getString(gettext('Event is bookmarked')), function(){}, 'Shake Ton BDE', 'Ok');
        //     }
        //   });
        // } else {
        //   $scope.event = JSON.parse(window.localStorage.getItem($stateParams.eventId));
        // }
      });
  });
});



/*=========================================
=            Camera Controller            =
=========================================*/

Shaketonbde.controller('CameraCtrl', function($scope, $state, Camera) {
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
              $state.go('app.camera');
            },
            function(errormsg) {
              $state.go('app.camera');
            }
          );
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

Shaketonbde.controller('InviteCtrl', function($scope, $ionicLoading, $ionicActionSheet, Event, gettext, gettextCatalog) {

  function onSuccess(data) {
    var contacts = [];
    angular.forEach(data, function(c) {
      var contact = {};
      contact.name = c.name.formatted;
      contact.phoneNumber = (c.phoneNumbers) ? c.phoneNumbers[0].value : '';
      contact.email = (c.emails) ? c.emails[0].value : '';
      contact.facebook = (c.ims) ? c.ims[0].value : '';
      contact.checked = false;
      contacts.push(contact);
    });
    $scope.contacts = contacts;
    $ionicLoading.hide();

    $scope.invite = function() {

      var Events = new Event.query();
      var buttons = [];
      var message = '';

      Events.$promise.then(function(events) {
        $scope.events = [];
        angular.forEach(events[0], function(event) {
          var eventPosition = new window.google.maps.LatLng(event.coord.split(',')[0], event.coord.split(',')[1]);
          $scope.events.push(event);
          buttons.push({text : event.name});
        });
      });

      $ionicActionSheet.show({
        buttons: buttons,
        titleText: gettextCatalog.getString(gettext('Choose event')),
        cancelText: gettextCatalog.getString(gettext('Cancel')),
        buttonClicked: function(index) {
          message = gettextCatalog.getString(gettext("Yo! I invite you to this event: "))
                    + $scope.events[index].name + ', '
                    + gettextCatalog.getString(gettext("the: "))
                    + $scope.events[index].date;
          var selectedNumbers = $scope.contacts.filter(function(value) {
            return value.checked;
          });
          var target = [];
          angular.forEach(selectedNumbers, function(c) {
            target.push(c.phoneNumber);
          });
          var targetCommaSeparated = target.reduce(function(previousValue, currentValue, index, array){
            return previousValue + ',' + currentValue;
          });
          window.plugins.socialsharing.shareViaSMS(message, targetCommaSeparated);
          return true;
        }
      });
    };
  }

  function onError(contactError) {
    navigator.notification.alert(gettextCatalog.getString(gettext('Error during contacts fetching')), function(){}, 'Shake Ton BDE', 'Ok');
    console.log('onError ContactsLoad: ', contactError.code);
    $ionicLoading.hide();
  }

  var options = new ContactFindOptions();
  options.filter = '';
  options.multiple = true;
  var fields = ['name', 'emails', 'ims', 'phoneNumbers'];
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c page-loader"></i>'
  });
  navigator.contacts.find(fields, onSuccess, onError, options);

});
