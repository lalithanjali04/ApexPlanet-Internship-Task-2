// Mobile menu toggle functionality
document.querySelector('.mobile-menu-button').addEventListener('click', function() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
    
    // Change button icon
    this.textContent = nav.classList.contains('active') ? '✕' : '☰';
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav').classList.remove('active');
        document.querySelector('.mobile-menu-button').textContent = '☰';
    });
});
