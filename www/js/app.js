'use strict';
var Shaketonbde = angular.module('Shaketonbde', ['ionic', 'ngResource', 'gettext']);

Shaketonbde.run(function($ionicPlatform, gettextCatalog, gettext) {
  // Init statusbar
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });

  // Init language & connection type
  var lang;
  var connected = false;
  setTimeout(function(){
    navigator.globalization.getPreferredLanguage(
      function(language) {
        lang = language.value;
        gettextCatalog.currentLanguage = lang;
      },
      function() {
        gettextCatalog.currentLanguage = 'fr';
      }
    );
    // connection detection
    if(ionic.Platform.isWebView()) {
      var networkState = navigator.connection.type;
      var states = {};
      states[Connection.UNKNOWN]  = gettextCatalog.getString(gettext('Unknown connection'));
      states[Connection.ETHERNET] = gettextCatalog.getString(gettext('Ethernet connection'));
      states[Connection.WIFI]     = gettextCatalog.getString(gettext('WiFi connection'));
      states[Connection.CELL_2G]  = gettextCatalog.getString(gettext('Cell 2G connection'));
      states[Connection.CELL_3G]  = gettextCatalog.getString(gettext('Cell 3G connection'));
      states[Connection.CELL_4G]  = gettextCatalog.getString(gettext('Cell 4G connection'));
      states[Connection.CELL]     = gettextCatalog.getString(gettext('Cell generic connection'));
      states[Connection.NONE]     = gettextCatalog.getString(gettext('No network connection'));

      if(states[networkState] !== Connection.NONE) {
        connected = true;
      }

      navigator.notification.alert(states[networkState], function(){}, 'Shake Ton BDE', 'Ok');
      navigator.notification.vibrate();
    }
  }, 3000);
  // Exception for desktop browsers
  if(!ionic.Platform.isWebView()) gettextCatalog.currentLanguage = 'fr';
  window.connected = connected;
});

Shaketonbde.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})


/*==============================
=            Router            =
==============================*/

Shaketonbde.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.camera', {
      url: '/camera',
      views: {
        'menuContent' :{
          templateUrl: 'templates/camera.html',
          controller: 'CameraCtrl'
        }
      }
    })

    .state('app.events', {
      url: '/events',
      views: {
        'menuContent' :{
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
        }
      }
    })

    .state('app.single', {
      url: '/events/:eventId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/event.html',
          controller: 'EventCtrl'
        }
      }
    })

    .state('app.invite', {
      url: '/invite',
      views: {
        'menuContent' :{
          templateUrl: 'templates/invite.html',
          controller: 'InviteCtrl'
        }
      }
    });

  $urlRouterProvider.otherwise('/app/events');
});

