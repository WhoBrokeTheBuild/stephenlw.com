
(function($){

    $(function(){

        if ($('.js-projectList').length)
        {
            $(window).scroll(function(){
                var scrollY = $(window).scrollTop(),
                    scrollMid = scrollY + ($(window).height() / 3),
                    $listItems = $('.js-projectListItem'),
                    $listWrap = $('.js-projectListWrap');

                if (scrollY === 0)
                {
                    $listItems.removeClass('hover');
                    $listWrap.removeClass('hover');
                    return;
                }

                var found = false;
                for (var i = 0; i < $listItems.length; ++i)
                {
                    var $listItem = $($listItems[i]),
                        itemOffsetY = $listItem.offset().top;

                    if (!found &&
                        itemOffsetY > scrollY &&
                        itemOffsetY + $listItem.height() > scrollMid)
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
