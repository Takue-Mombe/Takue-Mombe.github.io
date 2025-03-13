<script>
    import '../style/components/about.css'
    import { onMount } from 'svelte';
    
    onMount(() => {
        // Initialize particles for about section
        if (window.particlesJS) {
            particlesJS('about-particles', {
                particles: {
                    number: { value: 30, density: { enable: true, value_area: 1000 } },
                    color: { value: '#3498db' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.3, random: true },
                    size: { value: 2, random: true },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: true,
                        out_mode: 'out'
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'bubble' },
                        onclick: { enable: true, mode: 'push' }
                    }
                }
            });
        }

        // Intersection Observer for cards
        const cards = document.querySelectorAll('.about-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    });
</script>

<section class="about-section" id="about">
    <div id="about-particles"></div>
    
    <div class="about-content">
        <div class="about-header">
            <span class="section-tag">About Me</span>
            <h1>My Journey</h1>
        </div>

        <div class="about-grid">
            <!-- Stats Overview -->
            <div class="about-card stats-card">
                <div class="stat-item">
                    <div class="stat-value">2+</div>
                    <div class="stat-label">Years of Experience</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">15+</div>
                    <div class="stat-label">Projects Delivered</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">5+</div>
                    <div class="stat-label">Technologies</div>
                </div>
            </div>

            <!-- Current Role -->
            <div class="about-card role-card">
                <div class="role-content">
                    <div class="role-header">
                        <i class="fas fa-code"></i>
                        <h2>Full Stack Developer</h2>
                    </div>
                    <p>Currently leading development of web applications and APIs</p>
                    <span class="time-badge">2024 - Present</span>
                </div>
            </div>

            <!-- Previous Role -->
            <div class="about-card role-card">
                <div class="role-content">
                    <div class="role-header">
                        <i class="fas fa-laptop-code"></i>
                        <h2>Junior Developer</h2>
                    </div>
                    <p>Full-stack development and system maintenance</p>
                    <span class="time-badge">2023 - 2024</span>
                </div>
            </div>

        </div>
    </div>
</section>
