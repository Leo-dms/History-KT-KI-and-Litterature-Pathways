// ===== NAVIGATION =====
const navButtons = document.querySelectorAll('.nav-btn');
const strands = document.querySelectorAll('.strand');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const strandId = btn.dataset.strand;
        
        // Remove active class from all
        navButtons.forEach(b => b.classList.remove('active'));
        strands.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        document.getElementById(strandId).classList.add('active');
    });
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll behavior for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});