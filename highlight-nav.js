document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#main-nav a');
    // Get the current page's filename (e.g., 'index.html', 't-shirt.html')
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.forEach(link => {
        // Compare the link's href with the current page's filename
        // Handle cases where href might be empty or just '#'
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.split('/').pop() === currentPath) {
            link.classList.add('active-nav');
        }
    });
});