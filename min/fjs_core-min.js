/* FairyJS zysoft.github.com/FairyJS | github.com/zysoft/FairyJS/blob/master/LICENSE */
String.prototype.withVal=function(a){$$.fjs.warn("String.prototype.withVal is obsolete. Please consider using String.prototype.withVals");return this.replace(/%@/,a)};String.prototype.withVals=function(){var a=this;for(var b=0,d=arguments.length;b<d;b++){a=a.replace(RegExp("%"+(b+1),"g"),arguments[b])}return a};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(d,b){b=b?parseInt(b):0;for(var a=0,e=this.length;a<e;a++){if(a>=b&&this[a]==d){return a}}return -1}}if(!window.console){var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];window.console={};for(i in names){window.console[names[i]]=function(){}}}$$=jQuery;$$.fjs={config:{debugMode:false,verboseMode:false},init:function(){for(var b in $$.fjs){if(typeof($$.fjs[b])=="object"&&$$.fjs[b].register&&typeof($$.fjs[b].register)=="function"){var a=true;if($$.fjs[b].requires&&typeof($$.fjs[b].requires)=="object"){for(var e=0,f=$$.fjs[b].requires.length,d=$$.fjs[b].requires;e<f;e++){if(!$$.fjs[d[e]]){$$.fjs.error('FairyJS plugin "'+b+'" requires plugin "'+d[e]+'" which is not loaded');a=false}}}if(a){$$.fjs[b].register();$$.fjs.log('Activated plugin "'+b+'"')}else{$$.fjs.error('Plugin "'+b+'" falied to intialize due to missing dependencies')}}}$$.fjs.log("FairyJS core intialized")},configure:function(a){$$.extend(this.config,a);return this},extendConfiguration:function(a){this.config=$$.extend({},a,this.config);return this},log:function(a){if(this.config.verboseMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.log(a)}return this},warn:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.warn(a)}return this},error:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.error(a)}return this},hasPlugin:function(a){return typeof($$.fjs[a])=="object"},subscribe:function(a,b){$$(document).on(a,b);$$.fjs.log('Got subscribtion to "'+a+'"');return this},unsubscribe:function(a,b){$$(document).off(a,b);$$.fjs.log('Removed subscribtion to "'+a+'"');return this},fire:function(d){var b=[];for(var a=1,e=arguments.length;a<e;a++){b.push(arguments[a])}$$.fjs.log('Firing "'+d+'"');$$(document).trigger(d,b);return this}};var jqVersion=$$.fn.jquery.split(".");jqVersion=parseFloat(jqVersion[0]+"."+jqVersion[1]);if(jqVersion<1.7){console.error("jQuery 1.7+ required for FairyJS to work, but you have "+$$.fn.jquery+" version loaded. Please upgrade.")}else{$$($$.fjs.init)};