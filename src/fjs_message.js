/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Data validation plugin
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
 * User notification messages display plugin
 */
$$.fjs.message = {
    /**
     * Plugin registration handler
     */
    register: function() {
        //Assign global Ajax handlers if any containers are detected
        if ($$('*[data-fjs-message*="ajax"]').length) {
            $$(document).ajaxStart(function() {
                $$.fjs.message.show('ajax');
            });
            $$(document).ajaxStop(function() {
                $$.fjs.message.hide('ajax');
            });
        }
        $$(document).on('click', '*[data-fjs-message]:not(*[data-fjs-message-control="manual"])', function() {
            if ($$(this).hasClass('ajax')) //Don't allow hiding ajax messages
                return false;
            $$.fjs.message.hide($$(this));
            return false;
        });
    },
    /**
     * Shows a message with given type
     * 
     * @param {String}   type            Message type (keyword)
     * @param {String}   message         Message text
     * @param {Object}   [animation]     Message display animation descriptor
     * @param {Object}   [positioner]    Position provider
     * @param {int}      [visibleTime]   Time message should still be visible after user makes some activity
     * 
     * @return {Object] $$.fjs.message
     */
    show: function(type, message, animation, positioner, visibleTime) {
        if (!type) {
            $$.fjs.error('You have to specify message type to show');
            return $$.fjs.message;
        }
        var $container = $$('*[data-fjs-message*="'+type+'"]');
        if (!$container.length) {
            $$.fjs.warn('Message container for `'+type+'` not found. Add `data-fjs-message="'+type+'"` attribute to desired object to fix.');
            return $$.fjs.message;
        }
        
        if (!animation) {
            animation = $container.attr('data-fjs-message-animation');
            if (!$$.fjs.message.animations[animation]) {
                $$.fjs.warn('Animation `'+animation+'` is not defined. Fallback to `'+$$.fjs.config.messageDefaultAnimation+'`');
                animation = $$.fjs.config.messageDefaultAnimation;
            }
            animation = $$.fjs.message.animations[animation];
        }

        if (!positioner) {
            positioner = $container.attr('data-fjs-message-positioner');
            if (!$$.fjs.message.positioners[positioner]) {
                $$.fjs.warn('Positioner `'+positioner+'` is not defined. Fallback to `'+$$.fjs.config.messageDefaultPositioner+'`');
                positioner = $$.fjs.config.messageDefaultPositioner;
            }
            positioner = $$.fjs.message.positioners[positioner];
        }
        
        if (!visibleTime) {
            visibleTime = $container.attr('data-fjs-message-visible');
            if (!visibleTime) {
                visibleTime = $$.fjs.config.messageDefaultVisibleTime;
                $$.fjs.log('No time is set for message container `'+type+'`. Using default '+visibleTime+' s.');
            }
        }
        
        visibleTime *= 1000; //Get milliseconds
        
        //Getting center point
        var center = $$.fjs.message.replacePlaceholders($container, positioner());

        var classes = $container.attr('data-fjs-message').split(',');
        for (var i=0,c=classes.length; i<c; i++)
            $container.removeClass(classes[i]);

        //Positioning message
        $container.css({
            left: center.x - Math.round($container.outerWidth()/2),
            top: center.y - Math.round($container.outerHeight()/2)
        }).addClass(type);

        //Processing placeholders in animation CSS
        var inCssBefore = $$.fjs.message.replacePlaceholders($container, animation['in'].before);
        var inCssAnimation = $$.fjs.message.replacePlaceholders($container, animation['in'].animate);
        var inCssAfter = $$.fjs.message.replacePlaceholders($container, animation['in'].after);

        //Processing placeholders in animation CSS
        var outCssBefore = $$.fjs.message.replacePlaceholders($container, animation['out'].before);
        var outCssAnimation = $$.fjs.message.replacePlaceholders($container, animation['out'].animate);
        var outCssAfter = $$.fjs.message.replacePlaceholders($container, animation['out'].after);
        
        if (message)
            $container.html(message);
        
        //Animate appearance
        $container.css(inCssBefore).stop().animate(inCssAnimation, animation['in'].speed, function() {
            $container.css(inCssAfter);
            if (visibleTime == 0) {
                return;
            }
            //Handler to hide message on user activity
            var onUserActivity = function() {
                setTimeout(function() {
                    $container.css(outCssBefore).stop().animate(outCssAnimation, animation['out'].speed, function() {
                        $container.css(outCssAfter);
                    });
                }, visibleTime);
            }
            //Assign handlers to user activity events
            $$(document).one('mousemove', onUserActivity).one('keypress', onUserActivity);
        });
        return $$.fjs.message;
    },
    /**
     * Hides messages by type or all at once
     * 
     * @param {String|Object}   [type]      Message type (keyword). Hides all if no type specified. Direct container object can be used instead of string type
     * 
     * @return {Object] $$.fjs.message
     */
    hide: function(type) {
        var $container;
        if (typeof(type) == 'object') {
            $container = type;
        } else {
            $container = type ? $('*[data-fjs-message*="'+type+'"]') : $$('*[data-fjs-message]:visible');
        }
        if (!$container.length) {
            return $$.fjs.message;
        }
        $container.each(function() {
            var animation = $container.attr('data-fjs-message-animation');
            if (!$$.fjs.message.animations[animation]) {
                animation = $$.fjs.config.messageDefaultAnimation;
            }
            animation = $$.fjs.message.animations[animation];
            var outCssBefore = $$.fjs.message.replacePlaceholders($$(this), animation['out'].before);
            var outCssAnimation = $$.fjs.message.replacePlaceholders($$(this), animation['out'].animate);
            var outCssAfter = $$.fjs.message.replacePlaceholders($$(this), animation['out'].after);
            $$(this).css(outCssBefore).stop().animate(outCssAnimation, animation['out'].speed, function() {
                $$(this).css(outCssAfter);
            });
        });
        return $$.fjs.message;
    },
    /**
     * Replaces placeholders in animaiton CSS to real values
     * Supported placholders: %left% %top% %height% %width% %window_height% %window_width% %centerX% %centerY%
     * 
     * @param {Object}   $container  jQuery object corresponding to container which data goed to placeholders
     * @param {Object}   css         Object with CSS definitions
     * 
     * @return {Object] $$.fjs.message
     */
    replacePlaceholders: function($container, css) {
        for (var i in css) {
            if (typeof(css[i]) != 'string')
                continue;
            css[i] = css[i]
                        .replace(/%window_height%/gi, $(window).height())
                        .replace(/%window_width%/gi,  $(window).width())
                        .replace(/%left%/gi,          $container.position().left)
                        .replace(/%top%/gi,           $container.position().top)
                        .replace(/%centerX%/gi,       Math.round($container.position().left + $container.outerWidth()/2))
                        .replace(/%centerY%/gi,       Math.round($container.position().top + $container.outerHeight()/2))
                        .replace(/%height%/gi,        $container.outerHeight())
                        .replace(/%width%/gi,         $container.outerWidth());
            //Make int from result value
            var intVal = parseInt(css[i]);
            if (intVal)
                css[i] = intVal;
        }
        return css;
    },
    /**
     * Standard animation definitions
     */
    animations: {
        //Popup animation
        'popup': {
            'in': {
                'before': {display: 'block', opacity: 0},
                'animate': {opacity: 1},
                'after': {},
                'speed': 500
            },
            'out': {
                'before': {},
                'animate': {opacity: 0},
                'after': {display: 'none'},
                'speed': 500
            }
        },
        //Slide from top
        'slide-top': {
            'in': {
                'before': {display: 'block', opacity: 0, top: '-%height%'},
                'animate': {top: 0, opacity: 1},
                'after': {},
                'speed': 500
            },
            'out': {
                'before': {},
                'animate': {top: '-%height%', opacity: 0},
                'after': {display: 'none'},
                'speed': 500
            }
        }
    },
    /**
     * Standard position provider definitions
     */
    positioners: {
        'none': function() {
            return {
                'x': '%centerX%',
                'y': '%centerY%'
            }
        },
        'window-center': function() {
            return {
                'x': Math.round($$(window).width()/2), 
                'y': Math.round($$(window).height()/2)
            };
        }
    }
}

//Adding configuration options
$$.fjs.extendConfiguration({
      messageDefaultAnimation: 'popup',
     messageDefaultPositioner: 'none',
    messageDefaultVisibleTime: 3                //Seconds
});
