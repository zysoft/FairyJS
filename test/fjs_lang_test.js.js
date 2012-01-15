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

//Registering lang
$$.fjs.lang.add('en-us', {
    'Test %1, %2, %3': 'Test %3, %1, %2'
});
$(function(){
    module("fjs_lang.js");
    test("Localization test", function() {
        $$.fjs.lang.set('en-us');
        equal($$_('Test %1, %2, %3', 1, 2, 3), 'Test 3, 1, 2', 'Localization shortuct with integrated params parser')
        equal($$_('Test %1, %2, %3').withVals(1,2,3), 'Test 3, 1, 2', 'Localization shortuct without integrated params parser')
    });
});