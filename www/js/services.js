'use strict';

/*======================================
=            Events Service            =
======================================*/

Shaketonbde.factory('Event', ['$resource',
  function($resource){
    return $resource(
      'https://raw.githubusercontent.com/welcoMattic/shaketonbde/master/www/events.json',
      {
        callback: 'events'
      },
      {
        jsonp_query: {
          method: 'JSONP', isArray: true
        }
      }
    );
  }]
);
