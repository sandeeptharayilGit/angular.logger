'use strict';

var loggerModule=angular.module('angular.logger', [])
.config(["$provide", LogDecorator ])
.run(["$log",function coreLoggerRun($log) {
  	var log=$log.getInstance('coreLoggerRun');
    var remoteLoggingRequired=true;
    var offlineLogsRequired=true;

    if(remoteLoggingRequired){

        $log.setRemoteLoggingOnOff(remoteLoggingRequired);
    }

    $log.setOfflineLogsOnOff(offlineLogsRequired);

    log.log('angular.logger started');

    //anonymous logging
    $log.info('angular.logger started and logging anonymously');
}]);
