angular.module('starter.services', [])


.factory('BestBeers', function($http, $q) {

    function getAll() {
      var deferred = $q.defer();
      $http.get('http://sonjainge.com/api/tapbattlebestbeer.php?eventid=3')
        .then(ok)
        .then(failed)

      function ok(response) {
        deferred.resolve(response.data);
      }
      function failed(response) {
        deferred.reject(response);
      }

      return deferred.promise;
    }

    return {
      all: function() {
        return getAll();
      }
    };
  })
.factory('AvailableRatings', function() {
  var ratings = [0,1,2,3,4,5,6,7,8,9,10];

  return {
    all: function() {
      return ratings;
    }
  };
})
.factory('ServerValues', function($http, $q) {
    var _serverValues;

    function getAll() {
      var deferred = $q.defer();

      if (!_serverValues || angular.equals(_serverValues, {})) {
        $http.get('http://sonjainge.com/api/tapbattledata.php?eventid=3')
          .then(ok)
          .then(failed);
      } else {
        console.log(_serverValues);
        return _serverValues;
      }

      function ok(response) {
        _serverValues = response.data;
        deferred.resolve(_serverValues);
      }
      function failed(response) {
        deferred.reject(response);
      }

      return deferred.promise;
    }

    function save(userValues) {;
      userValues.eventId = "3";

      var deferred = $q.defer();

      if (!_.isEmpty(userValues.drinkerId)) {
        $http.post('http://sonjainge.com/api/tapbattlesaver.php', userValues)
          .then(ok)
          .then(failed);
      }

      function ok(response) {
        console.log(response);
        deferred.resolve(response);
      }
      function failed(response) {
        console.log(response);
        deferred.reject(response);
      }

      return deferred.promise;
    }

    function getMyRatings (drinkerId) {
      var deferred = $q.defer();

      if (!_.isEmpty(drinkerId)) {
        $http.get('http://sonjainge.com/api/tapbattledrinkerdata.php?eventid=3&drinkerid=' + drinkerId)
          .then(ok)
          .then(failed);
      }

      function ok(response) {
        console.log(response);
        deferred.resolve(response.data);
      }
      function failed(response) {
        console.log(response);
        deferred.reject(response);
      }

      return deferred.promise;
    }


    return {
      all: function() {
        return getAll();
      },
      saveMyValues: function(userValues) {
        save(userValues);
      },
      getMyRatings: function (drinkerId) {
        return getMyRatings(drinkerId);
      }
    };
})

.factory('UserService', function() {
    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database

    var setUser = function(user_data) {
      window.localStorage.starter_google_user = JSON.stringify(user_data);
    };

    var getUser = function(){
      return JSON.parse(window.localStorage.starter_google_user || '{}');
    };

    return {
      getUser: getUser,
      setUser: setUser
    };
})

.factory('LocalStorage', function($window) {
    function setObject(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    }
    function getObject(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }

    return {
      setObject: function(key, value) {
        return setObject(key, value);
      },
      getObject: function(key) {
        return getObject(key);
      }
    };
});
