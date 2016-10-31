angular.module('starter.controllers', [])

.controller('SchemaCtrl', function($scope, LocalStorage, ServerValues, AvailableRatings, $ionicLoading) {

  // This method is executed when the user press the "Sign in with Google" button
  /*$scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logger inn...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });

        $ionicLoading.hide();
        $state.go('tab.schema');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };*/


    $scope.availableRatings = AvailableRatings.all();

    $scope.schema = {
      drinkerId: '0',
      answers: [
        //{ beerId: 1, rating: 5 }
      ]
    };

    var drinkerId = LocalStorage.getObject('drinkerId');
    $scope.schema.drinkerId = drinkerId;
    //$scope.schema.drinkerId = LocalStorage.getObject('drinkerId');




    $scope.setDrinker = function(drinkerId) {
      $scope.schema.answers = [];
      $scope.schema.drinkerId = drinkerId;
      // Save to local storage
      LocalStorage.setObject('drinkerId', $scope.schema.drinkerId);

      getMyRatings();
    };

    $scope.setRating = function(breweryId, rating) {
      var foundAnswer = _.findWhere($scope.schema.answers, {beerId: breweryId });
      if (foundAnswer)
        foundAnswer.rating = '' + rating;
      else
        $scope.schema.answers.push({ beerId: breweryId, rating: '' + rating })
      save();
    };
    $scope.hasRating = function (breweryId) {
      return _.some($scope.schema.answers, function (answer) {
          return answer.beerId === breweryId;
      });
    };
    $scope.getBeerIndex = function(breweryId) {
      return _.findIndex($scope.schema.answers, function(answer) { return answer.beerId == breweryId; })
    };

    function getMyRatings() {
      var drinkerId = LocalStorage.getObject('drinkerId');
      ServerValues.getMyRatings(drinkerId)
        .then(function(myRatings) {
          if (myRatings.breweries) {
            _.extend($scope.schema.answers, myRatings.breweries);


          }

          // TODO: set ratings on serverValues.breweries
          console.log('My ratings:');
          console.log(myRatings.breweries);
          console.log($scope.schema.answers);

          _.forEach($scope.serverValues.breweries, function (brewery) {
            var foundRating = _.findWhere($scope.schema.answers, { beerId: brewery.id });
            console.log('found rating: ');
            console.log(foundRating);
            brewery.rating = (foundRating) ? foundRating.rating : undefined
          })
        });
    }

    function save() {
      // Save to db
      ServerValues.saveMyValues($scope.schema);
    }


  ServerValues.all()
    .then(function(serverValues) {
      $scope.serverValues = serverValues;


      console.log('Breweries:');
      console.log($scope.serverValues.breweries);
      getMyRatings();

    });

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

.controller('WelcomeCtrl', function($scope, $state, UserService, $ionicLoading) {
  /*// This method is executed when the user press the "Sign in with Google" button
  $scope.googleSignIn = function() {
    $ionicLoading.show({
      template: 'Logger inn...'
    });

    window.plugins.googleplus.login(
      {},
      function (user_data) {
        // For the purpose of this example I will store user data on local storage
        UserService.setUser({
          userID: user_data.userId,
          name: user_data.displayName,
          email: user_data.email,
          picture: user_data.imageUrl,
          accessToken: user_data.accessToken,
          idToken: user_data.idToken
        });

        $ionicLoading.hide();
        $state.go('tab.schema');
      },
      function (msg) {
        $ionicLoading.hide();
      }
    );
  };*/
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
