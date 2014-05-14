'use strict';

/*======================================
=            Events Service            =
======================================*/

Shaketonbde.factory('Event', ['$resource',
  function($resource){
    return $resource('http://www.corsproxy.com/welcomattic.com/events.json', {}, {'query': {method: 'GET', isArray: false}});
  }]
);
