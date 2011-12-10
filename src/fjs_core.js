/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Copyright (C) 2011  Yuriy Zisin

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>    
 @licend  The above is the entire license notice for the JavaScript code in this page.
*/



//Returns string with next placeholder replaced to value
//Example: ("Some string with number %@ !").withVal(10) will produce "Some string with number 10 !"
//Can also be used in one-line: str.withVal(10).withVal('some')
String.prototype.withVal = function(value) {
    return this.replace(/%@/, value);
}

//Extends Array prototype to add indexOf method
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(value, fromIndex) {
        fromIndex = fromIndex ? parseInt(fromIndex) : 0;
        for (var i=0,c=this.length;i<c;i++) {
            if (i>=fromIndex && this[i] == value)
                return i;
        }
        return -1;
    }
}

/**
 * Make sure that Console.method()'s don't trigger errors
 * without firebug in major browsers
 * that don't have 'console' property
 */
if (!window.console) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir",
    "dirxml", "group", "groupEnd", "time", "timeEnd", "count",
    "trace", "profile", "profileEnd"];
    window.console = {};
    for (i in names) {
        window.console[names[i]] = function() {};
    }
}

//Alias for shorthand
$$=jQuery;

/**
 * FairyJS Core object
 */
$$.fjs = {
    //Default configuration
    config: {
        debugMode: false,         //In debug mode you can get some debugging info to console
        verboseMode: false          //Verbose mode activates "log" level output
    },
    /**
     * Initializes the core and plugins. Called on page load
     */
    init: function() {
        for (var i in $$.fjs) {
            if (typeof($$.fjs[i]) == 'object' && $$.fjs[i].register && typeof($$.fjs[i].register) == 'function') {
                var okToInit = true;
                if ($$.fjs[i].requires && typeof($$.fjs[i].requires) == 'object') {
                    for (var p=0,c=$$.fjs[i].requires.length, r=$$.fjs[i].requires; p<c; p++) {
                        if (!$$.fjs[r[p]]) {
                            $$.fjs.error('FairyJS plugin "'+i+'" requires plugin "'+r[p]+'" which is not loaded');
                            okToInit = false;
                        }
                    }
                }
                if (okToInit) {
                    $$.fjs[i].register();
                    $.fjs.log('Activated plugin "'+i+'"');
                } else {
                    $.fjs.error('Plugin "'+i+'" falied to intialize due to missing dependencies');
                }
            }
        }
        $$.fjs.log('FairyJS core intialized');
    },
    /**
     * Sets configuration options for the core
     * 
     * @param {Object}  newConfig  Configuration options to override
     * 
     * @return {Object} $$.fjs
     */
    configure: function(newConfig) {
        $$.extend(this.config, newConfig);
        return this;
    },
    /**
     * Method to allow extending configuration from plugins
     * 
     * @param {Object}  config  Configuration options to add to the main config
     * 
     * @return {Object} $$.fjs
     */
    extendConfiguration: function(config) {
        this.config = $$.extend({}, config, this.config);
        return this;
    },
    /** 
     * Logs message according to verboseMode setting
     * 
     * @see $$.fjs.config.verboseMode
     * 
     * @param {String|Object} message  Message/Data to log
     * 
     * @return {Object} $$.fjs
     */
    log: function(message) {
        if (this.config.verboseMode) {
            if (typeof(message) == 'string')
                message = '['+new Date()+'] '+message;
            console.log(message);
        }
        return this;
    },
    /**
     * Outputs warning according to debugMode setting
     * 
     * @see $$.fjs.config.debugMode
     * 
     * @param {String|Object} message  Message/Data to log
     * 
     * @return {Object} $$.fjs
     */
    warn: function(message) {
        if (this.config.debugMode) {
            if (typeof(message) == 'string')
                message = '['+new Date()+'] '+message;
            console.warn(message);
        }
        return this;
    },
    /**
     * Outputs error according to debugMode setting
     * 
     * @see $$.fjs.config.debugMode
     * 
     * @param {String|Object} message  Message/Data to log
     * 
     * @return {Object} $$.fjs
     */
    error: function(message) {
        if (this.config.debugMode) {
            if (typeof(message) == 'string')
                message = '['+new Date()+'] '+message;
            console.error(message);
        }
        return this;
    },
    /**
     * Checks if plugin with given name is registered and available
     * 
     * @return {boolean} True if plugin is defined, false otherwise
     */
    hasPlugin: function(name) {
        return typeof($$.fjs[name]) == 'object';
    },
    /**
     * Subscribes handler to an event
     *
     * @param {String}   event     Event name
     * @param {function} callback  Handler function
     * 
     * @return {Object} $$.fjs
     */
    subscribe: function(event, callback) {
        $$(document).bind(event, callback);
        $$.fjs.log('Got subscribtion to "'+event+'"');
        return this;
    },
    /**
     * Unsubscribes handler from an event
     *
     * @param {String}   event     Event name
     * @param {function} callback  Handler function
     * 
     * @return {Object} $$.fjs
     */
    unsubscribe: function(event, callback) {
        $$(document).unbind(event, callback);
        $$.fjs.log('Removed subscribtion to "'+event+'"');
    },
    /**
     * Fires event with params
     *
     * @param {String} event   Event name
     * @param {...*} [args]    List of parameters to pass to handler
     * 
     * @return {Object} $$.fjs
     */
    fire: function(event) {
        var fireArgs = [];
        for (var i=1,c=arguments.length; i<c; i++)
            fireArgs.push(arguments[i]);
        $$.fjs.log('Firing "'+event+'"');
        $$(document).trigger(event, fireArgs);
    }
};

//Attach handler for page onLoad
$$($$.fjs.init);
