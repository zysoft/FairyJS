/* FairyJS zysoft.github.com/FairyJS | github.com/zysoft/FairyJS/blob/master/LICENSE */
$$.fjs.forms={register:function(){if(!$$.fjs.hasPlugin("validate")){return}var a=function(c){var b=$$.fjs.validate.field(c);$$.fjs.forms.highlightFieldError(c);return b};$$(document).on("blur",':input[data-fjs-validate="blur"]',function(){a($$(this))}).on("keyup",':input[data-fjs-validate="keypress"]',function(){a($$(this))}).on("click",':input[data-fjs-validate="click"]',function(){a($$(this))}).on("submit","form",function(){var c=true;var b=$$(this);b.find("*[data-fjs-error_for]").html("");b.find(":input").each(function(){c=a($$(this))&&c});if(c&&b.attr("data-fjs-form-ajax")){$$.fjs.forms.ajaxSubmit(b);return false}return c})},ajaxSubmit:function(a){var d=a.attr("method");var c=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.success",e,f)}}(a);var b=function(e){return function(f){$$.fjs.fire("org.fjs.form.submit.error",e,f)}}(a);$.ajax({url:a.attr("action"),type:d?d:"get",data:a.serialize(),success:c,error:b});return this},highlightFieldError:function(e){var c=e.parents("form");var b=e.attr("data-fjs-error_class");if(b){e.removeClass(b);c.find('*[data-fjs-highlight_error_for*="'+e.attr("name")+'"]').each(function(){var h=$$(this).attr("data-fjs-highlight_error_for");if(h==e.attr("name")){$$(this).removeClass(b);return}var f=h.split(",");var j=true;for(var g=0,k=f.length;g<k;g++){if(f[g]==e.attr("name")){continue}if(c.find('*[name="'+f[g]+'"]').hasClass(b)){j=false;break}}if(j){$$(this).removeClass(b)}})}c.find('*[data-fjs-error_for="'+e.attr("name")+'"]').html("");if($$.fjs.validate.fieldError(e)){var d=$$.fjs.validate.fieldError(e);var a=$$.fjs.hasPlugin("lang")?$$_(d):d;c.find('*[data-fjs-error_for="'+e.attr("name")+'"]').html(a).attr("data-fjs-localizable",d);if(b){e.addClass(b);c.find('*[data-fjs-highlight_error_for*="'+e.attr("name")+'"]').addClass(b)}}return this}};