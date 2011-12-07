parent.$('a[target="parent"]',document).live('click', function() {
    parent.location.href=parent.$(this).attr('href');
    return false;
});

parent.$('a[target="parenthash"]',document).live('click', function() {
    parent.location.hash=parent.$(this).attr('href').replace(/.*?(#.*)/g,'$1');
    return false;
});

parent.$('#right img').hide();
parent.$('#right iframe').show();