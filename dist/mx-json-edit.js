
(function(){
"use strict";
angular.module('mx.json.edit', ['mx/template/jsonedit/index.html']);

;
angular
  .module('mx.json.edit')
  .directive('jsonEdit', ['$compile', 'mxJsonEdit', '$templateCache', function($compile, mxJsonEdit, $templateCache) {
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

        var newElement = angular.element(
          $templateCache.get('mx/template/jsonedit/index.html')
        );
        $compile(newElement)(scope);
        element.replaceWith(newElement);
      }
      // templateUrl: 'mx/template/jsonedit/index.html'
    };
  }]);

;
angular.module('mx.json.edit').factory('mxJsonEdit', function() {
  var result = {
    getType: getType,
    possibleNumber: possibleNumber,
    moveKey: moveKey,
    deleteKey: deleteKey,
    addItem: addItem
  };

  return result;

  function getType(obj) {
    var type = Object.prototype.toString.call(obj);
    if (type === '[object Object]') {
      return 'Object';
    } else if (type === '[object Array]') {
      return 'Array';
    } else if (type === '[object Boolean]') {
      return 'Boolean';
    } else if (type === '[object Number]') {
      return 'Number';
    } else {
      return 'Literal';
    }
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function possibleNumber(val) {
    return isNumber(val) ? parseFloat(val) : val;
  }

  function moveKey(obj, key, newkey) {
    if (key !== newkey) {
      obj[newkey] = obj[key];
      delete obj[key];
    }
  }

  function deleteKey(obj, key) {
    if (getType(obj) === 'Object') {
      if (confirm('Delete "' + key + '" and all it contains?')) {
        delete obj[key];
      }
    } else if (getType(obj) === 'Array') {
      if (confirm('Delete "' + obj[key] + '"?')) {
        obj.splice(key, 1);
      }
    } else {
      console.error('object to delete from was ' + obj);
    }
  }

  function addItem(obj, data) {
    if (getType(obj) === 'Object') {
      // check input for key
      if (data.keyName === undefined || data.keyName.length === 0) {
        alert('Please fill in a name');
      } else if (data.keyName.indexOf('$') === 0) {
        alert('The name may not start with $ (the dollar sign)');
      } else if (data.keyName.indexOf('_') === 0) {
        alert('The name may not start with _ (the underscore)');
      } else {
        if (obj[data.keyName]) {
          if (
            !confirm(
              'An item with the name "' +
                data.keyName +
                '" exists already. Do you really want to replace it?'
            )
          ) {
            return;
          }
        }
        if (data.valueType === data.numberName && !isNumber(data.valueName)) {
          alert('Please fill in a number');
          return;
        }
        // add item to object
        switch (data.valueType) {
          case data.stringName:
            obj[data.keyName] = data.valueName ? data.valueName : '';
            break;
          case data.numberName:
            obj[data.keyName] = possibleNumber(data.valueName);
            break;
          case data.objectName:
            obj[data.keyName] = {};
            break;
          case data.arrayName:
            obj[data.keyName] = [];
            break;
          case data.boolName:
            obj[data.keyName] = false;
            break;
        }
        //clean-up
        data.keyName = '';
        data.valueName = '';
        data.showAddKey = false;
      }
    } else if (getType(obj) === 'Array') {
      if (data.valueType === data.numberName && !isNumber(data.valueName)) {
        alert('Please fill in a number');
        return;
      }
      // add item to array
      switch (data.valueType) {
        case data.stringName:
          obj.push(data.valueName ? data.valueName : '');
          break;
        case data.numberName:
          obj.push(possibleNumber(data.valueName));
          break;
        case data.objectName:
          obj.push({});
          break;
        case data.arrayName:
          obj.push([]);
          break;
        case data.boolName:
          obj.push(false);
          break;
      }
      data.valueName = '';
      data.showAddKey = false;
    } else {
      console.error('object to add to was ' + obj);
    }
  }
});

;
angular.module("mx/template/jsonedit/index.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("mx/template/jsonedit/index.html",
    "<span class=\"json-info\">\n" +
    "    <i ng-click=\"data.collapsed = !data.collapsed\" class=\"glyphicon json-collapsed\"\n" +
    "      ng-class=\"{'glyphicon-chevron-down': !data.collapsed, 'glyphicon-chevron-right': data.collapsed}\"></i>\n" +
    "    <i ng-if=\"!data.showAddKey\" ng-click=\"data.collapsed = false; data.showAddKey = true\" class=\"glyphicon glyphicon-plus json-plus\"></i>\n" +
    "    <span>{{::(type === 'object') ? data.objectName : ''}}{{::(type === 'array') ? data.arrayName : ''}}</span>\n" +
    "</span>\n" +
    "<div ng-if=\"data.showAddKey && !data.collapsed\">\n" +
    "    <input ng-if=\"::type === 'object'\" placeholder=\"Name\" type=\"text\"\n" +
    "           class=\"form-control input-sm\" ng-model=\"data.keyName\"/>\n" +
    "    <select ng-model=\"data.valueType\" ng-options=\"option for option in ::valueTypes\" class=\"form-control input-sm\"\n" +
    "    ></select>\n" +
    "    <span ng-if=\"data.valueType === data.stringName || data.valueType == data.numberName\"> :\n" +
    "            <input type=\"text\" placeholder=\"Value\" class=\"form-control input-sm\" ng-model=\"data.valueName\"/>\n" +
    "        </span>\n" +
    "    <button type=\"button\" class=\"btn btn-primary btn-sm\" ng-click=\"addItem(child, data)\"><i class=\"glyphicon glyphicon-plus\"></i></button>\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"data.showAddKey=false\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n" +
    "</div>\n" +
    "<div class=\"json-content\" ng-if=\"!data.collapsed\">\n" +
    "    <div class=\"json-item\" ng-repeat=\"(key, val) in child track by $id(key)\">\n" +
    "        <span class=\"json-info\">\n" +
    "            <span ng-if=\"::type === 'array'\">{{::key+1}}.</span>\n" +
    "            <input ng-if=\"::type === 'object'\"\n" +
    "                   class=\"form-control input-sm\"\n" +
    "                   type=\"text\"\n" +
    "                   ng-model=\"newkey\"\n" +
    "                   ng-init=\"newkey=key\"\n" +
    "                   ng-blur=\"moveKey(child, key, newkey)\"/>\n" +
    "            <i class=\"glyphicon glyphicon-trash json-trash\" ng-click=\"deleteKey(child, key)\"></i>\n" +
    "        </span>\n" +
    "        <span ng-switch=\"::getType(val)\">\n" +
    "            <span json-edit ng-switch-when=\"Object\" child=\"val\" type=\"object\" collapsed=\"collapsed\"></span>\n" +
    "            <span json-edit ng-switch-when=\"Array\" child=\"val\" type=\"array\" collapsed=\"collapsed\"></span>\n" +
    "            <input  ng-switch-when=\"Boolean\" type=\"checkbox\" ng-model=\"val\" ng-change=\"child[key] = val\"/>\n" +
    "            <input ng-switch-when=\"Number\" class=\"form-control input-sm\" type=\"number\" ng-model=\"val\" placeholder=\"0\" ng-change=\"child[key] = possibleNumber(val)\"/>\n" +
    "            <input ng-switch-default class=\"form-control input-sm\" type=\"text\" ng-model=\"val\" placeholder=\"Empty\" ng-change=\"child[key] = val\"/>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

})();
//# sourceMappingURL=mx-json-edit.js.map