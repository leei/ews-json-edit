angular
  .module('mx.json.edit')
  .directive('jsonEdit', function($compile, mxJsonEdit, $templateCache) {
    return {
      restrict: 'A',
      scope: {
        child: '=',
        type: '@',
        collapsed: '=?'
      },
      link: function(scope, element, attributes) {

        scope.data = {
          keyName: '',
          valueName: '',
          valueType: 'Text',
          showAddKey: false,
          collapsed: scope.collapsed,

          stringName: 'Text',
          objectName: '{}',
          arrayName: '[]',
          boolName: 'Boolean',
          numberName: 'Number'
        };

        scope.valueTypes = [
          scope.data.stringName,
          scope.data.objectName,
          scope.data.arrayName,
          scope.data.boolName,
          scope.data.numberName
        ];

        scope.getType = mxJsonEdit.getType;
        scope.possibleNumber = mxJsonEdit.possibleNumber;
        scope.moveKey = mxJsonEdit.moveKey;
        scope.deleteKey = mxJsonEdit.deleteKey;
        scope.addItem = mxJsonEdit.addItem;


        if (scope.type !== 'array' && scope.type !== 'object') {
          console.error('scope.type was ' + scope.type);
        }

        var newElement = angular.element($templateCache.get('mx/template/jsonedit/index.html'));
        $compile(newElement)(scope);
        element.replaceWith(newElement);
      },
      // templateUrl: 'mx/template/jsonedit/index.html'
    };
  });
