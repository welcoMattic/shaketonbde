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
