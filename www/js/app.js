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
  }, 3000);
  // Exception for desktop browsers
  if(!ionic.Platform.isWebView()) gettextCatalog.currentLanguage = 'fr';
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

