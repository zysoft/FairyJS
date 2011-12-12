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
        var resultsFound = false;
        $('#top ul a').each(function() {
            var $href = $(this);
            $.ajax({
                url: 'inner/'+$href.attr('href').substr(1)+'.html?r='+Math.random(),
                type: 'get',
                success: function(response) {
                    var tokenRegex = new RegExp(tokens.replace(/([\$\/\^\(\)\[\]])/g, '\\$1').replace(' ', '.*?'), 'gim');
                    var output = [];
                    var queue = [$('<div>'+response+'</div>')[0]],curr;
                    while (curr = queue.pop()) {
                        if (!curr.textContent.match(tokenRegex)) continue;
                        for (var i = 0; i < curr.childNodes.length; ++i) {
                            switch (curr.childNodes[i].nodeType) {
                                case Node.TEXT_NODE : // 3
                                    if (curr.tagName == 'PRE' || curr.tagName == 'SCRIPT') {
                                        continue;
                                    }
                                    if (curr.childNodes[i].textContent.match(tokenRegex)) {
                                        output.push(curr.childNodes[i].textContent);
                                    }
                                    break;
                                case Node.ELEMENT_NODE : // 1
                                    queue.push(curr.childNodes[i]);
                                    break;
                            }
                        }
                    }
                    if (output.length == 0) {
                        return;
                    }
                    var outputStr = '';
                    var tokenWords = tokens.split(' '); 
                    for (var i=0,c=output.length;i<c;i++) {
                        for (var j=0,l=tokenWords.length;j<l;j++) {
                            output[i] = output[i].replace(new RegExp('('+$.trim(tokenWords[j]).replace(/([\$\/\^\(\)\[\]])/g, '\\$1')+')', 'gim'), '<strong>$1</strong>');
                        }
                        outputStr += '<div class="searchblock">'+output[i]+'</div>';
                    }
                    resultsFound = true;
                    $('<div></div>').append($('<h2></h2>').append($href.clone())).append(outputStr).appendTo('#right .inner');
                }
            });
        });
        
        $('#loader').hide();
        if (!resultsFound) {
            $('<div>Sorry, no matches found</div>').appendTo('#right .inner');
        }
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
                    SyntaxHighlighter.highlight();
                    $('#loader').hide();
                    cpdt();
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
