angular.module('starter.controllers', [])

.controller('SchemaCtrl', function($scope, LocalStorage, ServerValues, AvailableRatings) {

    ServerValues.all()
      .then(function(serverValues) {
        $scope.serverValues = serverValues;
      });

    $scope.availableRatings = AvailableRatings.all();

    $scope.schema = {
      drinkerId: '0',
      answers: [
        { questionId: 1 },
        { questionId: 2 },
        { questionId: 3 },
        { questionId: 4 },
        { questionId: 5 },
        { questionId: 6 },
        { questionId: 7 },
        { questionId: 8 },
        { questionId: 9 },
        { questionId: 10 }
        //{ questionId: 1, breweryId: 1, abvId: 2, rating: 4 }
      ]
    };

    var savedSchema = LocalStorage.getObject('schema');
    _.extend($scope.schema, savedSchema);


    $scope.setDrinker = function(drinkerId) {
      $scope.schema.drinkerId = drinkerId;
      save();
    };

    $scope.setBrewery = function(id, breweryId) {
      var foundAnswer = _.findWhere($scope.schema.answers, {questionId: id });
      foundAnswer.breweryId = breweryId;
      save();
    };
    $scope.setAbv = function(id, abvId) {
      var foundAnswer = _.findWhere($scope.schema.answers, {questionId: id });
      foundAnswer.abvId = abvId;
      save();
    };
    $scope.setRating = function(id, rating) {
      var foundAnswer = _.findWhere($scope.schema.answers, {questionId: id });
      foundAnswer.rating = rating;
      save();
    };

    function save() {
      // Save to local storage
      LocalStorage.setObject('schema', $scope.schema);

      // Save to db
      ServerValues.saveMyValues($scope.schema);
    }
})

.controller('BeerDogCtrl', function($scope, BeerDog) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {

    BeerDog.all().then(function(beerDogs) {
      $scope.beerDogs = beerDogs;

      var lastPoint;
      angular.forEach($scope.beerDogs, function(beerDog) {
        if (!lastPoint || beerDog.points === lastPoint) {
          lastPoint = beerDog.points;
          beerDog.addTrophy = true;
        } else {
          beerDog.addTrophy = false;
        }
      });
    });

  });
})

.controller('TabsCtrl', function($scope) {


})

.controller('BestBeersCtrl', function($scope, BestBeers) {
    $scope.$on('$ionicView.enter', function(e) {

      BestBeers.all().then(function (bestBeers) {
        $scope.bestBeers = bestBeers;

        var lastPoint;
        angular.forEach($scope.bestBeers, function (bestBeer) {
          if (!lastPoint || bestBeer.points === lastPoint) {
            lastPoint = bestBeer.points;
            bestBeer.addTrophy = true;
          } else {
            bestBeer.addTrophy = false;
          }
        });
      });

    });
});
