/* ============================
   jQuery Version of All Scripts
============================= */

$(document).ready(function () {

    /* ============================
       1️⃣ Sidebar Toggle Script
    ============================== */
    const $menuBtn = $('#menuBtn');
    const $sidebar = $('#sidebar');
    const $overlay = $('#overlay');

    if ($menuBtn.length && $sidebar.length && $overlay.length) {
        $menuBtn.on('click', function () {
            $sidebar.toggleClass('active');
            $overlay.toggleClass('active');
            $('body').css('overflow', $sidebar.hasClass('active') ? 'hidden' : '');
        });

        $overlay.on('click', function () {
            $sidebar.removeClass('active');
            $overlay.removeClass('active');
            $('body').css('overflow', '');
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $sidebar.hasClass('active')) {
                $sidebar.removeClass('active');
                $overlay.removeClass('active');
                $('body').css('overflow', '');
            }
        });

        const currentPage = window.location.pathname.split('/').pop();
        $('.sidebar-menu-item, .bottom-nav .nav-item').each(function () {
            const itemHref = $(this).attr('href');
            if (itemHref === currentPage || (currentPage === '' && itemHref === 'index.html')) {
                $(this).addClass('active');
            }
        });
    }

})