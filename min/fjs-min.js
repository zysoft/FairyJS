String.prototype.withVal=function(a){return this.replace(/%@/,a)};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(d,b){b=b?parseInt(b):0;for(var a=0,e=this.length;a<e;a++){if(a>=b&&this[a]==d){return a}}return -1}}if(!window.console){var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];window.console={};for(i in names){window.console[names[i]]=function(){}}}$$=jQuery;$$.fjs={config:{debugMode:false,verboseMode:false},init:function(){for(var b in $$.fjs){if(typeof($$.fjs[b])=="object"&&$$.fjs[b].register&&typeof($$.fjs[b].register)=="function"){var a=true;if($$.fjs[b].requires&&typeof($$.fjs[b].requires)=="object"){for(var e=0,f=$$.fjs[b].requires.length,d=$$.fjs[b].requires;e<f;e++){if(!$$.fjs[d[e]]){$$.fjs.error('FairyJS plugin "'+b+'" requires plugin "'+d[e]+'" which is not loaded');a=false}}}if(a){$$.fjs[b].register();$.fjs.log('Activated plugin "'+b+'"')}else{$.fjs.error('Plugin "'+b+'" falied to intialize due to missing dependencies')}}}$$.fjs.log("FairyJS core intialized")},configure:function(a){$$.extend(this.config,a);return this},extendConfiguration:function(a){this.config=$$.extend({},a,this.config);return this},log:function(a){if(this.config.verboseMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.log(a)}return this},warn:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.warn(a)}return this},error:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.error(a)}return this},hasPlugin:function(a){return typeof($$.fjs[a])=="object"},subscribe:function(a,b){$$(document).bind(a,b);$$.fjs.log('Got subscribtion to "'+a+'"');return this},unsubscribe:function(a,b){$$(document).unbind(a,b);$$.fjs.log('Removed subscribtion to "'+a+'"')},fire:function(d){var b=[];for(var a=1,e=arguments.length;a<e;a++){b.push(arguments[a])}$$.fjs.log('Firing "'+d+'"');$$(document).trigger(d,b)}};$$($$.fjs.init);$$.fjs.dragndrop={register:function(){if(!$$.ui){$$.fjs.warn('jQuery UI is required to run plugin "dragndrop"');return}$$.fjs.dragndrop.setDraggable();$$.fjs.dragndrop.setDroppable();$$.fn.extend({makeDraggable:function(){$$.fjs.dragndrop.setDraggable($$(this));return this},makeDroppable:function(){$$.fjs.dragndrop.setDroppable($$(this));return this}})},setDraggable:function(a){(a?a:$$("*[data-fjs-draggable]")).each(function(){var d={};var g=$$(this).attr("data-fjs-draggable");switch(g){case"window":case"parent":case"document":break;default:g=g.split(",")}d.containment=g;var e=$$(this).attr("data-fjs-draggable-cursor");if(e){d.cursor=e}var b=$$(this).attr("data-fjs-draggable-revert");var f={valid:"valid",invalid:"invalid","true":true};if(b&&f[b]){d.revert=f[b]}d.start=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.start",$$(this),i)};d.stop=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.stop",$$(this),i)};var c=$$(this).attr("data-fjs-draggable-clone");if(c){d=$$.extend(d,{opacity:0.5,helper:"clone"})}$$(this).draggable(d)});return this},setDroppable:function($object){($object?$object:$$("*[data-fjs-droppable]")).each(function(){var droppableArgs={};var acceptedDroppables=$$(this).attr("data-fjs-droppable").split(",");var onDropCode=$$(this).attr("data-fjs-ondrop");var activeClass=$$(this).attr("data-fjs-highlight-class");var selector='*[data-fjs-drop-to="'+acceptedDroppables.join(',*[data-fjs-drop-to="')+'"]';$$.fjs.log("Item set to accept: "+selector+". Matched items: "+$$(selector).length);droppableArgs.accept=selector;droppableArgs.drop=function($ev,$ui){$$.fjs.fire("org.fjs.dragndrop.drop",$ui.draggable,$$(this));$what=$ui.draggable;$where=$$(this);eval(onDropCode)};if(activeClass){droppableArgs.activeClass=activeClass}$$(this).droppable(droppableArgs)});return this},disableDragFor:function(a){a.draggable("option","disabled",true)},enableDragFor:function(a){a.draggable("option","disabled",false)},disableDropFor:function(a){a.droppable("option","disabled",true)},enableDropFor:function(a){a.droppable("option","disabled",false)}};$$.fjs.facebook={register:function(){if($$("html").attr("data-fjs-fb-appid")){this.userLoggedIn=false,this.userId=null,$$('<div id="fb-root"></div>').prependTo("body");var b,c="facebook-jssdk";if(document.getElementById(c)){return}b=document.createElement("script");b.id=c;b.async=true;var a="";if(document.location.protocol=="file:"){a="http:"}b.src=a+"//connect.facebook.net/en_US/all.js";document.getElementsByTagName("head")[0].appendChild(b);$$("*[data-fjs-fb-login]").live("click",function(){$$.fjs.facebook.login($$(this).attr("data-fjs-fb-login"));return false});$$("*[data-fjs-fb-feed-link]").live("click",function(){var d=$$(this);$$.fjs.facebook.publish(d.attr("data-fjs-fb-feed-link"),d.attr("data-fjs-fb-feed-name"),d.attr("data-fjs-fb-feed-picture"),d.attr("data-fjs-fb-feed-caption"),d.attr("data-fjs-fb-feed-description"));return false});$$("*[data-fjs-fb-apprequest-message]").live("click",function(){$$.fjs.facebook.sendAppRequest($$(this).attr("data-fjs-fb-apprequest-message"),$$(this).attr("data-fjs-fb-apprequest-to"),$$(this).attr("data-fjs-fb-apprequest-filter"),$$(this).attr("data-fjs-fb-apprequest-exclude"),$$(this).attr("data-fjs-fb-apprequest-max"),$$(this).attr("data-fjs-fb-apprequest-data"),$$(this).attr("data-fjs-fb-apprequest-title"));return false})}},isLoggedIn:function(){return this.userLoggedIn},getUserId:function(){return this.userId},requestProfile:function(a){if(!this.userLoggedIn){return this}var b="/me";if(a){b="/"+a}FB.api(b,function(c){$$.fjs.fire("org.fjs.facebook.profile_request.complete",c)});return this},login:function(a){if(a=="basic"){a=""}FB.login(function(b){$$.fjs.facebook.userLoggedIn=b.authResponse?true:false;if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=b.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,true)},{scope:a});return this},publish:function(d,b,e,a,c){FB.ui({method:"feed",name:b,link:d,picture:e,caption:a,description:c},function(f){if(f&&f.post_id){$$.fjs.fire("org.fjs.facebook.publish.complete",true,f.post_id)}else{$$.fjs.fire("org.fjs.facebook.publish.complete",false,null)}});return this},sendAppRequest:function(d,h,c,a,b,e,g){var f={message:d,data:e};if(c){f.filters=c.split(",")}if(h){f.to=h.split(",")}if(a){f.exclude_ids=a.split(",")}if(g){f.title=g}if(b){f.max_recipients=parseInt(b)}this.sendAdvancedAppRequest(f)},sendAdvancedAppRequest:function(a){a.method="apprequests";FB.ui(a,function(b){$$.fjs.fire("org.fjs.facebook.apprequest.complete",b)});return this}};window.fbAsyncInit=function(){var a=$$("html");var b={appId:$$("html").attr("data-fjs-fb-appid"),status:true,cookie:true,oauth:true,xfbml:true};if(a.attr("data-fjs-appid-xd")&&$$.browser.msie&&$$.browser.version>=8&&$$.browser.version<=9){b.channelUrl=a.attr("data-fjs-fb-xd")}$$.fjs.log("Facebook intialization parameters:");$$.fjs.log(b);FB._https=window.location.protocol=="https:";FB.init(b);FB.UIServer.setLoadedNode=function(d,c){FB.UIServer._loadedNodes[d.id]=c};if(a.attr("data-fjs-fb-autosize")){FB.Canvas.setAutoGrow()}this.userLoggedIn=false;FB.getLoginStatus(function(c){$$.fjs.facebook.userLoggedIn=c.status=="connected";if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=c.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,false)})};$$.fjs.forms={register:function(){if(!$$.fjs.hasPlugin("validate")){return}var a=function(d){$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html("");if(!$$.fjs.validate.field(d)){var c=$$.fjs.validate.fieldError(d);var b=$$.fjs.hasPlugin("lang")?$$_(c):c;$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html(b).attr("data-fjs-localizable",c);return false}return true};$$(':input[data-fjs-validate="blur"]').blur(function(){a($$(this))});$$(':input[data-fjs-validate="keypress"]').keyup(function(){a($$(this))});$$(':input[data-fjs-validate="click"]').click(function(){a($$(this))});$$("form").submit(function(){var c=true;var b=$$(this);$$("*[data-fjs-error_for]").html("");b.find(":input").each(function(){c=a($$(this))&&c});if(c&&b.attr("data-fjs-form-ajax")){$$.fjs.forms.ajaxSubmit(b);return false}return c})},ajaxSubmit:function(a){var d=a.attr("method");var c=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.success",e,f)}}(a);var b=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.error",e,f)}}(a);$.ajax({url:a.attr("action"),type:d?d:"get",data:a.serialize(),success:c,error:b});return this}};$$.fjs.lang={currentLang:$$.fjs.config.defaultLang,knownLangs:[],register:function(){var a=$$("html").attr("data-fjs-lang");if(!a){a=$$.fjs.config.defaultLang}if(a){this.set(a)}},set:function(b){this.currentLang=b;if(this.knownLangs.indexOf(b)!=-1){this.localizePage();return this}var a=document.createElement("SCRIPT");a.src=$$.fjs.config.langPath+$$.fjs.config.langFile.withVal(this.currentLang)+"?r="+Math.random();a.type="text/javascript";$$("head")[0].appendChild(a);return this},addEntity:function(b,a,d){var c={};c[a]=d;$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],c);$$.fjs.log("Added custom localization entity for "+b);return this},add:function(b,a){this.knownLangs.push(b);$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],a);$$.fjs.log("Registered language "+b);this.localizePage();return this},localizePage:function(){$$("*[data-fjs-localizable]").each(function(){if($$(this).is(":input")){$$(this).val($$_($$(this).attr("data-fjs-localizable")))}else{$$(this).html($$_($$(this).attr("data-fjs-localizable")))}})}};$$.fjs.extendConfiguration({langFile:"fjs_%@.js",langPath:"lang/",defaultLang:null});window.$$_=function(a){if($$.fjs.lang[$$.fjs.lang.currentLang][a]){return $$.fjs.lang[$$.fjs.lang.currentLang][a]}if($$.fjs.config.debugMode){console.warn("Unlocalized entity: "+a)}return a};$$.fjs.validate={requires:["forms"],register:function(){this.fieldErrors={}},add:function(b,c,a){a=$$.extend({},a,{error_message:""});$$.fjs.validate[b]={func:c,config:a};$$.fjs.log('Registered validator "'+b+'"');return this},field:function(k){if(!k.attr("data-fjs-required")&&$$.trim(k.val()).length==0){return true}if(k.attr("data-fjs-required")){var g=true;if(k.is(":checkbox")){g=k.is(":checked")}else{g=$$.trim(k.val()).length!=0}if(!g){this.fieldErrors[k.attr("name")]="This field is required";return false}}if(!k.attr("data-fjs-validator")){return true}var b=true;var d=k.attr("data-fjs-validator").split(",");for(var f=0,h=d.length;f<h;f++){var a=d[f];var e=this[a];if(!e){if($$.fjs.config.debugMode){$$.fjs.warn('Validator "'+a+'" is not defined')}this.fieldErrors[k.attr("name")]="Validator does not exist";b=false;return b}var l=e.config;$$.each(e.config,function(c){var i="data-fjs-"+a+"_"+c;if(k.attr(i)){l[c]=k.attr(i)}});var j=e.func(k.val(),l);if(!j){this.fieldErrors[k.attr("name")]=l.error_message?l.error_message:a}b=b&&j;if(!b){return b}}return b},fieldError:function(a){return this.fieldErrors[a.attr("name")]}};$$.fjs.validate.add("int",function(a){return parseInt(a)==a});$$.fjs.validate.add("float",function(a){return parseFloat(a)==a});$$.fjs.validate.add("regexp",function(a,b){return new RegExp(b.regex).test(a)},{regex:/.*/});$$.fjs.validate.add("email",function(b){var a=/(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/gi;return a.test(b)});$$.fjs.validate.add("match_field",function(a,b){if(!b.selector){return false}return $$(b.selector).val()==a},{selector:null});