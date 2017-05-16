/**
 * Created by JASMINE-j on 5/14/2017.
 */

'use strict';
app.factory('apisrv', [
    '$location', function($location) {
        var api_urlbuilder, obj;
        obj = {};
        api_urlbuilder = '';
        obj.config = {
            host: api_urlbuilder
        };
        obj.path = function(rpath) {
            return obj.config.host + rpath;
        };
        return obj;
    }
]);

