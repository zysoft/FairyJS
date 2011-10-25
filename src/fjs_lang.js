/**
 @licstart  The following is the entire license notice for the JavaScript code in this page.
    FairyJS. Your personal Javascript fairy for the website
    Localization support plugin
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

$$.fjs.plugin('lang', {
    //Currently activa language
    currentLang : $$.fjs.config.defaultLang,
    //List of all known languages (gets filled at runtime)
    knownLangs : [],
    //Plugin registration handler
    register: function() {
        var lang = $$('html').attr('fjs:lang');
        if (!lang)
            lang = $$.fjs.config.defaultLang;
        this.set(lang);
    },
    //Activate language (by lang code)
    //Loads appropriate lang file if needed
    set: function(lang) {
        this.currentLang = lang;
        if (this.knownLangs.indexOf(lang) != -1) {
            this.localizePage();
            return this;
        }
        var script = document.createElement('SCRIPT');
        script.src = $$.fjs.config.langPath+$$.fjs.config.langFile.withVal(this.currentLang)+'?r='+Math.random();
        script.type = 'text/javascript';
        document.getElementsByTagName('HEAD')[0].appendChild(script);
        return this;
    },
    //Adds entity to the translation table for the given language
    addEntity: function(langName, entity, translation) {
        var langEntity = {};
        langEntity[entity] = translation;
        $$.fjs.lang[langName] = $$.extend({}, $$.fjs.lang[langName], langEntity);
        $$.fjs.log('Added custom localization entity for '+langName);
        return this;
    },
    //Registers language definitions
    add: function(langName, definition) {
        this.knownLangs.push(langName);
        $$.fjs.lang[langName] = $$.extend({}, $$.fjs.lang[langName], definition);
        $$.fjs.log('Registered language '+langName);
        this.localizePage();
        return this;
    },
    //Loclizes entry page according to fjs:localizable attribute
    localizePage: function() {
        $$('*[fjs\\:localizable]').each(function() {
            if ($$(this).is(':input'))
                $$(this).val($$_($$(this).attr('fjs:localizable')));
            else
                $$(this).html($$_($$(this).attr('fjs:localizable')));
        });
    }
});

$$.fjs.extendConfiguration({
       langFile: 'fjs_%@.js',   //Filename template
       langPath: 'lang/',       //Path to lang files
    defaultLang: 'en-us'        //Default language
});


//Handy method to allow runtime translation
//@example $$_('Some text')
window.$$_ = function(str) {
    if ($$.fjs.lang[$$.fjs.lang.currentLang][str])
        return $$.fjs.lang[$$.fjs.lang.currentLang][str];
    if ($$.fjs.config.debugMode)
        console.warn('Unlocalized entity: ' + str);
    return str;
}