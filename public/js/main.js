document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Portfolio category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.dataset.category;

            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Typewriter effect
    class TypeWriter {
        constructor(element) {
            this.element = element;
            this.words = JSON.parse(element.getAttribute('data-text'));
            this.wait = 3000; // Time to wait between words (3 seconds)
            this.currentText = '';
            this.wordIndex = 0;
            this.isDeleting = false;
            this.type();
        }

        type() {
            // Current word index
            const currentWord = this.words[this.wordIndex];
            
            // Get text based on whether deleting or typing
            if(this.isDeleting) {
                this.currentText = currentWord.substring(0, this.currentText.length - 1);
            } else {
                this.currentText = currentWord.substring(0, this.currentText.length + 1);
            }

            // Insert text into element
            this.element.innerHTML = this.currentText;

            // Initial typing speed
            let typeSpeed = 100;

            if(this.isDeleting) {
                typeSpeed /= 2; // Faster when deleting
            }

            // Check if word is complete
            if(!this.isDeleting && this.currentText === currentWord) {
                // Pause at end of word
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if(this.isDeleting && this.currentText === '') {
                this.isDeleting = false;
                // Move to next word
                this.wordIndex = (this.wordIndex + 1) % this.words.length;
                typeSpeed = 500; // Pause before typing next word
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Init typewriter
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        new TypeWriter(typewriterElement);
    }

    // Screenshot Carousel
    const carousel = document.querySelector('.screenshot-carousel');
    if (carousel) {
        const screenshots = carousel.querySelectorAll('.screenshot');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentIndex = 0;

        // Show first screenshot
        screenshots[0].classList.add('active');

        function showScreenshot(index) {
            screenshots.forEach(shot => shot.classList.remove('active'));
            screenshots[index].classList.add('active');
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
            showScreenshot(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % screenshots.length;
            showScreenshot(currentIndex);
        });

        // Auto-advance carousel
        setInterval(() => {
            currentIndex = (currentIndex + 1) % screenshots.length;
            showScreenshot(currentIndex);
        }, 5000);
    }

    // Profile Carousel
    const profileCarousel = document.querySelector('.profile-carousel');
    if (profileCarousel) {
        const slides = profileCarousel.querySelectorAll('.profile-slide');
        const indicators = profileCarousel.querySelectorAll('.indicator');
        let currentSlide = 0;
        let isAnimating = false;

        function showSlide(index) {
            if (isAnimating) return;
            isAnimating = true;

            // Remove active class from current slide and indicator
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');

            // Add active class to new slide and indicator
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');

            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }

        // Auto advance slides
        setInterval(() => {
            showSlide((currentSlide + 1) % slides.length);
        }, 5000);

        // Click handlers for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        profileCarousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        profileCarousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left
                    showSlide((currentSlide + 1) % slides.length);
                } else {
                    // Swipe right
                    showSlide((currentSlide - 1 + slides.length) % slides.length);
                }
            }
        }
    }

    // Add to your existing JavaScript
    document.querySelectorAll('.form-group textarea').forEach(textarea => {
        const charCount = document.createElement('span');
        charCount.className = 'char-count';
        textarea.parentNode.appendChild(charCount);

        textarea.addEventListener('input', () => {
            const remaining = textarea.maxLength - textarea.value.length;
            charCount.textContent = `${remaining} characters remaining`;
        });
    });

    // Form validation
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.checkValidity()) {
                input.parentNode.classList.add('valid');
                input.parentNode.classList.remove('invalid');
            } else {
                input.parentNode.classList.add('invalid');
                input.parentNode.classList.remove('valid');
            }
        });
    });

    // Contact form submission
    document.querySelector('.contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success modal
                const modal = document.getElementById('submissionModal');
                modal.classList.add('active');
                e.target.reset();

                // Close modal when clicking the button
                modal.querySelector('.close-modal').addEventListener('click', () => {
                    modal.classList.remove('active');
                });

                // Close modal when clicking outside
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
            } else {
                alert('There was an error submitting the form. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });

    // Intersection Observer for service cards
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all service cards
    document.querySelectorAll('.service-card.animate').forEach(card => {
        observer.observe(card);
    });
}); 