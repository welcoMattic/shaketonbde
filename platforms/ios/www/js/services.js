"use strict";

/*======================================
=            Events Service            =
======================================*/

Shaketonbde.factory('Event', ['$resource',
  function($resource){
    return $resource('events.json', {}, {'query': {method: 'GET', isArray: false}});
  }]
);
