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

$$.fjs.plugin('forms', {
    //Plugin registration handler
    register: function() {
        //Don't set up validaion hooks if no validation plugin present
        if (!$$.fjs.hasPlugin('validate'))
            return;
        //Handler to process single field validation
        var singleFieldValidate = function($input) {
            //Clear error
            $$('*[data-fjs-error_for="'+$input.attr('name')+'"]').html('');
            //If validation failed
            if (!$$.fjs.validate.field($input)) {
                //Highlight error
                var error = $$.fjs.validate.fieldError($input);
                var errorText = $$.fjs.hasPlugin('lang') ? $$_(error) : error;
                $$('*[data-fjs-error_for="'+$input.attr('name')+'"]').html(errorText).attr('data-fjs-localizable', error);
                return false;
            }
            return true;
        };
        //Assign onBlur validatio
        $$(':input[data-fjs-validate="blur"]').blur(function() {singleFieldValidate($$(this));});
        //Assign onKeypress validation (which is onKeyUp)
        $$(':input[data-fjs-validate="keypress"]').keyup(function() {singleFieldValidate($$(this));});
        //Assign onSubmit handler to all forms
        $$('form').submit(function() {
            var isFormValid = true;
            $$(this).find(':input').each(function() {
                isFormValid = singleFieldValidate($$(this)) && isFormValid;
            });
            return isFormValid;
        });
    }
});