document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // --- Mobile Menu Toggle ---
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // --- Tabs Logic ---
    
    // Function to show a specific tab
    const showTab = (tabId) => {
        // Deactivate all buttons and content
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });

        // Activate the selected button and content
        const selectedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        if (selectedContent) {
            selectedContent.classList.add('active');
            selectedContent.setAttribute('aria-hidden', 'false');
        }
    };

    // Initial state: Activate the first tab ('admin')
    showTab('admin');

    // Add click listeners to buttons (for tablet/desktop)
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // --- Accordion Logic (for mobile - acts as a toggle) ---
    // On mobile, the tabs disappear, and we simply toggle the content boxes on click of the header (which is hidden on desktop)
    tabContents.forEach(content => {
        const header = content.querySelector('h3');
        if (header) {
            header.style.cursor = 'pointer'; // Make it look clickable
            header.addEventListener('click', () => {
                // For mobile, we just toggle the active state when the user taps the hidden-on-desktop header
                // On desktop, the showTab function handles the display. This ensures a good mobile experience.
                if (window.innerWidth < 640) { // Apply accordion toggle only on mobile screens (less than sm breakpoint)
                     content.classList.toggle('active');
                     const isExpanded = content.classList.contains('active');
                     content.setAttribute('aria-hidden', !isExpanded);
                }
            });
        }
    });

    // On mobile, all content is initially hidden to act as an accordion.
    // When the window is small, we hide all content initially.
    // On DOMContentLoaded, the script runs, showTab('admin') is called, making only 'admin' visible.
    // On mobile, we want all to be closed initially for the accordion feel, so we re-toggle if width is small.
     if (window.innerWidth < 640) {
         tabContents.forEach(content => {
             content.classList.remove('active');
             content.setAttribute('aria-hidden', 'true');
         });
     }
     
    // On resize, re-evaluate display strategy
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 640) {
            // If switching to desktop/tablet view, ensure the active tab is visible
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                showTab(activeTab.getAttribute('data-tab'));
            } else {
                showTab('admin'); // Default to admin if none active
            }
        } else {
            // If switching to mobile view, hide the mobile menu if it was open
            mobileMenu.classList.add('hidden');
        }
    });

    // Ensure the smooth scrolling links work for the mobile menu too
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after link click
            if (window.innerWidth < 640) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Initial call to ensure the first tab is shown, and mobile layout is correct on load
    if (window.innerWidth >= 640) {
        showTab('admin');
    }
});
