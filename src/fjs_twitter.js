/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Twitter @Anywhere integration plugin
    Copyright (C) 2012  Yuriy Zisin

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
 * Twitter @Anywhere library integration plugin
 */
$$.fjs.twitter = {

    /**
     * Plugin registration handler
     */
    register: function() {
        $$.fjs.twitter.isAnywherePresent = false;
        
        //Adding @Anywhere loader if needed
        var consumerKey = $$('html').attr('data-fjs-twitter-consumer-key');
        if (consumerKey) {
            var js, id = 'twitter-anywhere';
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
            js.src = proto+"//platform.twitter.com/anywhere.js?id="+consumerKey+"&v=1";
            js.onload = function() {
                $$.fjs.fire('org.fjs.twitter.init.complete');
            }
            js.onreadystatechange = function() {
                if (this.readyState == 'complete')
                    this.onload();
            }
            document.getElementsByTagName('head')[0].appendChild(js);
        }
        //Add handler and wait until @Anywhere loads
        $$.fjs.subscribe("org.fjs.twitter.init.complete", $$.fjs.twitter.enableAnywhere);
        
        $$(document).on('click', '*[data-fjs-twitter-share]', function() {
            $$.fjs.twitter.share($$(this).attr('data-fjs-twitter-share'), $$(this).attr('data-fjs-twitter-share-link'));
            return false;
        });
    },
    /**
     * Applies integration to the page
     * 
     * @return {Object} $$.fjs.twitter
     */
    enableAnywhere: function() {
        if (typeof(twttr) == 'undefined')
            return $$.fjs.twitter;
        $$.fjs.twitter.isAnywherePresent = true;
        twttr.anywhere(function(T) {
            $$('*[data-fjs-twitter-linkify-users]').each(function() {
                $$.fjs.twitter.linkifyUsers($$(this), $$(this).attr('data-fjs-twitter-linkify-users'));
            });
            $$('*[data-fjs-twitter-hovercards]').each(function() {
                $$.fjs.twitter.hovercards($$(this), $$(this).attr('data-fjs-twitter-hovercards'));
            });
            $$('*[data-fjs-twitter-follow]').each(function() {
                T(this).followButton($$(this).attr('data-fjs-twitter-follow'));
            });
            $$('*[data-fjs-twitter-login-button]').each(function() {
                var bSize = $$(this).attr('data-fjs-twitter-login-button');
                if (!bSize.length)
                    bSize = 'medium';
                T(this).connectButton({size: bSize});
            });
            $$(document).on('click', '*[data-fjs-twitter-login]', function() {
                $$.fjs.twitter.login();
                return false;
            });
            $$(document).on('click', '*[data-fjs-twitter-logout]', function() {
                $$.fjs.twitter.logout();
                return false;
            });
            T.bind("authComplete", function (e, user) {
                $$.fjs.twitter.user = user;
                $$.fjs.fire('org.fjs.twitter.login_status.change', true, true, $$.fjs.twitter.user);
            });
 
            T.bind("signOut", function (e) {
                $$.fjs.twitter.user = null;
                $$.fjs.fire('org.fjs.twitter.login_status.change', false, true);
            });
            $$.fjs.twitter.user = null;
            if (T.isConnected()) {
              $$.fjs.twitter.user = T.currentUser;
            }
            $$.fjs.fire('org.fjs.twitter.login_status.change', T.isConnected(), false, $$.fjs.twitter.user);
        });
        return $$.fjs.twitter;
    },
    /**
     * Returns current logged in user object
     * 
     * @return {Object} User object
     */
    getUser: function() {
        return $$.fjs.twitter.user;
    },
    /**
     * Initiates login process
     * 
     * @return {boolean} True if @Anywhere is loaded and logout is triggered. False otherwise
     */
    login: function() {
        if (!$$.fjs.twitter.isAnywherePresent)
            return false;
        twttr.anywhere(function(T) {
            //Check if we already have profile and just fire event in this case without showing annoying popup
            if ($$.fjs.twitter.user != null) {
                $$.fjs.fire('org.fjs.twitter.login_status.change', true, true, $$.fjs.twitter.user);
                return true;
            }
            T.signIn();
        });
        return true;
    },
    /**
     * Performs user logout
     * 
     * @return {boolean} True if @Anywhere is loaded and logout is triggered. False otherwise
     */
    logout: function() {
        if (!$$.fjs.twitter.isAnywherePresent)
            return false;
        twttr.anywhere.signOut();
        return true;
    },
    /**
     * Linkifiers users
     * @see https://dev.twitter.com/docs/anywhere/welcome#auto-linkify
     * 
     * @param  {Object} $object          jQuery object to linkify usrs in
     * @param  {String} withClassName    CSS class to set to <a> upon linkifying
     * 
     * @return {Object} $$.fjs.twitter
     */
    linkifyUsers: function($object, withClassName) {
        twttr.anywhere(function(T) {
            T($object[0]).linkifyUsers({className: withClassName});
        });
        return $$.fjs.twitter;
    },
    /**
     * Enables user hovercards
     * @see https://dev.twitter.com/docs/anywhere/welcome#hovercards
     * 
     * @param  {Object} $object          jQuery object to linkify usrs in
     * @param  {String} mode             Mode to use. Default is 'simple'. Other option is 'expanded'
     * 
     * @return {Object} $$.fjs.twitter
     */
    hovercards: function($object, mode) {
        var id=Math.round(Math.random()*100000);
        $object.attr('data-fjs-twitter-hovercard-id', id);
        twttr.anywhere(function(T) {
            T('*[data-fjs-twitter-hovercard-id="'+id+'"]').hovercards({linkify: false, expanded: (mode == 'expanded')});
        });
        return $$.fjs.twitter;
    },
    /**
     * Shares given text and link. 
     * {%link%} placeholder can be used to put the link inside text, and not at the end of the tweet
     * 
     * @param  {String} text            Text to tweet
     * @param  {String} url             URL to include into tweet
     * 
     * @return {Object} $$.fjs.twitter
     */
    share:function(text, url) {
        if (typeof(url) == 'undefined')
            url = document.location.href;

        var hashtags = [];
        var regex = /#([^\s]+)/g;
        var match;
        while (match = regex.exec(text)) {
            hashtags.push(match[1]);
            text = text.replace('#'+match[1], '');
        }

        var urlText = text.replace(/{%link%}/gi, url);
        if (urlText != text)
            url = '';
        
        var windowParams='width='+$$.fjs.config.twitterShareWindowWidth+',height='+$$.fjs.config.twitterShareWindowHeight+',menubar=no,location=no,toolbar=no,status=no';
        var target='https://twitter.com/intent/tweet?text='+escape($$.trim(urlText))+'&url='+escape(url)+'&hashtags='+hashtags.join(',');
        window.open(target, 'org.fjs.twitter.share', windowParams);
        return $$.fjs.twitter;
    }
}

//Extending configuration
$$.fjs.extendConfiguration({
    twitterShareWindowWidth: 515,
    twitterShareWindowHeight: 255
});

//jQuery extension to simplify using linkify and hovercards in dynamic content
jQuery.fn.extend({
    linkifyUsers: function(className) {
        jQuery(this).each(function() {
            $$.fjs.twitter.linkifyUsers(jQuery(this), className);
        });
        return jQuery(this);
    },
    hovercards: function(mode) {
        jQuery(this).each(function() {
            $.fjs.twitter.hovercards(jQuery(this), mode);
        });
        return jQuery(this);
    }
});