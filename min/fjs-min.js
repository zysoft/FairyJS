String.prototype.withVal=function(a){return this.replace(/%@/,a)};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(d,b){b=b?parseInt(b):0;for(var a=0,e=this.length;a<e;a++){if(a>=b&&this[a]==d){return a}}return -1}}if(!window.console){var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];window.console={};for(i in names){window.console[names[i]]=function(){}}}$$=jQuery;$$.fjsPlugin={register:function(){}};$$.fjs={config:{debugMode:false,verboseMode:false},plugins:[],init:function(){for(var a=0,d=$$.fjs.plugins.length;a<d;a++){var b=$$.fjs.plugins[a];$$.fjs[b].register();$$.fjs.log('Activated plugin "'+$$.fjs.plugins[a]+'"')}$$.fjs.log("FairyJS core intialized")},configure:function(a){$$.extend(this.config,a);return this},extendConfiguration:function(a){this.config=$$.extend({},a,this.config);return this},log:function(a){if(this.config.verboseMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.log(a)}return this},warn:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.warn(a)}return this},error:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.error(a)}return this},plugin:function(a,d,e){if(e){for(var b=0,f=e.length;b<f;b++){if($$.fjs.plugins.indexOf(e[b])==-1){if($$.fjs.config.debugMode){$$.fjs.error('FairyJS plugin "'+a+'" failed to load as it requires the following plugins to be loaded: "'+e.join('", "')+'"')}return this}}}$$.fjs[a]=$$.extend({},$$.fjsPlugin,d);$$.fjs.plugins.push(a);$$.fjs.log('Loaded plugin "'+a+'"');return this},hasPlugin:function(a){return $$.fjs.plugins.indexOf(a)!=-1},subscribe:function(a,b){$$(document).bind(a,b);$$.fjs.log('Got subscribtion to "'+a+'"')},fire:function(d){var b=[];for(var a=1,e=arguments.length;a<e;a++){b.push(arguments[a])}$$.fjs.log('Firing "'+d+'"');$$(document).trigger(d,b)}};$$($$.fjs.init);$$.fjs.plugin("dragndrop",{register:function(){if(!$$.ui){$$.fjs.warn('jQuery UI is required to run plugin "dragndrop"');return}$$.fjs.dragndrop.setDraggable();$$.fjs.dragndrop.setDroppable();$$.fn.extend({makeDraggable:function(){$$.fjs.dragndrop.setDraggable($$(this));return this},makeDroppable:function(){$$.fjs.dragndrop.setDroppable($$(this));return this}})},setDraggable:function(a){(a?a:$$("*[data-fjs-draggable]")).each(function(){var d={};var g=$$(this).attr("data-fjs-draggable");switch(g){case"window":case"parent":case"document":break;default:g=g.split(",")}d.containment=g;var e=$$(this).attr("data-fjs-draggable-cursor");if(e){d.cursor=e}var b=$$(this).attr("data-fjs-draggable-revert");var f={valid:"valid",invalid:"invalid","true":true};if(b&&f[b]){d.revert=f[b]}d.start=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.start",$$(this),i)};d.stop=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.stop",$$(this),i)};var c=$$(this).attr("data-fjs-draggable-clone");if(c){d=$$.extend(d,{opacity:0.5,helper:"clone"})}$$(this).draggable(d)})},setDroppable:function($object){($object?$object:$$("*[data-fjs-droppable]")).each(function(){var droppableArgs={};var acceptedDroppables=$$(this).attr("data-fjs-droppable").split(",");var onDropCode=$$(this).attr("data-fjs-ondrop");var activeClass=$$(this).attr("data-fjs-highlight-class");var selector='*[data-fjs-drop-to="'+acceptedDroppables.join(',*[data-fjs-drop-to="')+'"]';$$.fjs.log("Item set to accept: "+selector+". Matched items: "+$$(selector).length);droppableArgs.accept=selector;droppableArgs.drop=function($ev,$ui){$$.fjs.fire("org.fjs.dragndrop.drop",$ui.draggable,$$(this));$what=$ui.draggable;$where=$$(this);eval(onDropCode)};if(activeClass){droppableArgs.activeClass=activeClass}$$(this).droppable(droppableArgs)})},disableDragFor:function(a){a.draggable("option","disabled",true)},enableDragFor:function(a){a.draggable("option","disabled",false)},disableDropFor:function(a){a.droppable("option","disabled",true)},enableDropFor:function(a){a.droppable("option","disabled",false)}});$$.fjs.plugin("forms",{register:function(){if(!$$.fjs.hasPlugin("validate")){return}var a=function(d){$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html("");if(!$$.fjs.validate.field(d)){var c=$$.fjs.validate.fieldError(d);var b=$$.fjs.hasPlugin("lang")?$$_(c):c;$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html(b).attr("data-fjs-localizable",c);return false}return true};$$(':input[data-fjs-validate="blur"]').blur(function(){a($$(this))});$$(':input[data-fjs-validate="keypress"]').keyup(function(){a($$(this))});$$(':input[data-fjs-validate="click"]').click(function(){a($$(this))});$$("form").submit(function(){var b=true;$$(this).find(":input").each(function(){b=a($$(this))&&b});return b})}});$$.fjs.plugin("lang",{currentLang:$$.fjs.config.defaultLang,knownLangs:[],register:function(){var a=$$("html").attr("data-fjs-lang");if(!a){a=$$.fjs.config.defaultLang}if(a){this.set(a)}},set:function(b){this.currentLang=b;if(this.knownLangs.indexOf(b)!=-1){this.localizePage();return this}var a=document.createElement("SCRIPT");a.src=$$.fjs.config.langPath+$$.fjs.config.langFile.withVal(this.currentLang)+"?r="+Math.random();a.type="text/javascript";$$("head")[0].appendChild(a);return this},addEntity:function(b,a,d){var c={};c[a]=d;$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],c);$$.fjs.log("Added custom localization entity for "+b);return this},add:function(b,a){this.knownLangs.push(b);$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],a);$$.fjs.log("Registered language "+b);this.localizePage();return this},localizePage:function(){$$("*[data-fjs-localizable]").each(function(){if($$(this).is(":input")){$$(this).val($$_($$(this).attr("data-fjs-localizable")))}else{$$(this).html($$_($$(this).attr("data-fjs-localizable")))}})}});$$.fjs.extendConfiguration({langFile:"fjs_%@.js",langPath:"lang/",defaultLang:null});window.$$_=function(a){if($$.fjs.lang[$$.fjs.lang.currentLang][a]){return $$.fjs.lang[$$.fjs.lang.currentLang][a]}if($$.fjs.config.debugMode){console.warn("Unlocalized entity: "+a)}return a};$$.fjs.plugin("validate",{fieldErrors:{},register:function(){},add:function(b,c,a){a=$$.extend({},a,{error_message:""});$$.fjs.validate[b]={func:c,config:a};$$.fjs.log('Registered validator "'+b+'"');return this},field:function(k){if(!k.attr("data-fjs-required")&&$$.trim(k.val()).length==0){return true}if(k.attr("data-fjs-required")){var g=true;if(k.is(":checkbox")){g=k.is(":checked")}else{g=$$.trim(k.val()).length!=0}if(!g){this.fieldErrors[k.attr("name")]="This field is required";return false}}if(!k.attr("data-fjs-validator")){return true}var b=true;var d=k.attr("data-fjs-validator").split(",");for(var f=0,h=d.length;f<h;f++){var a=d[f];var e=this[a];if(!e){if($$.fjs.config.debugMode){$$.fjs.warn('Validator "'+a+'" is not defined')}this.fieldErrors[k.attr("name")]="Validator does not exist";b=false;return b}var l=e.config;$$.each(e.config,function(c){var i="data-fjs-"+a+"_"+c;if(k.attr(i)){l[c]=k.attr(i)}});var j=e.func(k.val(),l);if(!j){this.fieldErrors[k.attr("name")]=l.error_message?l.error_message:a}b=b&&j;if(!b){return b}}return b},fieldError:function(a){return this.fieldErrors[a.attr("name")]}});$$.fjs.validate.add("int",function(a){return parseInt(a)==a});$$.fjs.validate.add("float",function(a){return parseFloat(a)==a});$$.fjs.validate.add("regexp",function(a,b){return a.match(b.regex)!=null},{regex:/.*/});$$.fjs.validate.add("email",function(a){return a.match(/(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/gi)!=null});$$.fjs.validate.add("match_field",function(a,b){if(!b.selector){return false}return $$(b.selector).val()==a},{selector:null});