/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Test Suite
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

$(function(){
    module('fjs_validate.js');

    test('Field validation', function() {
        var $testInput = $('<input/>');
        $testInput.attr({
            'data-fjs-validator':'int',
            'data-fjs-int_error_message':'Should be integer!'
        });
        equal($$.fjs.validate.field($testInput), true, 'Not required field valid while empty');
        $testInput.val('a');
        equal($$.fjs.validate.field($testInput), false, 'Value `a` is not a valid integer');
        equal($$.fjs.validate.fieldError($testInput), 'Should be integer!', 'Error message matches one set with `data-fjs-int_error_message`');
    });
    
    test('Built-in validators', function() {
        var exec = function(validator, value, config) {
            return $$.fjs.validate[validator]['func'](value, $$.extend({}, $$.fjs.validate[validator]['config'], config));
        };
        //Int
        ok(exec('int', 0), 'Validator `Int`. Int value recognized');
        ok(exec('int', 5), 'Validator `Int`. Int value recognized');
        ok(exec('int', -100), 'Validator `Int`. Int value recognized');
        equal(exec('int', 'string'), false, 'Validator `Int`. String value is not valid');
        equal(exec('int', 5.4), false, 'Validator `Int`. Float value is not valid');
        equal(exec('int', undefined), false, 'Validator `Int`. Undefined value is not valid');
        
        //Float
        ok(exec('float', 3.0), 'Validator `Float`. Float value recognized');
        ok(exec('float', 0.5), 'Validator `Float`. Float value recognized');
        ok(exec('float', -10.2), 'Validator `Float`. Float value recognized');
        ok(exec('float', 32768), 'Validator `Float`. Int value is also valid');
        equal(exec('float', 'string'), false, 'Validator `Float`. String value is not valid');
        equal(exec('float', undefined), false, 'Validator `Float`. Undefined value is not valid');
        
        //Email
        ok(exec('email', 'email@test.com'), 'Validator `Email`. email@test.com recognized');
        ok(exec('email', 'very.~complex_!email@mail.com.ua'), 'Validator `Email`. very.~complex_!email@mail.com.ua recognized');
        equal(exec('email', 'email@.com'), false, 'Validator `Email`. email@.com is wrong');
        equal(exec('email', '@site.com'), false, 'Validator `Email`. @site.com is wrong');

        //Regexp
        ok(exec('regexp', 'Test', {'regex' : '^\\w{4,5}$'}), 'Validator `Regexp`. Value `Test` matched \\w{4,5}$');
        ok(exec('regexp', 'Test2', {'regex' : '^\\w{4,5}$'}), 'Validator `Regexp`. Value `Test2` matched \\w{4,5}$');
        ok(exec('regexp', '12345', {'regex' : '^\\w{4,5}$'}), 'Validator `Regexp`. Value `12345` matched \\w{4,5}$');
        equal(exec('regexp', 'Tst', {'regex' : '^\\w{4,5}$'}), false, 'Validator `Regexp`. Value `Tst` did not match \\w{4,5}$');
        equal(exec('regexp', 'L o g', {'regex' : '^\\w{4,5}$'}), false, 'Validator `Regexp`. Value `L o g` did not match \\w{4,5}$');
        equal(exec('regexp', 'LongTest', {'regex' : '^\\w{4,5}$'}), false, 'Validator `Regexp`. Value `LongTest` did not match \\w{4,5}$');
        
       
        //Match field
        var $input = [];
        $input.push($('<input/>').attr('name', 'testInput1').val('testVal1').appendTo('body'));
        $input.push($('<input/>').attr('name', 'testInput2').val('testVal1').appendTo('body'));
        $input.push($('<input/>').attr('name', 'testInput3').val('testVal3').appendTo('body'));
        
        ok(exec('match_field', $('input[name="testInput1"]').val(), {selector: 'input[name="testInput2"]'}), 'Validator `March Field`. Field 1 matches field 2');
        equal(exec('match_field', $('input[name="testInput1"]').val(), {selector: 'input[name="testInput3"]'}), false, 'Validator `March Field`. Field 1 doesn\'t matches field 3');
        
        for (var i in $input) $input[i].remove();
        
    });
});