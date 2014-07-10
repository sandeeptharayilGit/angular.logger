core.commons
============


Modals Service - CoreCommonsModalSrv
------------------------------------

This service uses modals from http://angular-ui.github.io/bootstrap/

### Modal Screen

Screens can be opened by calling the `screen` method, like in the example bellow.

```
CoreCommonsModalSrv.screen(templateUrl)
    .result.then(function(closeResult) {
        console.log('close', closeResult);
    }, function(dismissReason) {
        console.log('dismiss', dismissReason);
    });
```

`CoreCommonsModalSrv.screen` returns a modal instance, an object with the following properties:

* `close(result)` - a method that can be used to close a modal, passing a result
* `dismiss(reason)` - a method that can be used to dismiss a modal, passing a reason
* `result` - a promise that is resolved when a modal is closed and rejected when a modal is dismissed
* `opened` - a promise that is resolved when a modal gets opened after downloading content's template and resolving all variables

In addition the scope associated with modal's content is augmented with 2 methods:

* `$close(result)`
* `$dismiss(reason)`


### Alerts

Alert like popups can be called as in the examples bellow.

```
// uses default actions
CoreCommonsModalSrv.alert(message);
// passing custom actions
CoreCommonsModalSrv.alert(message, {actions: {ok: 'OK', maybe: 'Maybe', cancel: 'Cancel'}});
```

The second argument can be an object containing an actions attribute. If passed, a list of buttons will be created. Each button will be bound to the `close(key)` method and will pass the action key. It's value should be a human readable label for the button. If it is not defined, it will default to `{ok: 'OK', cancel: 'Cancel'}`.

`CoreCommonsModalSrv.alert` returns a modal instance, just like the `screen` method. The only exception is that it only has the `result` and `opened` params. `close` and `dismiss` must always be triggered from user input.


### Tooltips - under development

Tooltips can be called like in the examples bellow.

```
CoreCommonsModalSrv.tooltip($event, templateUrl, context);
```

* `$event` should be a [ngClick $event](https://docs.angularjs.org/guide/expression#-event-)
* `templateUrl` should be a URL string to the template to be used
* `context` should be an object to be used to render the tooltip. It will be placed in the tooltip's `$scope` 


As in the `alert` method, `CoreCommonsModalSrv.tooltip` returns a modal instance with only the `result` and `opened` params.
