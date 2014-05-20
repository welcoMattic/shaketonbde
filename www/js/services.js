'use strict';

/*======================================
=            Events Service            =
======================================*/

Shaketonbde.factory('Event', ['$resource',
  function($resource){
    return $resource(
<<<<<<< HEAD
      'http://www.corsproxy.com/welcomattic.com/events.json', {}, { query: { method: 'GET', isArray: false } }
=======
      'http://www.corsproxy.com/welcomattic.com/events.json',
      {},
      {'query': {method: 'GET', isArray: true}}
>>>>>>> e4d1652e76eda0617da16bdc7034dab9f01ec348
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
