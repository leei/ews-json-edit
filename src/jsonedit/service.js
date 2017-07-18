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
