/* FairyJS zysoft.github.com/FairyJS | github.com/zysoft/FairyJS/blob/master/LICENSE */
$$.fjs.facebook={register:function(){if($$("html").attr("data-fjs-fb-appid")){this.userLoggedIn=false,this.userId=null,$$('<div id="fb-root"></div>').prependTo("body");var c,d="facebook-jssdk";if(document.getElementById(d)){return}c=document.createElement("script");c.id=d;c.async=true;var b="";if(document.location.protocol=="file:"){b="http:"}var a=$$("html").attr("data-fjs-fb-lang");c.src=b+"//connect.facebook.net/"+(a?a:"en_US")+"/all.js";document.getElementsByTagName("head")[0].appendChild(c);$$("*[data-fjs-fb-login]").live("click",function(){$$.fjs.facebook.login($$(this).attr("data-fjs-fb-login"));return false});$$("*[data-fjs-fb-feed-link]").live("click",function(){var e=$$(this);$$.fjs.facebook.publish(e.attr("data-fjs-fb-feed-link"),e.attr("data-fjs-fb-feed-name"),e.attr("data-fjs-fb-feed-picture"),e.attr("data-fjs-fb-feed-caption"),e.attr("data-fjs-fb-feed-description"));return false});$$("*[data-fjs-fb-apprequest-message]").live("click",function(){$$.fjs.facebook.sendAppRequest($$(this).attr("data-fjs-fb-apprequest-message"),$$(this).attr("data-fjs-fb-apprequest-to"),$$(this).attr("data-fjs-fb-apprequest-filter"),$$(this).attr("data-fjs-fb-apprequest-exclude"),$$(this).attr("data-fjs-fb-apprequest-max"),$$(this).attr("data-fjs-fb-apprequest-data"),$$(this).attr("data-fjs-fb-apprequest-title"));return false})}},isLoggedIn:function(){return this.userLoggedIn},getUserId:function(){return this.userId},requestProfile:function(a){if(!this.userLoggedIn){return this}var b="/me";if(a){b="/"+a}FB.api(b,function(c){$$.fjs.fire("org.fjs.facebook.profile_request.complete",c)});return this},login:function(a){if(a=="basic"){a=""}FB.login(function(b){$$.fjs.facebook.userLoggedIn=b.authResponse?true:false;if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=b.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,true)},{scope:a});return this},publish:function(d,b,e,a,c){if($$.trim(d).length==0){d=document.location.href}FB.ui({method:"feed",name:b,link:d,picture:e,caption:a,description:c},function(f){if(f&&f.post_id){$$.fjs.fire("org.fjs.facebook.publish.complete",true,f.post_id)}else{$$.fjs.fire("org.fjs.facebook.publish.complete",false,null)}});return this},sendAppRequest:function(d,h,c,a,b,e,g){var f={message:d,data:e};if(c){f.filters=c.split(",")}if(h){f.to=h.split(",")}if(a){f.exclude_ids=a.split(",")}if(g){f.title=g}if(b){f.max_recipients=parseInt(b)}this.sendAdvancedAppRequest(f)},sendAdvancedAppRequest:function(a){a.method="apprequests";FB.ui(a,function(b){$$.fjs.fire("org.fjs.facebook.apprequest.complete",b)});return this}};window.fbAsyncInit=function(){var a=$$("html");var b={appId:$$("html").attr("data-fjs-fb-appid"),status:true,cookie:true,oauth:true,xfbml:true};if(a.attr("data-fjs-fb-xd")){b.channelUrl=a.attr("data-fjs-fb-xd")}$$.fjs.log("Facebook intialization parameters:");$$.fjs.log(b);FB._https=window.location.protocol=="https:";FB.init(b);if(a.attr("data-fjs-fb-autosize")){FB.Canvas.setAutoGrow()}this.userLoggedIn=false;FB.getLoginStatus(function(c){$$.fjs.facebook.userLoggedIn=c.status=="connected";if($$.fjs.facebook.userLoggedIn){$$.fjs.facebook.userId=c.authResponse.userID}$$.fjs.fire("org.fjs.facebook.login_status.change",$$.fjs.facebook.userLoggedIn,false)});$$.fjs.fire("org.fjs.facebook.init.complete")};