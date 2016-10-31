angular.module('starter.services', [])

.factory('BeerDog', function($http, $q) {

    function getAll() {
      var deferred = $q.defer();
      $http.get('http://sonjainge.com/api/beerdog.php')
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
  .factory('BestBeers', function($http, $q) {

    function getAll() {
      var deferred = $q.defer();
      $http.get('http://sonjainge.com/api/beerbest.php')
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
        $http.get('http://sonjainge.com/api/data.php')
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

    function save(userValues) {
      var deferred = $q.defer();

      if (!_.isEmpty(userValues.drinkerId)) {
        $http.post('http://sonjainge.com/api/beersaver.php', userValues)
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


    return {
      all: function() {
        return getAll();
      },
      saveMyValues: function(userValues) {
        save(userValues);
      }
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
