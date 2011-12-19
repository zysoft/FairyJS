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
    module("fjs_core.js");

    test("Plugin subsystem", function () {
        equal($$.fjs.hasPlugin('samplePlugin'), true, "Plugin should be known by core");
        notEqual($$.fjs.samplePlugin.testVar, null, "Plugin test var should not be null");
        equal($$.fjs.samplePlugin.testVar, 5, "Plugin test var should be `5`");
        equal($$.fjs.samplePlugin.testMethod(-2), -2, "Sample method should return `-2`");
    });
    test("Core configuration", function() {
        equal($$.fjs.config.debugMode, false, "Debug mode should be disabled by default");
        equal($$.fjs.config.verboseMode, false, "Verbose mode should be disabled by default");
        $$.fjs.configure({
            debugMode : true,
            verboseMode : true
        });
        equal($$.fjs.config.debugMode, true, "Debug mode should be enabled after $$.fjs.configure");
        equal($$.fjs.config.verboseMode, true, "Verbose mode should be enabled after $$.fjs.configure");
                    
    });
    test("Plugin configuration", function() {
        equal($$.fjs.config.testParam, undefined, "Test parameter should be undefined");
        $$.fjs.extendConfiguration({
            testParam : false
        });
        notEqual($$.fjs.config.testParam, undefined, "Test parameter should NOT be undefined after config extension");
        equal($$.fjs.config.testParam, false, "Test parameter should be `false` after config extension");
        $$.fjs.configure({
            testParam : true
        });
        equal($$.fjs.config.testParam, true, "Test parameter should be `true` after $$.fjs.configure");
    });
    test("Log methods", function() {
        ok($$.fjs.log("Test log message"), "Log method worked with no exception");
        ok($$.fjs.warn("Test warning message"), "Warn method worked with no exception");
        ok($$.fjs.error("Test error message"), "Error method worked with no exception");
    });
    test("Events management", function() {
        ok(Boolean($$.fjs.fire('org.fjs.test.event')), "$$.fjs.fire worked with no exception");
        ok(Boolean($$.fjs.subscribe('org.fjs.test.event', function($ev, testData) {
            ok(true, "`org.fjs.test.event` handler executed");
            equal(testData, -3, "Event eclosed data should be equal to `-3`");
        })), "$$.fjs.subscribe executed without exception");
        ok(Boolean($$.fjs.fire('org.fjs.test.event', -3)), "$$.fjs.fire worked with no exception");
        ok(Boolean($$.fjs.unsubscribe('org.fjs.test.event')), "$$.fjs.unsubscribe executed without exception");
        ok(Boolean($$.fjs.fire('org.fjs.test.event', -3)), "$$.fjs.fire worked with no exception");
    });
});