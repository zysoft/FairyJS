$(function() {
    SyntaxHighlighter.defaults['quick-code'] = false;
    var cpdt = function() {
        var dt = 2011, dtn = new Date().getFullYear();
        if (dtn > dt)
            dt = dt.toString() + ' - ' + dtn.toString();
        else 
            dt = dt.toString();

        $('.date').html(dt);        
    }
    if (!document.location.hash.length) {
        document.location.hash = '#about';
    }
    
    $(window).resize(function() {
        $('#right').height($(window).height() - $('#top').outerHeight() - 5);
        
    }).resize();

    $('#top li ul').each(function() {
        $(this).parent().mouseover(function() {
            $(this).find('ul').show();
        }).mouseleave(function() {
            $(this).find('ul').hide();
        });
    });

    $('input[name="search"]').parents('form').submit(function() {
        var tokens = $.trim($('input[name="search"]').val());
        if (tokens.length == 0)
            return false;
        document.location.hash='#search_'+tokens.replace(' ','_');
        $('#loader').show();
        $('#right .inner').html('<h1>Search results</h1>');
        window.srchQueue = $('#top ul a').length;
        $('#top ul a').each(function() {
            var $href = $(this);
            $.ajax({
                url: 'inner/'+$href.attr('href').substr(1)+'.html?r='+Math.random(),
                type: 'get',
                success: function(response) {
                    window.srchQueue--;
                    var cleanRegex = /([\$\/\^\(\)\[\]\.\-\*\+])/g;
                    var tokenRegex = new RegExp(tokens.replace(cleanRegex, '\\$1').replace(' ', '.*?'), 'gim');
                    var output = [];
                    var queue = [$('<div>'+response+'</div>')[0]],curr;
                    while (curr = queue.pop()) {
                        var currText;
                        if (undefined != curr.textContent) 
                            currText = curr.textContent;
                        else 
                            currText = curr.innerText;
                        if (!currText.match(tokenRegex)) continue;
                        for (var i = 0; i < curr.childNodes.length; ++i) {
                            switch (curr.childNodes[i].nodeType) {
                                case 3 : // Node.TEXT_NODE
                                    if (curr.tagName == 'PRE' || curr.tagName == 'SCRIPT') {
                                        continue;
                                    }
                                    if (undefined != curr.textContent) 
                                        currText = curr.childNodes[i].textContent;
                                    else 
                                        currText = curr.childNodes[i].nodeValue;
                                    if (currText && currText.match(tokenRegex)) {
                                        output.push(currText);
                                    }
                                    break;
                                case 1 : // Node.ELEMENT_NODE
                                    queue.push(curr.childNodes[i]);
                                    break;
                            }
                        }
                    }
                    
                    if (window.srchQueue <= 0) { 
                        $('#loader').hide();
                        if ($('#right .inner h2').length == 0 && output.length == 0 && $('#right .inner .sorry').length == 0) {
                            $('<div class="sorry">Sorry, no matches found</div>').appendTo('#right .inner');
                        }
                    }
                    
                    if (output.length == 0) {
                        return;
                    }
                    var outputStr = '';
                    var tokenWords = tokens.split(' '); 
                    for (var i=0,c=output.length;i<c;i++) {
                        for (var j=0,l=tokenWords.length;j<l;j++) {
                            output[i] = output[i].replace(new RegExp('('+$.trim(tokenWords[j]).replace(cleanRegex, '\\$1')+')', 'gim'), '<strong>$1</strong>');
                        }
                        outputStr += '<div class="searchblock">'+output[i]+'</div>';
                    }
                    $('<div></div>').append($('<h2></h2>').append($href.clone())).append(outputStr).appendTo('#right .inner');

                }
            });
        });
        return false;
    });
    
    
    var wtm;
    (function(){
        clearTimeout(wtm);
        if (!this.oldhash || this.oldhash != document.location.hash) {
            $('#top li').removeClass('active')
            $('#top a[href="'+document.location.hash+'"]').parent().addClass('active').parents('li').addClass('active');
            if (!/#search_.*/.test(document.location.hash)) {
                $('#loader').show();
                $('#right .inner').html('').load('inner/'+document.location.hash.substr(1)+'.html?r='+Math.random(), function(response) {
                    $('*[id$="_src"]').each(function(){
                        var id = $(this).attr('id').replace('_src', '');
                        var scripts = response.replace(/\s*<script data-hidden(.|\n)*?>(.|\n)*?<\/script>/gi, '').match(/\s*<script (.|\n)*?>(.|\n)*?<\/script>/gi);
                        var $html = $('#'+id).clone();
                        $html.find('.hidden').each(function() {
                            $(this).replaceWith($(this).html().replace(/[ ]+/gm,' ').replace(/[\r\n]+/, "\r\n"));
                        });
                        
                        $(this).text($html.html());
                        if (scripts) {
                            scripts = scripts.join("\n").replace(/</g,'&lt;').replace(/>/g,'&gt');
                        } else 
                            scripts = '';
                        $(this).html($(this).text().replace(/</g,'&lt;').replace(/>/g,'&gt') + scripts);
                    });
                    SyntaxHighlighter.highlight();
                    $('#loader').hide();
                    cpdt();
                    $$.fjs.lang.set('en-us');
                });
            } else {
                $('input[name="search"]').val(document.location.hash.replace(/#search_(.*)/, '$1').replace('_', ' '));
                $('input[name="search"]').parents('form').submit();
            }
            this.oldhash = document.location.hash;
        }
        wtm = setTimeout(arguments.callee, 200);
    })();
});
