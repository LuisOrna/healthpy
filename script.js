// Language handling
var currentLang = 'en';

// WhatsApp configuration
var whatsappNumber = '595994677948'; // Replace with actual number
var whatsappMessages = {
    en: 'Hello! I found your website and I would like to get information about health insurance options in Paraguay.',
    de: 'Hallo! Ich habe Ihre Website gefunden und möchte Informationen über Krankenversicherungsoptionen in Paraguay erhalten.'
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initLanguageSwitcher();
    initWhatsAppButton();
    initContactForm();
    setLanguage('en');
});

// Language switcher
function initLanguageSwitcher() {
    var langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = this.getAttribute('data-lang');
            setLanguage(lang);

            // Update button states
            langButtons.forEach(function(b) {
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

    elements.forEach(function(el) {
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

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var message = document.getElementById('message').value;

        // For now, redirect to WhatsApp with the message
        // In the future, this can be connected to a backend
        var fullMessage = currentLang === 'en'
            ? 'Name: ' + name + '\nEmail: ' + email + '\nMessage: ' + message
            : 'Name: ' + name + '\nE-Mail: ' + email + '\nNachricht: ' + message;

        var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(fullMessage);
        window.open(whatsappUrl, '_blank');

        // Show confirmation
        var confirmMsg = currentLang === 'en'
            ? 'Opening WhatsApp to send your message...'
            : 'WhatsApp wird geöffnet, um Ihre Nachricht zu senden...';
        alert(confirmMsg);
    });
}
