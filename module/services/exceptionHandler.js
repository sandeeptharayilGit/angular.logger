'use strict';

/**
 * Exception Logging Service, currently only used by the $exceptionHandler
 * it preserves the default behaviour ( logging to the console) but 
 * also posts the error server side after generating a stacktrace.
 */
 loggerModule.factory("remoteExceptionLoggingService",["$log","$window", 
    function remoteExceptionLoggingService($log, $window){
        var  log= $log.getInstance('remoteExceptionLoggingService');
        function error(exception, cause){

        // preserve the default behaviour which will log the error
        // to the console, and allow the application to continue running.
       

        // now try to log the error to the server side.
        try{
            var errorMessage = exception.toString();
            
            // use our traceService to generate a stack trace
            var stackTrace = exception.stack;
            
            var errorData={data:{
                url: $window.location.href,
                message: errorMessage,
                type: "exception",
                stackTrace: stackTrace,
                cause: ( cause || "")
            }};
            log.error(errorData); 

        } catch (loggingError){
            log.warn("Error server-side logging failed");
            log.error(loggingError);
        }
    }
    return(error);
}]);

/**
 * Override Angular's built in exception handler, and tell it to 
 * use our new exceptionLoggingService which is defined below
 */
 loggerModule.provider("$exceptionHandler",{
    $get: function exceptionHandler(remoteExceptionLoggingService){
        return(remoteExceptionLoggingService);
    }
});
