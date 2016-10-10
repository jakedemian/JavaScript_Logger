/*
	Basic JavaScript logging logic.

	In order for this to work, it is expected that somewhere in the DOM there is a div with id = "logger-config", 
	containing a logger configuration json in the following format:

	{
		"SOME_PACKAGE_NAME" : "LOG",
		"ANOTHER_PACKAGE" : "ERROR",
		"THIRD_PACKAGE" : "TRACE"
	}
*/

var logger = {
	LEVEL : {"LOG":0, "TRACE":1, "INFO":2, "WARN":3, "ERROR":4},
	currentLogLevel : {}, //defaults to an empty object

	log : function(level, package, message){
		level = level.toUpperCase();
		if(this.shouldLog(level, package)){
			var logLevelValue = this.LEVEL[level];
			if(!!logLevelValue){
				if(logLevelValue == this.LEVEL.LOG){
					console.log(package + " : " + message);
				}
				else if(logLevelValue == this.LEVEL.TRACE){
					console.trace(package + " : " + message);
				}
				else if(logLevelValue == this.LEVEL.INFO){
					console.info(package + " : " + message);
				}
				else if(logLevelValue == this.LEVEL.WARN){
					console.warn(package + " : " + message);
				}
				else if(logLevelValue == this.LEVEL.ERROR){
					console.error(package + " : " + message);
				}
			}
			else {
				console.error(package + " : Unrecognized level '" + level + "'.");
			}
		}
	},

	isLoggable : function(level, package){
		level = level.toUpperCase();
		package = package.toUpperCase();

		if(this.LEVEL[level] >= this.getCurrentLogLevelConfiguration(package)){
			return true;
		}
		return false;
	},

	getCurrentLogLevelConfiguration : function(package){
		package = package.toUpperCase();
		if(!!this.currentLogLevel && !!this.currentLogLevel[package]){
			return this.LEVEL[this.currentLogLevel[package]];
		}
		else {
			this.log(this.LEVEL.WARN, package, "The package '" + package + "' is not set in the log level configuration.  Defaulting to a log level of 'WARN'.");
		}
		return this.LEVEL.WARN;
	}
}

window.onload = function(){
	if(!!document.getElementById("logger-config")){
		var jsonStr = document.getElementById("logger-config").innerHTML;
		if(!!jsonStr){
			try{
				var json = JSON.parse(jsonStr);
				logger.currentLogLevel = json;
			}
			catch(e){
				console.error("An error occurred when attempting to parse the logging configuration JSON : " + e);
			}
		}
		else{
			console.error("Logging configuration object was either null, empty, or blank.")
		}
	}
	else{
		console.error("Failed to locate logging configuration for logger for logger.js");
	}
}
