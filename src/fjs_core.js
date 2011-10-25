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

//Plugin base object for further extension
$$.fjsPlugin = {
    register: function() {
        
    }
}

//FairyJS Core object
$$.fjs = {
    //Default configuration
    config: {
          debugMode: false,         //In debug mode you can get some debugging info to console
        verboseMode: false          //Verbose mode activates "log" level output
    },
    //List of registered plugins
    plugins:[],
    //Initializes the core and plugins. Called on page load
    init: function() {
        for (var i=0,c=$$.fjs.plugins.length; i<c; i++) {
            var plugin = $$.fjs.plugins[i];
            $$.fjs[plugin].register();
            $$.fjs.log('Activated plugin "'+$$.fjs.plugins[i]+'"');
        }
        $$.fjs.log('FairyJS core intialized');
    },
    //Sets configuration options for the core
    configure: function(newConfig) {
        $$.extend(this.config, newConfig);
        return this;
    },
    //Method to allow extending configuration from plugins
    extendConfiguration: function(config) {
        this.config = $$.extend({}, config, this.config);
        return this;
    },
    //Logs message according to verboseMode setting
    //@see $$.fjs.config.verboseMode
    log: function(message) {
        if (this.config.verboseMode)
            console.log('['+new Date().toString('YYYY-mm-dd')+'] '+message);
        return this;
    },
    //Outputs warning according to debugMode setting
    //@see $$.fjs.config.debugMode
    warn: function() {
        if (this.config.debugMode)
            console.warn('['+new Date()+'] '+message);
        return this;
    },
    //Outputs error according to debugMode setting
    //@see $$.fjs.config.debugMode
    error: function() {
        if (this.config.debugMode)
            console.error('['+new Date()+'] '+message);
        return this;
    },
    //Registers plugin
    plugin: function(name, definition, requiredPlugins) {
        //If plugin has requirements
        if (requiredPlugins) {
            //Check if ALL required plugins loaded
            for (var i=0,c=requiredPlugins.length; i<c; i++) {
                if ($$.fjs.plugins.indexOf(requiredPlugins[i]) == -1) {
                    if ($$.fjs.config.debugMode)
                        $$.fjs.error('FairyJS plugin "'+name+'" failed to load as it requires the following plugins to be loaded: "'+requiredPlugins.join('", "')+'"');
                    return this;
                }
            }
        }
        //Register plugin
        $$.fjs[name] = $$.extend({}, $$.fjsPlugin, definition);
        $$.fjs.plugins.push(name);
        $$.fjs.log('Loaded plugin "'+name+'"');
        return this;
    },
    //Checks if plugin with given name is registered and available
    hasPlugin: function(name) {
        return $$.fjs.plugins.indexOf(name) != -1;
    }
};

//Attach handler for page onLoad
$$($$.fjs.init);
