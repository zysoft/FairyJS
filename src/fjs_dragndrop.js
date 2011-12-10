/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Drag and drop management plugin
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
 * Drag&Drop plugin
 */
$$.fjs.dragndrop = {
    /**
     * Plugin registration handler
     */
    register: function() {
        if (!$$.ui) {
            $$.fjs.warn('jQuery UI is required to run plugin "dragndrop"');
            return;
        }
        $$.fjs.dragndrop.setDraggable();
        $$.fjs.dragndrop.setDroppable();
        
        //Adding jQuery plugin to simplify access to drag and drop
        $$.fn.extend({
            makeDraggable: function() {
                $$.fjs.dragndrop.setDraggable($$(this));
                return this;
            },
            makeDroppable: function() {
                $$.fjs.dragndrop.setDroppable($$(this));
                return this;
            }
        });
    },
    /**
     * Sets up draggable objects to be really draggable
     * 
     * @param {Object=} $object jQuery object to make draggable (all data-fjs-draggable by default)
     * 
     * @return {Object} $$.fjs.dragndrop
     */
    setDraggable: function($object) {
        ($object ? $object : $$('*[data-fjs-draggable]')).each(function() {
            var dragArgs = {};
            var containment = $$(this).attr('data-fjs-draggable');
            switch (containment) {
                case 'window':
                case 'parent':
                case 'document':
                    break;
                default:
                    containment = containment.split(',');
            }
            dragArgs.containment = containment;

            var cursor = $$(this).attr('data-fjs-draggable-cursor');
            if (cursor) 
                dragArgs.cursor = cursor;
            var revertPosition = $$(this).attr('data-fjs-draggable-revert');
            var availableRevert = {
                valid:'valid',
                invalid:'invalid',
                'true':true
            };
            if (revertPosition && availableRevert[revertPosition])
                dragArgs.revert = availableRevert[revertPosition];
            dragArgs.start = function($ev, $ui) {
                $$.fjs.fire('org.fjs.dragndrop.drag.start', $$(this), $ui);
            };
            dragArgs.stop = function($ev, $ui) {
                $$.fjs.fire('org.fjs.dragndrop.drag.stop', $$(this), $ui);
            };
            var doClone = $$(this).attr('data-fjs-draggable-clone');
            if (doClone) {
                dragArgs = $$.extend(dragArgs, {
                    opacity: 0.5, 
                    helper:'clone'
                });
            }
            $$(this).draggable(dragArgs);
        });
        return this;
    },
    /**
     * Sets up droppable objects to be really droppable
     * 
     * @param {Object=} $object jQuery object to make droppable (all data-fjs-droppable by default)
     * 
     * @return {Object} $$.fjs.dragndrop
     */    
    setDroppable: function($object) {
        ($object ? $object : $$('*[data-fjs-droppable]')).each(function() {
            var droppableArgs = {};
            var acceptedDroppables = $$(this).attr('data-fjs-droppable').split(',');
            var onDropCode = $$(this).attr('data-fjs-ondrop');
            var activeClass = $$(this).attr('data-fjs-highlight-class');
            var selector = '*[data-fjs-drop-to="'+acceptedDroppables.join(',*[data-fjs-drop-to="')+'"]';
            $$.fjs.log('Item set to accept: '+selector+'. Matched items: '+$$(selector).length);
            droppableArgs.accept = selector;
            droppableArgs.drop = function($ev, $ui) {
                $$.fjs.fire('org.fjs.dragndrop.drop', $ui.draggable, $$(this));
                $what = $ui.draggable;
                $where = $$(this);
                eval(onDropCode);
            };
            if (activeClass)
                droppableArgs.activeClass = activeClass;
            $$(this).droppable(droppableArgs);
        });
        return this;
    },
    /**
     * Disables draggable settings for object
     * 
     * @param {Object} $object jQuery object
     * 
     * @return {Object} $$.fjs.dragndrop
     */
    disableDragFor: function($object) {
        $object.draggable("option", "disabled", true);
    },
    /**
     * Enables draggable settings for object
     * 
     * @param {Object} $object jQuery object
     * 
     * @return {Object} $$.fjs.dragndrop
     */
    enableDragFor: function($object) {
        $object.draggable("option", "disabled", false);
    },
    /**
     * Disables droppable settings for object
     * 
     * @param {Object} $object jQuery object
     * 
     * @return {Object} $$.fjs.dragndrop
     */
    disableDropFor: function($object) {
        $object.droppable("option", "disabled", true);
    },
    /**
     * Enables droppable settings for object
     * 
     * @param {Object} $object jQuery object
     * 
     * @return {Object} $$.fjs.dragndrop
     */
    enableDropFor: function($object) {
        $object.droppable("option", "disabled", false);
    }    
}