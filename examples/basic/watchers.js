angular.module('watchers', []).component('watchers', {
  template:
    '<button class="btn btn-default btn-sm" ng-click="$ctrl.recount()">{{$ctrl.watchers}} recount</button>',
  controller: function() {
    var watchers = [],
      watchersWithoutDuplicates = [];
    this.recount = recount;

    function f(element) {
      angular.forEach(['$scope', '$isolateScope'], function(scopeProperty) {
        if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
          var scope = element.data()[scopeProperty],
            params = {};

          if (scope.$$watchers) {
            angular.forEach(scope, function(param, key) {
              if (key.indexOf('$') === -1) {
                params[key] = param;
              }
            });
            console.log(scope.$id, scope.$$watchers.length, params);
          }

          angular.forEach(scope.$$watchers, function(watcher) {
            watchers.push(watcher);
          });
        }
      });

      angular.forEach(element.children(), function(childElement) {
        f(angular.element(childElement));
      });
    }

    function recount() {
      watchers = [];
      watchersWithoutDuplicates = [];

      f(angular.element(document.getElementsByTagName('html')));
      angular.forEach(watchers, function(item) {
        if (watchersWithoutDuplicates.indexOf(item) < 0) {
          watchersWithoutDuplicates.push(item);
        }
      });

      this.watchers = watchersWithoutDuplicates.length;
    }
  }
});
