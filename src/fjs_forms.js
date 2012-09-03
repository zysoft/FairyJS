/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Forms management plugin
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
 * Form processing plugin
 */
$$.fjs.forms = {
    /**
     * Plugin registration handler
     */
    register: function() {
        //Assign onSubmit handler to all forms
        $$(document)
        .on('submit', 'form', function() {
            var isFormValid = true;
            var $form = $$(this);
            //Clear all errors
            $$.fjs.forms.reset($form, true);
            if ($$.fjs.hasPlugin('validate')) { //If validation plugin enabled - validate
                $form.find(':input').each(function() {
                    isFormValid = singleFieldValidate($$(this)) && isFormValid;
                });
            }
            if (isFormValid && $form.attr('data-fjs-form-ajax')) {
                $$.fjs.forms.ajaxSubmit($form);
                return false;
            }
            return isFormValid;
        });
        
        //Don't set up validaion hooks if no validation plugin present
        if (!$$.fjs.hasPlugin('validate'))
            return;
        //Handler to process single field validation
        var singleFieldValidate = function($input) {
            var res = $$.fjs.validate.field($input);
            $$.fjs.forms.highlightFieldError($input);
            return res;
        };
        $$(document)
        //Assign onBlur validation
        .on('blur', ':input[data-fjs-validate="blur"]', function() {
            singleFieldValidate($$(this));
        })
        //Assign onKeypress validation (which is onKeyUp)
        .on('keyup', ':input[data-fjs-validate="keypress"]', function() {
            singleFieldValidate($$(this));
        })
        //Assign onClick validation
        .on('click', ':input[data-fjs-validate="click"]', function() {
            singleFieldValidate($$(this));
        });
    },
    /**
     * Performs Ajax form submission
     * 
     * @param {Object} $form jQuery from object to submit
     * 
     * @return {Object}      $$.fjs.forms
     */
    ajaxSubmit: function($form) {
        var method = $form.attr('method');
        var successFunc = function($form) {
            return function(response) {
                $$.fjs.fire('org.fjs.form.submit.success', $form, response);
            }
        }($form);
        var failFunc = function($form) {
            return function(response) {
                $$.fjs.fire('org.fjs.form.submit.error', $form, response);
            }
        }($form);
        $.ajax({
            url: $form.attr('action'),
            type: method ? method : 'get',
            data: $form.serialize(),
            success: successFunc,
            error: failFunc
        });
        return this;
    },
    /**
     * Highlights field error according to data-* attributes defined rules
     * 
     * @param {Object} $input jQuery field object to highlight
     * 
     * @return {Object}      $$.fjs.forms
     */
    highlightFieldError: function($input) {
        var $form = $input.parents('form');
        //Getting CSS params
        var errorClass = $input.attr('data-fjs-error_class');
        if (errorClass) {
            $input.removeClass(errorClass);
            //Gently removing error class from related objects
            $form.find('*[data-fjs-highlight_error_for*="'+$input.attr('name')+'"]').each(function() {
                var currAttr = $$(this).attr('data-fjs-highlight_error_for');
                //If only one field specified - just remove class
                if (currAttr == $input.attr('name')) {
                    $$(this).removeClass(errorClass);
                    return;
                }
                //Go over the fields and check if other have same error class
                //and it is actually set
                var relatedFields = currAttr.split(',');
                var needClassRemove = true;
                for (var i=0,c=relatedFields.length; i<c; i++) {
                    if (relatedFields[i] == $input.attr('name'))
                        continue;
                    if ($form.find('*[name="'+relatedFields[i]+'"]').hasClass(errorClass)) {
                        needClassRemove = false;
                        break;
                    }
                }
                if (needClassRemove)
                    $$(this).removeClass(errorClass);
            });
        }
        //Clear error
        $form.find('*[data-fjs-error_for="'+$input.attr('name')+'"]').html('');
        //If validation failed
        if ($$.fjs.hasPlugin('validate') && $$.fjs.validate.fieldError($input)) {
            //Highlight error
            var error = $$.fjs.validate.fieldError($input);
            var errorText = $$.fjs.hasPlugin('lang') ? $$_(error) : error;
            $form.find('*[data-fjs-error_for="'+$input.attr('name')+'"]').html(errorText).attr('data-fjs-localizable', error);
            if (errorClass) {
                $input.addClass(errorClass);
                $form.find('*[data-fjs-highlight_error_for*="'+$input.attr('name')+'"]').addClass(errorClass);
            }
        }
        return this;
    },
    /**
     * Resets all form inputs in given container
     * 
     * @param {Object}  $container   Container to reset form inputs in
     * @param {boolean} onlyErrors   Tells to reset only errors state and don't return fields to default values
     * 
     * @return {Object} $$.fjs.forms
     */
    reset: function($container, onlyErrors) {
        if ($$.fjs.hasPlugin('validate'))
            $$.fjs.validate.reset();
        $container.find(':input').each(function() {
            $$.fjs.forms.highlightFieldError($(this));
        });
        if (!onlyErrors) {
            $container.find('form').each(function() {
                this.reset();
            });
            if ($container.is('form'))
                $container[0].reset();
        }
        return $$.fjs.forms;
    }
}