/* FairyJS zysoft.github.com/FairyJS | github.com/zysoft/FairyJS/blob/master/LICENSE */
String.prototype.withVal=function(a){$$.fjs.warn("String.prototype.withVal is obsolete. Please consider using String.prototype.withVals");return this.replace(/%@/,a)};String.prototype.withVals=function(){var a=this;for(var b=0,d=arguments.length;b<d;b++){a=a.replace(RegExp("%"+(b+1),"g"),arguments[b])}return a};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(d,b){b=b?parseInt(b):0;for(var a=0,e=this.length;a<e;a++){if(a>=b&&this[a]==d){return a}}return -1}}if(!window.console){var names=["log","debug","info","warn","error","assert","dir","dirxml","group","groupEnd","time","timeEnd","count","trace","profile","profileEnd"];window.console={};for(i in names){window.console[names[i]]=function(){}}}$$=jQuery;$$.fjs={config:{debugMode:false,verboseMode:false},init:function(){for(var b in $$.fjs){if(typeof($$.fjs[b])=="object"&&$$.fjs[b].register&&typeof($$.fjs[b].register)=="function"){var a=true;if($$.fjs[b].requires&&typeof($$.fjs[b].requires)=="object"){for(var e=0,f=$$.fjs[b].requires.length,d=$$.fjs[b].requires;e<f;e++){if(!$$.fjs[d[e]]){$$.fjs.error('FairyJS plugin "'+b+'" requires plugin "'+d[e]+'" which is not loaded');a=false}}}if(a){$$.fjs[b].register();$$.fjs.log('Activated plugin "'+b+'"')}else{$$.fjs.error('Plugin "'+b+'" falied to intialize due to missing dependencies')}}}$$.fjs.log("FairyJS core intialized")},configure:function(a){$$.extend(this.config,a);return this},extendConfiguration:function(a){this.config=$$.extend({},a,this.config);return this},log:function(a){if(this.config.verboseMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.log(a)}return this},warn:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.warn(a)}return this},error:function(a){if(this.config.debugMode){if(typeof(a)=="string"){a="["+new Date()+"] "+a}console.error(a)}return this},hasPlugin:function(a){return typeof($$.fjs[a])=="object"},subscribe:function(a,b){$$(document).on(a,b);$$.fjs.log('Got subscribtion to "'+a+'"');return this},unsubscribe:function(a,b){$$(document).off(a,b);$$.fjs.log('Removed subscribtion to "'+a+'"');return this},fire:function(d){var b=[];for(var a=1,e=arguments.length;a<e;a++){b.push(arguments[a])}$$.fjs.log('Firing "'+d+'"');$$(document).trigger(d,b);return this}};var jqVersion=$$.fn.jquery.split(".");jqVersion=parseFloat(jqVersion[0]+"."+jqVersion[1]);if(jqVersion<1.7){console.error("jQuery 1.7+ required for FairyJS to work, but you have "+$$.fn.jquery+" version loaded. Please upgrade.")}else{$$($$.fjs.init)};$$.fjs.dragndrop={register:function(){if(!$$.ui){$$.fjs.warn('jQuery UI is required to run plugin "dragndrop"');return}$$.fjs.dragndrop.setDraggable();$$.fjs.dragndrop.setDroppable();$$.fn.extend({makeDraggable:function(){$$.fjs.dragndrop.setDraggable($$(this));return this},makeDroppable:function(){$$.fjs.dragndrop.setDroppable($$(this));return this}})},setDraggable:function(a){(a?a:$$("*[data-fjs-draggable]")).each(function(){var d={};var g=$$(this).attr("data-fjs-draggable");switch(g){case"window":case"parent":case"document":break;default:g=g.split(",")}d.containment=g;var e=$$(this).attr("data-fjs-draggable-cursor");if(e){d.cursor=e}var b=$$(this).attr("data-fjs-draggable-revert");var f={valid:"valid",invalid:"invalid","true":true};if(b&&f[b]){d.revert=f[b]}d.start=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.start",$$(this),i)};d.stop=function(h,i){$$.fjs.fire("org.fjs.dragndrop.drag.stop",$$(this),i)};var c=$$(this).attr("data-fjs-draggable-clone");if(c){d=$$.extend(d,{opacity:0.5,helper:"clone"})}$$(this).draggable(d)});return this},setDroppable:function($object){($object?$object:$$("*[data-fjs-droppable]")).each(function(){var droppableArgs={};var acceptedDroppables=$$(this).attr("data-fjs-droppable").split(",");var onDropCode=$$(this).attr("data-fjs-ondrop");var activeClass=$$(this).attr("data-fjs-highlight-class");var selector='*[data-fjs-drop-to="'+acceptedDroppables.join(',*[data-fjs-drop-to="')+'"]';$$.fjs.log("Item set to accept: "+selector+". Matched items: "+$$(selector).length);droppableArgs.accept=selector;droppableArgs.drop=function($ev,$ui){$$.fjs.fire("org.fjs.dragndrop.drop",$ui.draggable,$$(this));$what=$ui.draggable;$where=$$(this);eval(onDropCode)};if(activeClass){droppableArgs.activeClass=activeClass}$$(this).droppable(droppableArgs)});return this},disableDragFor:function(a){a.draggable("option","disabled",true);return this},enableDragFor:function(a){a.draggable("option","disabled",false);return this},disableDropFor:function(a){a.droppable("option","disabled",true);return this},enableDropFor:function(a){a.droppable("option","disabled",false);return this}};$$.fjs.facebook={register:function(){if($$("html").attr("data-fjs-fb-appid")){this.userLoggedIn=false,this.userId=null,$$('<div id="fb-root"></div>').prependTo("body");var c,d="facebook-jssdk";if(document.getElementById(d)){return}c=document.createElement("script");c.id=d;c.async=true;var b="";if(document.location.protocol=="file:"){b="http:"}var a=$$("html").attr("data-fjs-fb-lang");c.src=b+"//connect.facebook.net/"+(a?a:"en_US")+"/all.js";document.getElementsByTagName("head")[0].appendChild(c);$$(document).on("click","*[data-fjs-fb-login]",function(){$$.fjs.facebook.login($$(this).attr("data-fjs-fb-login"));return false});$$(document).on("click","*[data-fjs-fb-feed-link]",function(){var e=$$(this);$$.fjs.facebook.publish(e.attr("data-fjs-fb-feed-link"),e.attr("data-fjs-fb-feed-name"),e.attr("data-fjs-fb-feed-picture"),e.attr("data-fjs-fb-feed-caption"),e.attr("data-fjs-fb-feed-description"));return false});$$(document).on("click","*[data-fjs-fb-apprequest-message]",function(){$$.fjs.facebook.sendAppRequest($$(this).attr("data-fjs-fb-apprequest-message"),$$(this).attr("data-fjs-fb-apprequest-to"),$$(this).attr("data-fjs-fb-apprequest-filter"),$$(this).attr("data-fjs-fb-apprequest-exclude"),$$(this).attr("data-fjs-fb-apprequest-max"),$$(this).attr("data-fjs-fb-apprequest-data"),$$(this).attr("data-fjs-fb-apprequest-title"));return false})}},isLoggedIn:function(){return this.userLoggedIn},getUserId:function(){return this.userId},requestProfile:function(a){if(!this.userLoggedIn){return this}var b="/me";if(a){b="/"+a}FB.api(b,function(c){$$.fjs.fire("org.fjs.facebook.profile_request.complete",c)});return this},login:function(a){if(a=="basic"){a=""}FB.login(function(b){$$.fjs.facebook.userLoggedIn=b.authResponse?true:false;if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=b.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,true)},{scope:a});return this},publish:function(d,b,e,a,c){if($$.trim(d).length==0){d=document.location.href}FB.ui({method:"feed",name:b,link:d,picture:e,caption:a,description:c},function(f){if(f&&f.post_id){$$.fjs.fire("org.fjs.facebook.publish.complete",true,f.post_id)}else{$$.fjs.fire("org.fjs.facebook.publish.complete",false,null)}});return this},sendAppRequest:function(d,h,c,a,b,e,g){var f={message:d,data:e};if(c){f.filters=c.split(",")}if(h){f.to=h.split(",")}if(a){f.exclude_ids=a.split(",")}if(g){f.title=g}if(b){f.max_recipients=parseInt(b)}this.sendAdvancedAppRequest(f)},sendAdvancedAppRequest:function(a){a.method="apprequests";FB.ui(a,function(b){$$.fjs.fire("org.fjs.facebook.apprequest.complete",b)});return this}};window.fbAsyncInit=function(){var a=$$("html");var b={appId:$$("html").attr("data-fjs-fb-appid"),status:true,cookie:true,oauth:true,xfbml:true};if(a.attr("data-fjs-fb-xd")){b.channelUrl=a.attr("data-fjs-fb-xd")}$$.fjs.log("Facebook intialization parameters:");$$.fjs.log(b);FB._https=window.location.protocol=="https:";FB.init(b);if(a.attr("data-fjs-fb-autosize")){FB.Canvas.setAutoGrow()}this.userLoggedIn=false;FB.getLoginStatus(function(c){$$.fjs.facebook.userLoggedIn=c.status=="connected";if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=c.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,false)});$$.fjs.fire("org.fjs.facebook.init.complete")};$$.fjs.forms={register:function(){if(!$$.fjs.hasPlugin("validate")){return}var a=function(c){var b=$$.fjs.validate.field(c);$$.fjs.forms.highlightFieldError(c);return b};$$(document).on("blur",':input[data-fjs-validate="blur"]',function(){a($$(this))}).on("keyup",':input[data-fjs-validate="keypress"]',function(){a($$(this))}).on("click",':input[data-fjs-validate="click"]',function(){a($$(this))}).on("submit","form",function(){var c=true;var b=$$(this);b.find("*[data-fjs-error_for]").html("");b.find(":input").each(function(){c=a($$(this))&&c});if(c&&b.attr("data-fjs-form-ajax")){$$.fjs.forms.ajaxSubmit(b);return false}return c})},ajaxSubmit:function(a){var d=a.attr("method");var c=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.success",e,f)}}(a);var b=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.error",e,f)}}(a);$.ajax({url:a.attr("action"),type:d?d:"get",data:a.serialize(),success:c,error:b});return this},highlightFieldError:function(e){var c=e.parents("form");var b=e.attr("data-fjs-error_class");if(b){e.removeClass(b);c.find('*[data-fjs-highlight_error_for*="'+e.attr("name")+'"]').each(function(){var h=$$(this).attr("data-fjs-highlight_error_for");if(h==e.attr("name")){$$(this).removeClass(b);return}var f=h.split(",");var j=true;for(var g=0,k=f.length;g<k;g++){if(f[g]==e.attr("name")){continue}if(c.find('*[name="'+f[g]+'"]').hasClass(b)){j=false;break}}if(j){$$(this).removeClass(b)}})}c.find('*[data-fjs-error_for="'+e.attr("name")+'"]').html("");if($$.fjs.validate.fieldError(e)){var d=$$.fjs.validate.fieldError(e);var a=$$.fjs.hasPlugin("lang")?$$_(d):d;c.find('*[data-fjs-error_for="'+e.attr("name")+'"]').html(a).attr("data-fjs-localizable",d);if(b){e.addClass(b);c.find('*[data-fjs-highlight_error_for*="'+e.attr("name")+'"]').addClass(b)}}return this},reset:function(b,a){b.find(":input").each(function(){if(!a){this.value=this.defaultValue}$$.fjs.forms.highlightFieldError($(this))});return $$.fjs.forms}};$$.fjs.lang={currentLang:$$.fjs.config.defaultLang,knownLangs:[],register:function(){var a=$$("html").attr("data-fjs-lang");if(!a){a=$$.fjs.config.defaultLang}if(a){this.set(a)}},set:function(b){this.currentLang=b;if(this.knownLangs.indexOf(b)!=-1){this.localizePage();return this}var a=document.createElement("SCRIPT");a.src=$$.fjs.config.langPath+$$.fjs.config.langFile.withVals(this.currentLang)+"?r="+Math.random();a.type="text/javascript";$$("head")[0].appendChild(a);return this},addEntity:function(b,a,d){var c={};c[a]=d;$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],c);$$.fjs.log("Added custom localization entity for "+b);return this},add:function(b,a){this.knownLangs.push(b);$$.fjs.lang[b]=$$.extend({},$$.fjs.lang[b],a);$$.fjs.log("Registered language "+b);this.localizePage();return this},localizePage:function(){$$("*[data-fjs-localizable]").each(function(){if($$(this).is(":input")){$$(this).val($$_($$(this).attr("data-fjs-localizable")))}else{$$(this).html($$_($$(this).attr("data-fjs-localizable")))}})}};$$.fjs.extendConfiguration({langFile:"fjs_%1.js",langPath:"lang/",defaultLang:null});window.$$_=function(d){if($$.fjs.lang[$$.fjs.lang.currentLang]&&$$.fjs.lang[$$.fjs.lang.currentLang][d]){if(arguments.length==1){return $$.fjs.lang[$$.fjs.lang.currentLang][d]}var a=[];for(var b=1,e=arguments.length;b<e;b++){a.push(arguments[b])}return String.prototype.withVals.apply($$.fjs.lang[$$.fjs.lang.currentLang][d],a)}if($$.fjs.config.debugMode){$$.fjs.warn("Unlocalized entity: "+d)}return d};$$.fjs.message={register:function(){if($$('*[data-fjs-message*="ajax"]').length){$$(document).ajaxStart(function(){$$.fjs.message.show("ajax")});$$(document).ajaxStop(function(){$$.fjs.message.hide("ajax")})}$$(document).on("click",'*[data-fjs-message]:not(*[data-fjs-message-control="manual"])',function(){if($$(this).hasClass("ajax")){return false}$$.fjs.message.hide($$(this));return false})},show:function(n,r,g,l,j){if(!n){$$.fjs.error("You have to specify message type to show");return $$.fjs.message}var q=$$('*[data-fjs-message*="'+n+'"]');if(!q.length){$$.fjs.warn("Message container for `"+n+'` not found. Add `data-fjs-message="'+n+'"` attribute to desired object to fix.');return $$.fjs.message}if(!g){g=q.attr("data-fjs-message-animation");if(!$$.fjs.message.animations[g]){$$.fjs.warn("Animation `"+g+"` is not defined. Fallback to `"+$$.fjs.config.messageDefaultAnimation+"`");g=$$.fjs.config.messageDefaultAnimation}g=$$.fjs.message.animations[g]}if(!l){l=q.attr("data-fjs-message-positioner");if(!$$.fjs.message.positioners[l]){$$.fjs.warn("Positioner `"+l+"` is not defined. Fallback to `"+$$.fjs.config.messageDefaultPositioner+"`");l=$$.fjs.config.messageDefaultPositioner}l=$$.fjs.message.positioners[l]}if(!j){j=q.attr("data-fjs-message-visible");if(!j){j=$$.fjs.config.messageDefaultVisibleTime;$$.fjs.log("No time is set for message container `"+n+"`. Using default "+j+" s.")}}j*=1000;var a=$$.fjs.message.replacePlaceholders(q,l());var e=q.attr("data-fjs-message").split(",");for(var k=0,m=e.length;k<m;k++){q.removeClass(e[k])}q.css({left:a.x-Math.round(q.outerWidth()/2),top:a.y-Math.round(q.outerHeight()/2)}).addClass(n);var f=$$.fjs.message.replacePlaceholders(q,g["in"].before);var b=$$.fjs.message.replacePlaceholders(q,g["in"].animate);var d=$$.fjs.message.replacePlaceholders(q,g["in"].after);var p=$$.fjs.message.replacePlaceholders(q,g.out.before);var h=$$.fjs.message.replacePlaceholders(q,g.out.animate);var o=$$.fjs.message.replacePlaceholders(q,g.out.after);if(r){q.html(r)}q.css(f).stop().animate(b,g["in"].speed,function(){q.css(d);if(j==0){return}var c=function(){setTimeout(function(){q.css(p).stop().animate(h,g.out.speed,function(){q.css(o)})},j)};$$(document).one("mousemove",c).one("keypress",c)});return $$.fjs.message},hide:function(a){var b;if(typeof(a)=="object"){b=a}else{b=a?$('*[data-fjs-message*="'+a+'"]'):$$("*[data-fjs-message]:visible")}if(!b.length){return $$.fjs.message}b.each(function(){var e=b.attr("data-fjs-message-animation");if(!$$.fjs.message.animations[e]){e=$$.fjs.config.messageDefaultAnimation}e=$$.fjs.message.animations[e];var d=$$.fjs.message.replacePlaceholders($$(this),e.out.before);var f=$$.fjs.message.replacePlaceholders($$(this),e.out.animate);var c=$$.fjs.message.replacePlaceholders($$(this),e.out.after);$$(this).css(d).stop().animate(f,e.out.speed,function(){$$(this).css(c)})});return $$.fjs.message},replacePlaceholders:function(d,b){for(var a in b){if(typeof(b[a])!="string"){continue}b[a]=b[a].replace(/%window_height%/gi,$(window).height()).replace(/%window_width%/gi,$(window).width()).replace(/%left%/gi,d.position().left).replace(/%top%/gi,d.position().top).replace(/%centerX%/gi,Math.round(d.position().left+d.outerWidth()/2)).replace(/%centerY%/gi,Math.round(d.position().top+d.outerHeight()/2)).replace(/%height%/gi,d.outerHeight()).replace(/%width%/gi,d.outerWidth());var c=parseInt(b[a]);if(c){b[a]=c}}return b},animations:{popup:{"in":{before:{display:"block",opacity:0},animate:{opacity:1},after:{},speed:500},out:{before:{},animate:{opacity:0},after:{display:"none"},speed:500}},"slide-top":{"in":{before:{display:"block",opacity:0,top:"-%height%"},animate:{top:0,opacity:1},after:{},speed:500},out:{before:{},animate:{top:"-%height%",opacity:0},after:{display:"none"},speed:500}}},positioners:{none:function(){return{x:"%centerX%",y:"%centerY%"}},"window-center":function(){return{x:Math.round($$(window).width()/2),y:Math.round($$(window).height()/2)}}}};$$.fjs.extendConfiguration({messageDefaultAnimation:"popup",messageDefaultPositioner:"none",messageDefaultVisibleTime:3});$$.fjs.twitter={register:function(){$$.fjs.twitter.isAnywherePresent=false;var c=$$("html").attr("data-fjs-twitter-consumer-key");if(c){var b,d="twitter-anywhere";if(document.getElementById(d)){return}b=document.createElement("script");b.id=d;b.async=true;var a="";if(document.location.protocol=="file:"){a="http:"}b.src=a+"//platform.twitter.com/anywhere.js?id="+c+"&v=1";b.onload=function(){$$.fjs.fire("org.fjs.twitter.init.complete")};b.onreadystatechange=function(){if(this.readyState=="complete"){this.onload()}};document.getElementsByTagName("head")[0].appendChild(b)}$$.fjs.subscribe("org.fjs.twitter.init.complete",$$.fjs.twitter.enableAnywhere);$$(document).on("click","*[data-fjs-twitter-share]",function(){$$.fjs.twitter.share($$(this).attr("data-fjs-twitter-share"),$$(this).attr("data-fjs-twitter-share-link"));return false})},enableAnywhere:function(){if(typeof(twttr)=="undefined"){return $$.fjs.twitter}$$.fjs.twitter.isAnywherePresent=true;twttr.anywhere(function(a){$$("*[data-fjs-twitter-linkify-users]").each(function(){$$.fjs.twitter.linkifyUsers($$(this),$$(this).attr("data-fjs-twitter-linkify-users"))});$$("*[data-fjs-twitter-hovercards]").each(function(){$$.fjs.twitter.hovercards($$(this),$$(this).attr("data-fjs-twitter-hovercards"))});$$("*[data-fjs-twitter-follow]").each(function(){a(this).followButton($$(this).attr("data-fjs-twitter-follow"))});$$("*[data-fjs-twitter-login-button]").each(function(){var b=$$(this).attr("data-fjs-twitter-login-button");if(!b.length){b="medium"}a(this).connectButton({size:b})});$$(document).on("click","*[data-fjs-twitter-login]",function(){$$.fjs.twitter.login();return false});$$(document).on("click","*[data-fjs-twitter-logout]",function(){$$.fjs.twitter.logout();return false});a.bind("authComplete",function(c,b){$$.fjs.twitter.user=b;$$.fjs.fire("org.fjs.twitter.login_status.change",true,$$.fjs.twitter.user)});a.bind("signOut",function(b){$$.fjs.fire("org.fjs.twitter.login_status.change",false)});if(a.isConnected()){$$.fjs.twitter.user=a.currentUser}$$.fjs.fire("org.fjs.twitter.login_status.change",a.isConnected(),$$.fjs.twitter.user)});return $$.fjs.twitter},getUser:function(){return $$.fjs.twitter.user},login:function(){if(!$$.fjs.twitter.isAnywherePresent){return false}twttr.anywhere(function(a){a.signIn()});return true},logout:function(){if(!$$.fjs.twitter.isAnywherePresent){return false}twttr.anywhere.signOut();return true},linkifyUsers:function(b,a){twttr.anywhere(function(c){c(b[0]).linkifyUsers({className:a})});return $$.fjs.twitter},hovercards:function(a,b){var c=Math.round(Math.random()*100000);a.attr("data-fjs-twitter-hovercard-id",c);twttr.anywhere(function(d){d('*[data-fjs-twitter-hovercard-id="'+c+'"]').hovercards({linkify:false,expanded:(b=="expanded")})});return $$.fjs.twitter},share:function(h,d){if(typeof(d)=="undefined"){d=document.location.href}var a=[];var e=/#([^\s]+)/g;var c;while(c=e.exec(h)){a.push(c[1]);h=h.replace("#"+c[1],"")}var b=h.replace(/{%link%}/gi,d);if(b!=h){d=""}var g="width="+$$.fjs.config.twitterShareWindowWidth+",height="+$$.fjs.config.twitterShareWindowHeight+",menubar=no,location=no,toolbar=no,status=no";var f="https://twitter.com/intent/tweet?text="+escape($$.trim(b))+"&url="+escape(d)+"&hashtags="+a.join(",");window.open(f,"org.fjs.twitter.share",g);return $$.fjs.twitter}};$$.fjs.extendConfiguration({twitterShareWindowWidth:515,twitterShareWindowHeight:255});jQuery.fn.extend({linkifyUsers:function(a){jQuery(this).each(function(){$$.fjs.twitter.linkifyUsers(jQuery(this),a)});return jQuery(this)},hovercards:function(a){jQuery(this).each(function(){$.fjs.twitter.hovercards(jQuery(this),a)});return jQuery(this)}});$$.fjs.validate={requires:["forms"],register:function(){this.fieldErrors={}},add:function(b,c,a){a=$$.extend({},a,{error_message:""});$$.fjs.validate[b]={func:c,config:a};$$.fjs.log('Registered validator "'+b+'"');return this},field:function(l){this.fieldErrors=[];if(!l.attr("data-fjs-required")&&$$.trim(l.val()).length==0){return true}if(l.attr("data-fjs-required")){var g=true;if(l.is(":checkbox")){g=l.is(":checked")}else{g=$$.trim(l.val()).length!=0}if(!g){var h=l.attr("data-fjs-required_error_message");this.fieldErrors[l.attr("name")]=h?h:"This field is required";return false}}if(!l.attr("data-fjs-validator")){return true}var b=true;var d=l.attr("data-fjs-validator").split(",");for(var f=0,j=d.length;f<j;f++){var a=d[f];var e=this[a];if(!e){if($$.fjs.config.debugMode){$$.fjs.warn('Validator "'+a+'" is not defined')}this.fieldErrors[l.attr("name")]="Validator does not exist";b=false;return b}var m=e.config;$$.each(e.config,function(c){var i="data-fjs-"+a+"_"+c;if(l.attr(i)){m[c]=l.attr(i)}});var k=e.func(l.val(),m,l);if(!k){this.fieldErrors[l.attr("name")]=m.error_message?m.error_message:a}b=b&&k;if(!b){return b}}return b},fieldError:function(a){return this.fieldErrors[a.attr("name")]}};$$.fjs.validate.add("int",function(a){return parseInt(a)==a});$$.fjs.validate.add("float",function(a){return parseFloat(a)==a});$$.fjs.validate.add("regexp",function(a,b){return new RegExp(b.regex).test(a)},{regex:/.*/});$$.fjs.validate.add("email",function(b){b=$$.trim(b);var a=/(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/gi;return a.test(b)});$$.fjs.validate.add("match_field",function(a,b){if(!b.selector){return false}return $$(b.selector).val()==a},{selector:null});