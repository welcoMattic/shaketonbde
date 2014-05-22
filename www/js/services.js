'use strict';

/*======================================
=            Events Service            =
======================================*/

Shaketonbde.factory('Event', ['$resource',
  function($resource){
    return $resource(
      'http://www.corsproxy.com/welcomattic.com/events.json',
      {},
      {'query': {method: 'GET', isArray: true}}
    );
  }]
);

Shaketonbde.factory('Camera', ['$q', function($q) {
  return {
    getPicture: function(options) {
      var q = $q.defer();
      navigator.camera.getPicture(function(result) {
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      },
      {
        quality: 20,
        destinationType: Camera.DestinationType.FILE_URI
      });
      return q.promise;
    }
  }
}]);

/*======================================
=      Localstorage Service            =
======================================*/

Shaketonbde.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
