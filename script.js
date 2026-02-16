// Language handling
var currentLang = 'en';

// WhatsApp configuration
var whatsappNumber = '595994677948'; // Replace with actual number
var whatsappMessages = {
    en: 'Hello! I found your website and I would like to get information about health insurance options in Paraguay.',
    de: 'Hallo! Ich habe Ihre Website gefunden und möchte Informationen über Krankenversicherungsoptionen in Paraguay erhalten.'
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitcher();
    initWhatsAppButton();
    initContactForm();
    initTestimonials();
    initFAQ();
    setLanguage('en');
});

// Language switcher
function initLanguageSwitcher() {
    var langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var lang = this.getAttribute('data-lang');
            setLanguage(lang);

            // Update button states
            langButtons.forEach(function (b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// Set language for all elements with data-en and data-de attributes
function setLanguage(lang) {
    currentLang = lang;

    var elements = document.querySelectorAll('[data-en]');

    elements.forEach(function (el) {
        var text = el.getAttribute('data-' + lang);
        if (text) {
            // Check element type to set text appropriately
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Update WhatsApp link
    updateWhatsAppLink();

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// WhatsApp button
function initWhatsAppButton() {
    updateWhatsAppLink();
}

function updateWhatsAppLink() {
    var whatsappBtn = document.getElementById('whatsapp-btn');
    var message = encodeURIComponent(whatsappMessages[currentLang]);
    whatsappBtn.href = 'https://wa.me/' + whatsappNumber + '?text=' + message;
}

// Contact form handling
function initContactForm() {
    var form = document.getElementById('contact-form');
    var successMessage = document.getElementById('success-message');
    var formStatus = document.getElementById('form-status');
    var resetBtn = document.getElementById('reset-form-btn');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var submitBtn = form.querySelector('.submit-btn');
        var originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = currentLang === 'en' ? 'Sending...' : 'Senden...';
        formStatus.style.display = 'none';

        // Prepare data for Web3Forms
        var formData = new FormData(form);
        var object = Object.fromEntries(formData);
        var json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Success
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    form.reset();
                } else {
                    // Error from API
                    console.log(response);
                    formStatus.textContent = json.message || 'Something went wrong. Please try again.';
                    formStatus.style.color = 'red';
                    formStatus.style.display = 'block';
                }
            })
            .catch(error => {
                // Network error
                console.log(error);
                formStatus.textContent = 'Something went wrong. Please try again.';
                formStatus.style.color = 'red';
                formStatus.style.display = 'block';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText; // Note: This might need re-translating if lang changed, but simple reset is fine

                // Re-apply current language to button to be safe
                var langAttr = submitBtn.getAttribute('data-' + currentLang);
                if (langAttr) submitBtn.textContent = langAttr;
            });
    });

    // Reset button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        });
    }
}

// Testimonials carousel
function initTestimonials() {
    var testimonials = document.querySelectorAll('.testimonial');
    var dotsContainer = document.querySelector('.testimonial-dots');
    var currentIndex = 0;
    var intervalTime = 6000;
    var autoPlayTimer;

    if (testimonials.length === 0) return;

    // Create dots
    testimonials.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
        dot.addEventListener('click', function () {
            goToSlide(i);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    var dots = document.querySelectorAll('.testimonial-dot');
    var carousel = document.querySelector('.testimonial-carousel');

    // Set carousel height to tallest testimonial to prevent page jumps
    function setCarouselHeight() {
        var maxHeight = 0;
        testimonials.forEach(function (t) {
            t.style.position = 'relative';
            t.style.opacity = '1';
            var h = t.offsetHeight;
            if (h > maxHeight) maxHeight = h;
            t.style.position = '';
            t.style.opacity = '';
        });
        carousel.style.minHeight = maxHeight + 'px';
    }

    setCarouselHeight();
    window.addEventListener('resize', setCarouselHeight);

    function goToSlide(index) {
        testimonials[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        currentIndex = index;
        testimonials[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    function nextSlide() {
        var next = (currentIndex + 1) % testimonials.length;
        goToSlide(next);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, intervalTime);
    }

    // Start auto-play
    autoPlayTimer = setInterval(nextSlide, intervalTime);
}

// FAQ Accordion
function initFAQ() {
    var faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            var answer = this.nextElementSibling;

            // Close all other FAQs
            faqQuestions.forEach(function (q) {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current FAQ
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}
