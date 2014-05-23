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
    getPicture: function() {
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
  };
}]);


Shaketonbde.service('CordovaNetwork', ['$rootScope', '$ionicPlatform', '$q', function($rootScope, $ionicPlatform, $q) {
  // Get Cordova's global Connection object or emulate a smilar one
  var Connection = window.Connection || {
    'ETHERNET' : 'ethernet',
    'WIFI'     : 'wifi',
    'CELL_2G'  : 'cell_2g',
    'CELL_3G'  : 'cell_3g',
    'CELL_4G'  : 'cell_4g',
    'CELL'     : 'cell',
    'EDGE'     : 'edge',
    'UNKNOWN'  : 'unknown'
  };

  var asyncGetConnection = function () {
    var q = $q.defer();
    $ionicPlatform.ready(function () {
      if(navigator.connection) {
        promiseCompleted = true;
      } else {
        q.reject('navigator.connection is not defined');
      }
    });
    return q.promise;
  };

  return {
    isOnline: function () {
      return asyncGetConnection().then(function(networkConnection) {
        var isConnected = false;

        switch (networkConnection.type) {
          case Connection.ETHERNET:
          case Connection.WIFI:
          case Connection.CELL_2G:
          case Connection.CELL_3G:
          case Connection.CELL_4G:
          case Connection.CELL:
            isConnected = true;
            break;
        }
        return isConnected;
      });
    }
  };
}]);

