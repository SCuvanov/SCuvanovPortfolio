(function($) {
    "use strict";
    $(document).ready(function() {
        var $window = $(window);
        var $navbar = $('#navbar');
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var CONTENT_URL = 'assets/data/site-content.json';

        function updateNavbarState() {
            if ($window.width() > 768 && $window.scrollTop() > 55) {
                $navbar.addClass('navbar-bg');
            } else {
                $navbar.removeClass('navbar-bg');
            }
        }

        $window.on('scroll resize', updateNavbarState);
        updateNavbarState();

        function initWidgets() {
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

        function applyRevealEffects() {
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
        }

        function buildKnowledgeCards(cards) {
            var html = cards.map(function(card, index) {
                var icons = (card.icons || []).map(function(icon) {
                    return '<i class="fa fa-' + icon + '"></i>';
                }).join(' ');
                var paragraphs = (card.paragraphs || []).map(function(text) {
                    return '<p>' + text + '</p>';
                }).join('');
                var cardMarginClass = index > 2 ? ' xs-mb40' : ' mb40';

                return (
                    '<div class="col-md-4 col-sm-4">' +
                        '<div class="feature-box' + cardMarginClass + '">' +
                            '<div class="feature-title">' +
                                icons +
                                '<h4>' + card.title + '</h4>' +
                            '</div>' +
                            '<div class="feature-content">' + paragraphs + '</div>' +
                        '</div>' +
                    '</div>'
                );
            }).join('');

            $('#knowledge-cards').html(html);
        }

        function buildExperience(items) {
            var html = items.map(function(item) {
                var contentClass = item.dateOnLeft ? 'content' : 'content text-right';
                var leftDate = (
                    '<div class="col-md-3 col-sm-3">' +
                        '<div class="duration">' + item.duration + '</div>' +
                    '</div>'
                );
                var rightDate = leftDate;
                var content = (
                    '<div class="col-md-9 col-sm-9">' +
                        '<div class="' + contentClass + '">' +
                            '<h4 class="title">' + item.company + '</h4>' +
                            '<p class="designation">' + item.title + '</p>' +
                            '<p>' + item.description + '</p>' +
                        '</div>' +
                    '</div>'
                );

                return (
                    '<div class="experience-item row mb40">' +
                        (item.dateOnLeft ? leftDate + content : content + rightDate) +
                    '</div>'
                );
            }).join('');

            $('#experience-items').html(html);
        }

        function buildPortfolio(items) {
            var html = items.map(function(item) {
                var widthClass = item.wide ? ' grid-item--width2' : '';
                return (
                    '<div class="portfolio-item grid-item' + widthClass + '">' +
                        '<div class="portfolio-thumb">' +
                            '<img src="' + item.image + '" alt="' + item.title + '">' +
                            '<div class="overley">' +
                                '<div class="portfolio-title">' +
                                    '<a href="' + item.image + '" class="img-lightbox"><i class="fa fa-search"></i></a>' +
                                    '<h4><a href="' + item.projectLink + '" class="btn btn-primary">' + item.title + '</a></h4>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );
            }).join('');

            $('#portfolio-items').html(html);
        }

        function renderContentFromData() {
            return $.getJSON(CONTENT_URL).done(function(data) {
                if (data.knowledgeCards) {
                    buildKnowledgeCards(data.knowledgeCards);
                }
                if (data.experienceItems) {
                    buildExperience(data.experienceItems);
                }
                if (data.portfolioItems) {
                    buildPortfolio(data.portfolioItems);
                }
            }).always(function() {
                initWidgets();
                applyRevealEffects();
            });
        }

        renderContentFromData();
    });

})(jQuery);