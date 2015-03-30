# README

Very small AMD loader:

```javascript
//use a default path if you like. not required...
define.options({
    path: 'js'
});

define('main', ['dep1', 'folder/dep2'], function(dep1, dep2) {
    //use dep1 and dep2
});
```