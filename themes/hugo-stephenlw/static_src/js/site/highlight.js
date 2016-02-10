(function($, hljs){

    $(function(){
        $('pre code.highlight').each(function(i, block){
            hljs.highlightBlock(block);
        });
    });

}(jQuery, hljs));
