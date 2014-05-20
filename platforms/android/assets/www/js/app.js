'use strict';
var Shaketonbde = angular.module('Shaketonbde', ['ionic', 'ngResource', 'gettext']);

Shaketonbde.run(function($ionicPlatform, gettextCatalog) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
  var lang;
  setTimeout(function(){
    navigator.globalization.getPreferredLanguage(
      function(language) {
        lang = language.value;
        console.log('LANG : ',lang);
        gettextCatalog.currentLanguage = lang;
      },
      function() {
        lang = 'fr';
      }
    );
  }, 3000);
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

