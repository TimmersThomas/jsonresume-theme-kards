/**
 * ===================================================================
 * main js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

    "use strict";

    /*---------------------------------------------------- */
    /* Preloader
    ------------------------------------------------------ */
    $(window).on('load', function () {

        // will first fade out the loading animation
        $("#loader").fadeOut("slow", function () {

            // will fade out the whole DIV that covers the website.
            $("#preloader").delay(300).fadeOut("slow");

        });

    })


    /*---------------------------------------------------- */
    /* FitText Settings
    ------------------------------------------------------ */
    window.fitText(document.querySelector("#intro h1"), {minFontSize: '42px', maxFontSize: '84px'});


    /*-----------------------------------------------------*/
    /* Navigation Menu
 ------------------------------------------------------ */
    var toggleButton = $('.menu-toggle'),
        nav = $('.main-navigation');

    // toggle button
    toggleButton.on('click', function (e) {

        e.preventDefault();
        toggleButton.toggleClass('is-clicked');
        nav.slideToggle();

    });

    // nav items
    nav.find('li a').on("click", function () {

        // update the toggle button
        toggleButton.toggleClass('is-clicked');
        // fadeout the navigation panel
        nav.fadeOut();

    });

    /*---------------------------------------------------- */
    /* Smooth Scrolling
    ------------------------------------------------------ */
    $('.smoothscroll').on('click', function (e) {

        e.preventDefault();

        var target = this.hash,
            $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 800, 'swing', function () {
            window.location.hash = target;
        });

    });

    /*----------------------------------------------------- */
    /* Back to top
 ------------------------------------------------------- */
    var pxShow = 300; // height on which the button will show
    var fadeInTime = 400; // how slow/fast you want the button to show
    var fadeOutTime = 400; // how slow/fast you want the button to hide
    var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

    // Show or hide the sticky footer button
    jQuery(window).scroll(function () {

        if (!($("#header-search").hasClass('is-visible'))) {

            if (jQuery(window).scrollTop() >= pxShow) {
                jQuery("#go-top").fadeIn(fadeInTime);
            } else {
                jQuery("#go-top").fadeOut(fadeOutTime);
            }

        }

    });

})(jQuery);