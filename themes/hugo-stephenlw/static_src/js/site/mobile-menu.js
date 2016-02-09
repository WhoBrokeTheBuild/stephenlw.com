
(function($){

    window.minMenuWidth = 260;
    window.menuWidthPerc = 0.8;

    var $mobileMenuToggle;
    var $mobileMenuWrap;
    var $pageWrap;

    $(function(){

        $mobileMenuToggle = $('.js-mobileMenuToggle');
        $mobileMenuWrap = $('.js-mobileMenuWrap');
        $pageWrap = $('.js-pageWrap');

        $mobileMenuToggle.click(function(){
            toggleMenu();
        });

        $(window).on("orientationchange, resize", function() {
            console.log('resized');
            if (isMenuShown()) {
                if ($mobileMenuToggle.is(':visible')) {

                    var winWidth = $(window).innerWidth(),
                        width = Math.max(window.minMenuWidth, winWidth * window.menuWidthPerc),
                        height = Math.max($mobileMenuWrap.height(), $pageWrap.height());

                    $mobileMenuWrap.css('width', width)
                         .css('height', height);

                    $page.css('margin-left', width);

                } else {
                    hideMenu();
                }
            }
        });

         $('#wpjs-mobile-menu li').click(function(e) {
            var $this = $(e.target);
            toggleSubMenu($this);
            e.stopPropagation();
        });
        $('#wpjs-mobile-menu a').click(function(e) {
            var $this = $(e.target);
            if ($this.attr('href') === "#") {
                toggleSubMenu($this.parent());
                e.stopPropagation();
                e.preventDefault();
            }
        });
        $('#wpjs-mobile-menu span').click(function(e) {
            var $this = $(e.target);
            toggleSubMenu($this.parent().parent());
            e.stopPropagation();
        });
    });

    function toggleSubMenu($elm) {
        if ($elm.hasClass('menu-item-has-children')) {

            var $subMenu = $elm.children('.sub-menu'),
                $parentMenu = $elm.parent(),
                parentHeight = 0, tmp = 0;

            if ($elm.hasClass('expanded')) {

                tmp = $parentMenu.height();
                $parentMenu.css('height', 'auto');
                $subMenu.css('height', 0);
                parentHeight = $parentMenu.height();
                $subMenu.css('height', 'auto');
                $parentMenu.css('height', tmp);

                $subMenu.animate({
                    height: '0'
                }, 'fast', function() {
                    $elm.removeClass('expanded');
                });

                $parentMenu.animate({
                    height: parentHeight
                }, 'fast');

            } else {

                tmp = $parentMenu.height();
                $parentMenu.css('height', 'auto');
                $subMenu.css('height', 'auto');

                var height = $subMenu.height();
                parentHeight = $parentMenu.height();
                $subMenu.css('height', 0);
                $parentMenu.css('height', tmp);

                $elm.addClass('expanded');

                $subMenu.animate({
                    height: height
                }, 'fast');

                $parentMenu.animate({
                    height: parentHeight
                }, 'fast');

            }
        }
    }

    // Forces an element to repaint.
    // Useful for elements with position: fixed that are animated.
    function forceRepaint($element) {
        $element
            .addClass('force-repaint')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('force-repaint');
            });
    }

    function showMenu() {
        var winWidth = $(window).innerWidth(),
            width = Math.max(window.minMenuWidth, winWidth * window.menuWidthPerc),
            height = Math.max($mobileMenuWrap.height(), $pageWrap.height());

        $mobileMenuWrap.css('display', 'block')
             .css('margin-top', 0)
             .css('height', height);

        $pageWrap.css('width', winWidth);

        $mobileMenuWrap.animate({
            'width': width
        }, 'fast');

        $pageWrap.animate({
            'margin-left': width
        }, 'fast');

        forceRepaint($mobileMenuWrap);

        $mobileMenuWrap.addClass('shown');
        $mobileMenuToggle.addClass('menuShown');
    }

    function hideMenu() {

        $mobileMenuWrap.animate({
            width: 0
        }, 'fast');

        $pageWrap.animate({
            marginLeft: 0
        }, 'fast', function(){
            $page.css('width', 'auto');
        });

        forceRepaint($mobileMenuWrap);

        $mobileMenuWrap.removeClass('shown');
        $mobileMenuToggle.removeClass('menuShown');
    }

    function toggleMenu() {
        if (isMenuShown()) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    function isMenuShown() {
        return $mobileMenuWrap.hasClass('shown');
    }

}(jQuery));
