'use strict';
var Shaketonbde = angular.module('Shaketonbde', ['ionic', 'ngResource', 'gettext']);

Shaketonbde.run(function($ionicPlatform, gettextCatalog, gettext) {
  // Init statusbar
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
    // Acceleration 1/2
    watchID = navigator.accelerometer.watchAcceleration(onSuccessAcceleration, onErrorAcceleration, optionFrequency);
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
  }, 3000);
  // Exception for desktop browsers
  if(!ionic.Platform.isWebView()) gettextCatalog.currentLanguage = 'fr';

  // Acceleration 2/2 -- variables and functions
  var watchID = null;
  var optionFrequency = { frequency : 1000 };
  function onSuccessAcceleration(acceleration) {
    if(acceleration.y > 18) {
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    }
  }

  function onErrorAcceleration() {
    console.log('Error Acceleration !');
  }
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

