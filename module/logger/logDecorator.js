var pushLogData=function pushRemoteData(data){
    $.ajax({
        type: "POST",
        url: "/log", 
        contentType: "application/json",
        data: {logData:data}
    });
},
enchanceLogger = function enchanceLogger( $log ){
    /**
    * Capture the original $log functions; for use in enhancedLogFn()
    */
    var offlineLogs=[],
    offlineRequired=false,
    remoteLoggingRequired=false,
    _$log = (function( $log ){
        return {
            log   : $log.log,
            info  : $log.info,
            warn  : $log.warn,
            debug : $log.debug,
            error : $log.error
        };
    })( $log ),
    setOfflineLogsOnOff=function setOfflineLogsOnOff(flag){
        offlineRequired=flag;
    },
    setRemoteLoggingOnOff=function setRemoteLoggingOnOff(flag){
        remoteLoggingRequired=flag;
    },
        /**
         * Partial application to pre-capture a logger function
         */
         prepareLogFn = function prepareLogFn( property, className,privateLogFn ){
            var logFn= (privateLogFn&&privateLogFn[property] )||$log[property];
            /**
             * Invoke the specified `logFn` with the supplant functionality...
             */
             var enhancedLogFn = function enhancedLogFn(){
                var args = Array.prototype.slice.call(arguments),
                now  = new Date().toLocaleTimeString();
                args[0] =supplant(" - {0}{1}", [(className||'[anonymous]-'), (typeof args[0]=="object"?angular.toJson(args[0],true):args[0]) ]);
                
                if(remoteLoggingRequired){
                     pushLogData(angular.toJson({dataArr:new Array({mode:property,data:args.join()})}));
                }

                // prepend a timestamp and optional classname to the original output message
                args[0] = supplant("{0}{1}", [ now, (typeof args[0]=="object"?angular.toJson(args[0],true):args[0]) ]);
                var logText=args.join()
                logFn.call( null, logText );
                if(offlineRequired){
                    offlineLogs.push(logText);
                }
            };

            // Special... only needed to support angular-mocks expectations
            enhancedLogFn.logs = [];

            return enhancedLogFn;
        },
        /**
        * Support to generate class-specific logger instance with classname only
        *
        * @param name
        * @returns Object wrapper facade to $log
        */
        getInstance = function getInstance( className ){
            className = ( className !== undefined ) ? "["+className + "]-" : "[anonymous]-";
            return {
                log   : prepareLogFn( 'log',    className,_$log ),
                info  : prepareLogFn( 'info',   className ,_$log ),
                warn  : prepareLogFn( 'warn',   className ,_$log ),
                debug : prepareLogFn( 'debug',  className ,_$log ),
                error : prepareLogFn( 'error',  className ,_$log ),
            };
        };

        $log.log   = prepareLogFn( 'log' );
        $log.info  = prepareLogFn( 'info' );
        $log.warn  = prepareLogFn( 'warn' );
        $log.debug = prepareLogFn( 'debug' );
        $log.error = prepareLogFn( 'error' );

    // Add special methods to AngularJS $log
    $log.getInstance = getInstance;
    $log.getLogs=function(){return offlineLogs;};
    $log.setOfflineLogsOnOff=setOfflineLogsOnOff;
    $log.setRemoteLoggingOnOff=setRemoteLoggingOnOff;


    return $log;
},
LogDecorator = function LogDecorator( $provide ){

    // Register our $log decorator with AngularJS $provider
    $provide.decorator( '$log', [ "$delegate", function( $delegate ){

      // NOTE: the LogEnchancer module returns a FUNCTION that we named `enchanceLogger`
      //       All the details of how the `enchancement` works is encapsulated in LogEnhancer!

      enchanceLogger( $delegate );
      return $delegate;
  }]);
};