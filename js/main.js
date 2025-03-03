document.addEventListener('DOMContentLoaded', () => {
    // Get all nav links and tab contents
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Slideshow functionality
    let currentSlide = 0;
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    let slideInterval;

    function showSlide(n) {
        // Check if slides exist
        if (slides.length === 0) return;
        
        // Reset slide index if out of bounds
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            if (dots[i]) dots[i].classList.remove("active");
        }

        // Show current slide
        slides[currentSlide].style.display = "block";
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        showSlide(++currentSlide);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Initialize slideshow
    function initSlideshow() {
        if (slides.length === 0) return;
        showSlide(currentSlide);
        
        // Add click events to dots
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener("click", () => {
                currentSlide = i;
                showSlide(currentSlide);
                resetSlideInterval();
            });
        }
        
        resetSlideInterval();
    }

    // Function to switch tabs
    const switchTab = (tabId) => {
        // Remove active class from all tabs and contents
        navLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.querySelector(`#${tabId}`).classList.add('active');

        // Initialize functionality when switching to projects tab
        if (tabId === 'projects') {
            initProjectModals();
            // Keep slideshow initialization for backward compatibility
            initSlideshow();
        }
    };

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle hash changes for direct links
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'home';
        switchTab(hash);
    });

    // Check initial hash and initialize
    const initialHash = window.location.hash.slice(1) || 'home';
    switchTab(initialHash);

    // Project Modal Functionality
    function initProjectModals() {
        const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
        const closeModalButtons = document.querySelectorAll('.close-modal');
        const projectModals = document.querySelectorAll('.project-modal');

        // Open modal when Learn More button is clicked
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                const modal = document.getElementById(`modal-${projectId}`);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        // Close modal when close button is clicked
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.project-modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                }
            });
        });

        // Close modal when clicking outside the modal content
        projectModals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                }
            });
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                projectModals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        modal.classList.remove('active');
                        document.body.style.overflow = ''; // Re-enable scrolling
                    }
                });
            }
        });
    }

    // Initialize if we start on the projects page
    if (initialHash === 'projects') {
        initProjectModals();
        initSlideshow(); // Keep for backward compatibility
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to sections as they become visible
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}); 