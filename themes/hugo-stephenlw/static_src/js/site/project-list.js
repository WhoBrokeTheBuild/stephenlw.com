
(function($){

    $(function(){

        if ($('.js-projectList').length)
        {
            $(window).scroll(function(){
                var scrollY = $(window).scrollTop();
                var $listItems = $('.js-projectListItem');
                var $listWrap = $('.js-projectListWrap');

                if (scrollY === 0)
                {
                    $listItems.removeClass('hover');
                    $listWrap.removeClass('hover');
                    return;
                }

                var found = false;
                for (var i = 0; i < $listItems.length; ++i)
                {
                    var $listItem = $($listItems[i]);
                    if (!found && $listItem.offset().top > scrollY)
                    {
                        $listItem.addClass('hover');
                        $listWrap.addClass('hover');
                        found = true;
                    }
                    else
                    {
                        $listItem.removeClass('hover');
                    }
                }
            });
        }

    });

}(jQuery));
