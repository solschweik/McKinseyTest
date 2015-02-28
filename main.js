(function(_win_) {
  var theApp = angular.module('theApp', []);
  theApp.controller('theAppCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
    $scope.msg = 'Hi, there, you!';
    $log.info($scope.msg);
    $scope.data = {};
    var tag = 'NASA';

    Object.defineProperties($scope, {
      twits: {
        enumerable: true,
        value: function(tag) {
          if(!tag || tag.length < 3) return;
          console.info('Tag: ' + tag);
          $http({
            url: '/twits/' + tag,
            method: 'GET'
          }).success(function(resp) {
//            $log.info(JSON.stringify(resp));
            $scope.data = resp;
          }).error(function(err) {
            $log.error('Failed due to :', err);
          });
        }
      },
      tagName: {
        enumerable: true,
        get: function() { return tag; },
        set: function(v) {
          tag = v;
          this.twits(tag);
        }
      }
    });
    $scope.twits(tag);
  }])
})(window);
