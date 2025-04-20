// main.js
document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (mobileMenuButton && mobileMenu && closeMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });

        closeMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close menu when a link is clicked (optional)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });

        // Close menu if clicking outside of it (optional)
        document.addEventListener('click', (event) => {
            if (mobileMenu.classList.contains('show') && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }


    // --- Active Nav Link Highlighting ---
    const currentPath = window.location.pathname.split("/").pop() || 'index.html'; // Get current file name
    const desktopNavLinks = document.querySelectorAll('.desktop-nav a');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');

    function setActiveLink(links) {
        links.forEach(link => {
            const linkPath = link.getAttribute('href').split("/").pop() || 'index.html';
             // Handle cases where href might be just "about.html" or "../pages/about.html" etc.
            let simpleLinkPath = link.getAttribute('href');
            if (simpleLinkPath.includes('/')) {
                simpleLinkPath = simpleLinkPath.substring(simpleLinkPath.lastIndexOf('/') + 1);
            }
             if (simpleLinkPath === '' || simpleLinkPath === './') simpleLinkPath = 'index.html'; // Handle root link

            if (simpleLinkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveLink(desktopNavLinks);
    setActiveLink(mobileNavLinks);


    // --- Counter Animation (from About page) ---
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-value');
        if (counters.length === 0) return; // Only run if counters exist

        const speed = 200; // Lower number = faster animation

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target || counter.innerText, 10); // Use data-target or initial text
            counter.innerText = '0'; // Start from 0
            counter.dataset.target = target; // Store target in data attribute

            const updateCounter = () => {
                const currentTarget = +counter.dataset.target; // Get target from data attribute
                const count = +counter.innerText;
                const increment = currentTarget / speed;

                if (count < currentTarget) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 10); // Adjust timing for smoothness
                } else {
                    // Format final number if needed (e.g., add '+' or '.')
                    let finalValue = currentTarget.toString();
                    if (counter.dataset.suffix) finalValue += counter.dataset.suffix;
                    if (counter.dataset.prefix) finalValue = counter.dataset.prefix + finalValue;
                    counter.innerText = finalValue;
                }
            };
            updateCounter();
        });
    }

    // Run counter animation when element is in view
    const statsSection = document.querySelector('.stats-section'); // Add this class to the section containing counters
    if (statsSection) {
        const observerOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    }


    // --- Gallery Lightbox (from Gallery page) ---
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;
    const imageUrls = [];

    if (galleryImages.length > 0 && lightbox && lightboxContent && lightboxClose && lightboxPrev && lightboxNext) {
        galleryImages.forEach((imgElement, index) => {
            // Store the full image URL, potentially from a data attribute if thumbnail is different
            imageUrls.push(imgElement.querySelector('img').src);
            imgElement.dataset.index = index; // Ensure index is set

            imgElement.addEventListener('click', () => {
                currentImageIndex = parseInt(imgElement.dataset.index);
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function updateLightboxImage() {
            if (imageUrls.length > 0) {
                lightboxContent.src = imageUrls[currentImageIndex];
            }
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);

        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
            updateLightboxImage();
        });

        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
            updateLightboxImage();
        });

        // Close lightbox on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    lightboxPrev.click();
                } else if (e.key === 'ArrowRight') {
                    lightboxNext.click();
                }
            }
        });
    }


    // --- Contact Form Submission (from Contact page) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation example (can be enhanced)
            const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
            const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
            const message = contactForm.querySelector('textarea').value;

            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, Message).');
                return;
            }

            // In a real scenario, you would send data via fetch() here.
            // For demonstration, just show an alert and reset.
            console.log('Form Data:', {
                name: name,
                email: email,
                phone: contactForm.querySelector('input[placeholder="Your Phone"]').value,
                subject: contactForm.querySelector('input[placeholder="Subject"]').value,
                message: message
            });

            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // --- Smooth Scroll for Anchor Links (Example - if needed) ---
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         const targetId = this.getAttribute('href');
    //         const targetElement = document.querySelector(targetId);
    //         if(targetElement) {
    //              const headerOffset = document.querySelector('.main-header').offsetHeight || 80; // Adjust for sticky header
    //              const elementPosition = targetElement.getBoundingClientRect().top;
    //              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    //              window.scrollTo({
    //                   top: offsetPosition,
    //                   behavior: 'smooth'
    //              });
    //         }
    //     });
    // });

}); // End DOMContentLoaded