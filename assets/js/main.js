(function($) {
    "use strict";
    $(document).ready(function() {
        var $window = $(window);
        var $navbar = $('#navbar');
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function updateNavbarState() {
            if ($window.width() > 768 && $window.scrollTop() > 55) {
                $navbar.addClass('navbar-bg');
            } else {
                $navbar.removeClass('navbar-bg');
            }
        }

        $window.on('scroll resize', updateNavbarState);
        updateNavbarState();

        if ($.fn.isotope) {
            $('.portfolio-wrap').isotope({
                itemSelector: '.portfolio-item',
            });
        }

        if ($.fn.venobox) {
            $('.img-lightbox').venobox({
                spinner: 'double-bounce',
            });
        }

        if ($.fn.appear) {
            $('.progress-bar').each(function() {
                var width = $(this).data('percent');
                $(this).css({ 'transition': 'width 3s' });
                $(this).appear(function() {
                    $(this).css('width', width + '%');
                });
            });
        }

        if ($.fn.owlCarousel) {
            $('.testimonial-carousel').owlCarousel({
                items: 1,
                autoplay: true,
                nav: false,
                loop: true,
                smartSpeed: 1000,
                animateOut: 'fadeInDown',
                animateIn: 'fadeOutDown',
            });
        }

        $('a.scroll').on('click', function(event) {
            var $anchor = $(this);
            var target = $($anchor.attr('href'));
            if (!target.length) {
                return;
            }

            if (reduceMotion) {
                window.scrollTo(0, target.offset().top - 72);
            } else {
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 72
                }, 900, 'easeInOutExpo');
            }
            event.preventDefault();
        });

        $('body').scrollspy({ target: '#navbar', offset: 90 });

        var revealNodes = document.querySelectorAll(
            '.experience-item, .feature-box, .portfolio-item, .contact-form, .bio-table, .hero-banner-content'
        );

        revealNodes.forEach(function(node) {
            node.classList.add('reveal');
        });

        if ('IntersectionObserver' in window) {
            var revealObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealNodes.forEach(function(node) {
                revealObserver.observe(node);
            });
        } else {
            revealNodes.forEach(function(node) {
                node.classList.add('is-visible');
            });
        }
    });

})(jQuery);