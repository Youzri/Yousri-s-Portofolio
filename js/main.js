
/*
  ========================================
  Main JavaScript File
  ========================================
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70, // Account for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // Testimonial Slider
  initTestimonialSlider();

  // Contact Form Handling
  initContactForm();

  // Title Changer
  const titles = ["Data Analyst", "Automation Specialist", "Media Buyer", "Business consultant","Web Developer"];
  const titleElement = document.querySelector(".hero-content h2");
  let currentIndex = 0;

  function changeTitle() {
    titleElement.style.opacity = 0; // Fade out

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      titleElement.textContent = titles[currentIndex];
      titleElement.style.opacity = 1; // Fade in
    }, 500); // Corresponds to the transition duration
  }

  if (titleElement) {
    setInterval(changeTitle, 2000); // Change title every 2 seconds
  }
});

function initTestimonialSlider() {
  const container = document.querySelector('.testimonial-container');
  const slider = document.querySelector('.testimonial-slider');
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.control-prev');
  const nextBtn = document.querySelector('.control-next');
  const indicators = document.querySelectorAll('.indicator');

  if (!container || !slider || !track || !cards.length) return;

  let currentIndex = 0;
  let slideInterval;

  const updateSlider = () => {
    // Calculate the offset needed to center the active card
    const cardWidth = cards[0].offsetWidth;
    const sliderWidth = slider.offsetWidth;
    // The gap is 4% of the slider's width, as defined in the CSS
    const gapWidth = sliderWidth * 0.04;
    const totalCardSpace = cardWidth + gapWidth;
    
    // This calculation centers the current card
    const offset = (sliderWidth - cardWidth) / 2;
    const transformValue = -(currentIndex * totalCardSpace) + offset;
    
    track.style.transform = `translateX(${transformValue}px)`;

    // Apply the 'active' class to the centered card
    cards.forEach((card, index) => {
      card.classList.toggle('active', index === currentIndex);
    });

    // Update indicators
    if (indicators.length > 0) {
      indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === currentIndex);
      });
    }
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
  };

  const stopSlide = () => {
    clearInterval(slideInterval);
  };

  const startSlide = () => {
    stopSlide();
    slideInterval = setInterval(next, 5000);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      next();
      startSlide(); // Reset timer
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prev();
      startSlide(); // Reset timer
    });
  }
  
  if (indicators.length > 0) {
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            startSlide(); // Reset timer
        });
    });
  }

  container.addEventListener('mouseenter', stopSlide);
  container.addEventListener('mouseleave', startSlide);

  // Initial setup
  updateSlider();
  startSlide();
}

/*
  ========================================
  Contact Form Handling
  ========================================
*/
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!contactForm || !formStatus) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const data = new FormData(form);
    
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';

    fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
        formStatus.className = 'form-status success';
        form.reset();
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      } else {
        response.json().then(data => {
          if (Object.hasOwn(data, 'errors')) {
            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
          } else {
            formStatus.textContent = 'Oops! There was a problem submitting your form';
          }
          formStatus.className = 'form-status error';
        })
      }
    }).catch(error => {
      formStatus.textContent = 'Oops! There was a problem submitting your form';
      formStatus.className = 'form-status error';
    });
  });
}

/*
  ========================================
  Scroll Animation
  ========================================
*/
// Add scroll animations by revealing elements as they enter viewport
window.addEventListener('load', function() {
  // Add animation classes to elements that should animate on scroll
  const animateElements = document.querySelectorAll('.section-title, .section-subtitle, .project-card, .skill-item, .testimonial-card, .contact-container, .booking-container');
  
  // Set initial state (invisible)
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
    );
  }
  
  // Function to reveal elements when they enter viewport
  function revealElements() {
    animateElements.forEach(el => {
      if (isInViewport(el)) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Check on scroll
  window.addEventListener('scroll', revealElements);
  
  // Check on initial load
  revealElements();
});
