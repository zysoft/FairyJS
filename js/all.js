$(function() {
    SyntaxHighlighter.defaults['quick-code'] = false;

    if (!document.location.hash.length) {
        document.location.hash = '#about';
    }
    $(window).resize(function() {
        $('#left,#right').height($(window).height() - $('#top').outerHeight() - 5);
        $('#right').width($(window).width() - $('#left').outerWidth() - 20);
        
    }).resize();
    var wtm;
    (function(){
        clearTimeout(wtm);
        if (!this.oldhash || this.oldhash != document.location.hash) {
            $('#left a').removeClass('active')
            $('#left a[href="'+document.location.hash+'"]').addClass('active');
            $('#right img').show();
            $('#right .inner').html('').load('inner/'+document.location.hash.substr(1)+'.html', function(response) {
                SyntaxHighlighter.highlight();
                $('#right img').hide();
            });
            this.oldhash = document.location.hash;
        }
        wtm = setTimeout(arguments.callee, 200);
    })();
});

