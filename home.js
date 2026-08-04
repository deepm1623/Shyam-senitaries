(function () {
  'use strict';

  window.scrollToNextSection = function () {
    const section = document.querySelector('.discount-info');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  window.scrollToFeatures = function () {
    const section = document.querySelector('.features');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  function initWavinAnimation() {
    const card = document.querySelector('.wavin-supreme-card');
    if (!card) return;

    card.classList.remove('show-text', 'show-supreme');

    function startAnimation() {
      card.classList.remove('show-text', 'show-supreme');

      setTimeout(() => {
        card.classList.add('show-text');

        setTimeout(() => {
          card.classList.remove('show-text');
          card.classList.add('show-supreme');
        }, 6000);
      }, 1000);
    }

    setTimeout(startAnimation, 2000);
  }

  function initStatCounters() {
    function animateCounter(element, target, duration) {
      duration = duration || 2000;
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(start);
        }
      }, 16);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const statNumber = entry.target.querySelector('.stat-number');
          if (!statNumber || statNumber.classList.contains('animated')) return;
          const target = parseInt(statNumber.getAttribute('data-target'), 10);
          statNumber.classList.add('animated');
          animateCounter(statNumber, target);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat-card').forEach((card) => observer.observe(card));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initWavinAnimation();
    initStatCounters();
  });
})();

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value;
  const phone = form.phone.value;
  const email = form.email.value;
  const message = form.message.value;

  const subject = encodeURIComponent('Contact Form Submission from ' + name);
  const body = encodeURIComponent(
    'Name: ' + name + '\n' +
    'Phone: ' + phone + '\n' +
    'Email: ' + email + '\n\n' +
    'Message:\n' + message
  );

  window.location.href = 'mailto:mahendramakwana446@gmail.com?subject=' + subject + '&body=' + body;

  if (typeof showSuccess !== 'undefined') {
    setTimeout(() => {
      showSuccess('Your message has been prepared. Please send it from your email client.', 'Message Ready');
    }, 500);
  }

  form.reset();
}
