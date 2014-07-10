'use strict';

var loggerModule=angular.module('core.logger', [])
.config(["$provide", LogDecorator ])
.run(["$log",function coreLoggerRun($log) {

    var remoteLoggingRequired=true;
    var offlineLogsRequired=true;

    if(remoteLoggingRequired){

        $log.setRemoteLoggingOnOff(remoteLoggingRequired);
    }

    $log.setOfflineLogsOnOff(offlineLogsRequired);

    $log.getInstance('coreLoggerRun').log('aasdasd');
    //anonymous logging
    $log.error('aasdasd');
}]);
