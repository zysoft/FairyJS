/* FairyJS zysoft.github.com/FairyJS | github.com/zysoft/FairyJS/blob/master/LICENSE */
$$.fjs.forms={register:function(){if(!$$.fjs.hasPlugin("validate")){return}var a=function(c){var b=$$.fjs.validate.field(c);$$.fjs.forms.highlightFieldError(c);return b};$$(document).on("blur",':input[data-fjs-validate="blur"]',function(){a($$(this))}).on("keyup",':input[data-fjs-validate="keypress"]',function(){a($$(this))}).on("click",':input[data-fjs-validate="click"]',function(){a($$(this))}).on("submit","form",function(){var c=true;var b=$$(this);$$("*[data-fjs-error_for]").html("");b.find(":input").each(function(){c=a($$(this))&&c});if(c&&b.attr("data-fjs-form-ajax")){$$.fjs.forms.ajaxSubmit(b);return false}return c})},ajaxSubmit:function(a){var d=a.attr("method");var c=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.success",e,f)}}(a);var b=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.error",e,f)}}(a);$.ajax({url:a.attr("action"),type:d?d:"get",data:a.serialize(),success:c,error:b});return this},highlightFieldError:function(d){var b=d.attr("data-fjs-error_class");if(b){d.removeClass(b);$$('*[data-fjs-highlight_error_for*="'+d.attr("name")+'"]').each(function(){var g=$$(this).attr("data-fjs-highlight_error_for");if(g==d.attr("name")){$$(this).removeClass(b);return}var e=g.split(",");var h=true;for(var f=0,j=e.length;f<j;f++){if(e[f]==d.attr("name")){continue}if($$('*[name="'+e[f]+'"]').hasClass(b)){h=false;break}}if(h){$$(this).removeClass(b)}})}$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html("");if($$.fjs.validate.fieldError(d)){var c=$$.fjs.validate.fieldError(d);var a=$$.fjs.hasPlugin("lang")?$$_(c):c;$$('*[data-fjs-error_for="'+d.attr("name")+'"]').html(a).attr("data-fjs-localizable",c);if(b){d.addClass(b);$$('*[data-fjs-highlight_error_for*="'+d.attr("name")+'"]').addClass(b)}}return this}};
