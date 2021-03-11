/**
 * ===================================================================
 * main js
 *
 * -------------------------------------------------------------------
 */

"use strict";

/*---------------------------------------------------- */

/* Preloader
------------------------------------------------------ */
window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    var preLoader = document.getElementById("preloader");

    loader.classList.add('m-fadeOut-slow');
    setTimeout(function () {
        preLoader.classList.add('m-fadeOut-slow');
        setTimeout(function () {
            preLoader.style.display = 'none';
        }, 200);
    }, 200);
});

/*---------------------------------------------------- */
/* FitText Settings
------------------------------------------------------ */
window.fitText(document.querySelector("#intro h1"), {minFontSize: '42px', maxFontSize: '84px'});


/*---------------------------------------------------- */
/* Smooth Scrolling
------------------------------------------------------ */
var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500,
    speedAsDuration: true
});


/*----------------------------------------------------- */
/* Back to top
------------------------------------------------------- */
var pxShow = 300; // height on which the button will show

//Get the button:
var backToTopButton = document.getElementById('go-top');

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    if (document.body.scrollTop > pxShow || document.documentElement.scrollTop > pxShow) {
        backToTopButton.classList.add('m-fadeIn');
        backToTopButton.classList.remove('m-fadeOut');
    } else {
        backToTopButton.classList.add('m-fadeOut');
        backToTopButton.classList.remove('m-fadeIn');
    }
};
