/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Facebook Javascript SDK integration
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

$$.fjs.plugin('facebook', {
    //Hold the user login status
    userLoggedIn: false,
    //Holds user FBUUID
    userId : null,
    //Registers plugin
    register: function() {
        //Loading FB JS SDK
        if ($$('html').attr('data-fjs-fb-appid')) {
            window.fbAsyncInit = this.initFB;
            $$('<div id="fb-root"></div>').prependTo('body');
            var js, id = 'facebook-jssdk';
            if (document.getElementById(id)) {
                return;
            }
            js = document.createElement('script');
            js.id = id;
            js.async = true;
            //Check for local load
            var proto = '';
            if (document.location.protocol == 'file:') {
                proto = 'http:'
            }
            js.src = proto+"//connect.facebook.net/en_US/all.js";
            document.getElementsByTagName('head')[0].appendChild(js);
            
            //Registering login triggers
            $$('*[data-fjs-fb-login]').live('click', function() {
                $$.fjs.facebook.login($$(this).attr('data-fjs-fb-login'));
                return false;
            });
            //Registering feed triggers
            $$('*[data-fjs-fb-feed-link]').live('click', function() {
                var $element = $$(this);
                $$.fjs.facebook.publish(
                    $element.attr('data-fjs-fb-feed-link'),
                    $element.attr('data-fjs-fb-feed-name'),
                    $element.attr('data-fjs-fb-feed-picture'),
                    $element.attr('data-fjs-fb-feed-caption'),
                    $element.attr('data-fjs-fb-feed-description')
                );
                return false;
            });
            //Registering multifriend selector triggers
            $$('*[data-fjs-fb-apprequest-message]').live('click', function() {
                $$.fjs.facebook.sendAppRequest(
                    $$(this).attr('data-fjs-fb-apprequest-message'),
                    $$(this).attr('data-fjs-fb-apprequest-to'),
                    $$(this).attr('data-fjs-fb-apprequest-filter'),
                    $$(this).attr('data-fjs-fb-apprequest-exclude'),
                    $$(this).attr('data-fjs-fb-apprequest-max'),
                    $$(this).attr('data-fjs-fb-apprequest-data'),
                    $$(this).attr('data-fjs-fb-apprequest-title')
                );
                return false;
            });
        }
    },
    //Initializes Facebook SDK
    initFB: function() {
        var $html = $$('html');
        var initParams = {
            appId      : $$('html').attr('data-fjs-fb-appid'), // App ID
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            oauth      : true, // enable OAuth 2.0
            xfbml      : true  // parse XFBML
        };
        
        if ($html.attr('data-fjs-appid-xd') && $$.browser.msie && $$.browser.version >= 8 && $$.browser.version <= 9) {
            initParams.channelUrl = $html.attr('data-fjs-fb-xd');
        }
        
        $$.fjs.log('Facebook intialization parameters:');
        $$.fjs.log(initParams);
        
        FB._https = window.location.protocol == 'https:';
        FB.init(initParams);
        // Hack to fix http://bugs.developers.facebook.net/show_bug.cgi?id=20168 for IE7/8/9
        FB.UIServer.setLoadedNode = function (a, b) {
            FB.UIServer._loadedNodes[a.id] = b;
        };
       
        //Requesting login status
        this.userLoggedIn = false;
        $$.fjs.fire('org.fjs.facebook.login_status.change', false);
        FB.getLoginStatus(function(response) {
            $$.fjs.facebook.userLoggedIn = response.status == 'connected';
            if ($$.fjs.facebook.userLoggedIn) {
                $$.fjs.facebook.userId = response.authResponse.userID;
            }
            $$.fjs.fire('org.fjs.facebook.login_status.change', $$.fjs.facebook.userLoggedIn);
        });
    },
    //Returns user login status
    //
    //@return bool
    isLoggedIn: function() {
        return this.userLoggedIn;
    },
    //Return user FBUUID
    //
    //@return string
    getUserId: function() {
        return this.userId;
    },
    //Starts profile request
    requestProfile: function() {
        if (!this.userLoggedIn)
            return this;
        FB.api('/me', function(response) {
            $$.fjs.fire('org.fjs.facebook.profile_request.complete', response);
        });
        return this;
    },
    //Performs user login
    //
    //@param string scope Comma separated list of extended permissions
    //@see https://developers.facebook.com/docs/reference/api/permissions/
    login: function(scope) {
        FB.login(function(response) {
            $$.fjs.facebook.userLoggedIn = response.authResponse ? true : false;
            $$.fjs.fire('org.fjs.facebook.login_status.change', $$.fjs.facebook.userLoggedIn);
        }, {
            scope: scope
        });
        return this;
    },
    //Performs feed publish via dialog
    //
    //@param string link        Link to share
    //@param string name        Link title
    //@param string picture     Image to associate with the link
    //@param string caption     Caption for the link
    //@param string description Description of the link
    publish: function(link, name, picture, caption, description) {
        FB.ui({
            method: 'feed',
            name: name,
            link: link,
            picture: picture,
            caption: caption,
            description: description
        }, 
        function(response) {
            if (response && response.post_id) {
                $$.fjs.fire('org.fjs.facebook.publish.complete', true, response.post_id);
            } else {
                $$.fjs.fire('org.fjs.facebook.publish.complete', false, null);
            }
        });
        return this;
    },
    //Open AppRequest dialog (multifriend selector)
    //
    //@param string message     Request message
    //@param string title       Request dialog title (max 50 chars)
    //@param string filters     Filters to apply (all | app_users | app_non_users)
    //@param string data        Any user data, 255 chars long
    //@param string userIds     Comma separated list of FBUUIDs to restrict list to
    //@param string excludeIds  Comma separated list of FBUUIDs to exclude
    //@param int    maxRecpt    Maximum recipients for the request
    sendAppRequest: function(message, userIds, filters, excludeIds, maxRecpt, data, title) {
        var params = {
            message: message,
            data: data
        };
        if (filters) {
            params.filters = filters.split(',');
        }
        if (userIds) {
            params.to = userIds.split(',');
        }
        if (excludeIds) {
            params.exclude_ids = excludeIds.split(',');
        }
        if (title) {
            params.title = title;
        }
        if (maxRecpt) {
            params.max_recipients = parseInt(maxRecpt);
        }
        this.sendAdvancedAppRequest(params);
    },
    //Performs AppRequest dialog (multifriend selector) with advanced params
    //
    //@param object params Parameters for FB.ui
    sendAdvancedAppRequest: function(params) {
        params.method = 'apprequests';
        FB.ui(params, function(response) {
            $$.fjs.fire('org.fjs.facebook.apprequest.complete', response);
        });
        return this;        
    }
});



