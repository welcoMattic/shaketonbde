'use strict';
var Shaketonbde = angular.module('Shaketonbde', ['ionic', 'ngResource', 'gettext', 'angulartics', 'angulartics.google.analytics.cordova']);

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
        gettextCatalog.currentLanguage = 'fr';
      }
    );
  }, 3000);
  if(!ionic.Platform.isWebView()) gettextCatalog.currentLanguage = 'fr';
});

Shaketonbde.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

/*======================================
=      Localstorage Service            =
======================================*/

Shaketonbde.run(function($localstorage) {
  $localstorage.set('name', 'Max');
  console.log($localstorage.get('name'));
  $localstorage.setObject('post', {
    name: 'Thoughts',
    text: 'Today was a good day'
  });

  var post = $localstorage.getObject('post');
  console.log(post);
});
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
