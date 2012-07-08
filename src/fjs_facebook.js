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

/**
 * Facebook integration plugin
 */
$$.fjs.facebook = {
    /**
     * Plugin registration handler
     */
    register: function() {
        //Loading FB JS SDK
        if ($$('html').attr('data-fjs-fb-appid')) {
            //Hold the user login status
            this.userLoggedIn = false,
            //Holds user FBUUID
            this.userId = null,            
            
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
            //Checking lang specification
            var fbLocale = $$('html').attr('data-fjs-fb-lang');
            js.src = proto+"//connect.facebook.net/"+(fbLocale ? fbLocale : 'en_US')+"/all.js";
            document.getElementsByTagName('head')[0].appendChild(js);
            
            //Registering login triggers
            $$(document).on('click', '*[data-fjs-fb-login]', function() {
                $$.fjs.facebook.login($$(this).attr('data-fjs-fb-login'));
                return false;
            });
            //Registering feed triggers
            $$(document).on('click', '*[data-fjs-fb-feed-link]', function() {
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
            $$(document).on('click', '*[data-fjs-fb-apprequest-message]', function() {
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
    /**
     * Returns user login status
     * 
     * @return {boolean}
     */
    isLoggedIn: function() {
        return this.userLoggedIn;
    },

    /**
     * Return user FBUUID
     * 
     * @return {String}
     */
    getUserId: function() {
        return this.userId;
    },
    /**
     * Starts profile request
     * 
     * @param {String} [userFbuuid] User to get profile for (default - for current user)
     * 
     * @return {Object} $$.fjs.facebook
     */
    requestProfile: function(userFbuuid) {
        if (!this.userLoggedIn)
            return this;
        var reqStr = '/me';
        if (userFbuuid)
            reqStr = '/'+userFbuuid;
        FB.api(reqStr, function(response) {
            $$.fjs.fire('org.fjs.facebook.profile_request.complete', response);
        });
        return this;
    },
    /** 
     * Performs user login
     * 
     * @see https://developers.facebook.com/docs/reference/api/permissions/
     * @param {String} scope Comma separated list of extended permissions
     * 
     * @return {Object} $$.fjs.facebook
     */
    login: function(scope) {
        if (scope == 'basic')
            scope = '';
        FB.login(function(response) {
            $$.fjs.facebook.userLoggedIn = response.authResponse ? true : false;
            if ($$.fjs.facebook.userLoggedIn) {
                $$.fjs.facebook.userId = response.authResponse.userID;
            }
            $$.fjs.fire('org.fjs.facebook.login_status.change', $$.fjs.facebook.userLoggedIn, true);
        }, {
            scope: scope
        });
        return this;
    },
    /**
     * Performs feed publish via dialog
     * 
     * @param {String} link        Link to share
     * @param {String} name        Link title
     * @param {String} picture     Image to associate with the link
     * @param {String} caption     Caption for the link
     * @param {String} description Description of the link
     * 
     * @return {Object} $$.fjs.facebook
     */
    publish: function(link, name, picture, caption, description) {
        if ($$.trim(link).length == 0)
            link = document.location.href;
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
    /**
     * Open AppRequest dialog (multifriend selector)
     * 
     * @param {String} message     Request message
     * @param {String} title       Request dialog title (max 50 chars)
     * @param {String} filters     Filters to apply (all | app_users | app_non_users)
     * @param {String} data        Any user data, 255 chars long
     * @param {String} userIds     Comma separated list of FBUUIDs to restrict list to
     * @param {String} excludeIds  Comma separated list of FBUUIDs to exclude
     * @param {int}    maxRecpt    Maximum recipients for the request
     * 
     * @return {Object} $$.fjs.facebook
     */
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
    /**
     * Performs AppRequest dialog (multifriend selector) with advanced params
     * 
     * @param {Object} params Parameters for FB.ui
     * 
     * @return {Object} $$.fjs.facebook
     */
    sendAdvancedAppRequest: function(params) {
        params.method = 'apprequests';
        FB.ui(params, function(response) {
            $$.fjs.fire('org.fjs.facebook.apprequest.complete', response);
        });
        return this;        
    }
}

//Adding FB intialization
window.fbAsyncInit = function() {
    var $html = $$('html');
    var initParams = {
        appId      : $$('html').attr('data-fjs-fb-appid'), // App ID
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        oauth      : true, // enable OAuth 2.0
        xfbml      : true  // parse XFBML
    };
        
    if ($html.attr('data-fjs-fb-xd')) {
        initParams.channelUrl = $html.attr('data-fjs-fb-xd');
    }
        
    $$.fjs.log('Facebook intialization parameters:');
    $$.fjs.log(initParams);
        
    FB._https = window.location.protocol == 'https:';
    FB.init(initParams);
    
//    if ($$.browser.msie) {
//        // Hack to fix http://bugs.developers.facebook.net/show_bug.cgi?id=20168 for IE7/8/9
//        FB.UIServer.setLoadedNode = function (a, b) {
//            FB.UIServer._loadedNodes[a.id] = b;
//        };
//    }
    
    if ($html.attr('data-fjs-fb-autosize')) {
        FB.Canvas.setAutoGrow();
    }
        
    //Requesting login status
    this.userLoggedIn = false;
    FB.getLoginStatus(function(response) {
        $$.fjs.facebook.userLoggedIn = response.status == 'connected';
        if ($$.fjs.facebook.userLoggedIn) {
            $$.fjs.facebook.userId = response.authResponse.userID;
        }
        $$.fjs.fire('org.fjs.facebook.login_status.change', $$.fjs.facebook.userLoggedIn, false);
    });
    $$.fjs.fire('org.fjs.facebook.init.complete');
}