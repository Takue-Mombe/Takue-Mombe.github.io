<script>
    import { onMount } from 'svelte';
    let name = "Takue Mombe";
    import "../style/components/hero.css";

    onMount(() => {
        // Make sure particles.js is loaded
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 1000 } },
                    color: { value: '#3498db' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: true,
                        out_mode: 'out'
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' }
                    }
                }
            });
        }
    });
</script>

<div class="hero-section">
    <div id="particles-js"></div>
    <main class="hero-content">
        <div class="left-column">
            <h1>{name.toUpperCase()}</h1>
            <h2 class="typewriter">Software Developer</h2>
            <p class="bio">
                Passionate software developer crafting elegant solutions to complex problems. 
                Specialized in full-stack development with expertise in modern web technologies.
            </p>
            <div class="cta-buttons">
                <a href="#projects" class="btn primary">View Projects</a>
                <a href="#contact" class="btn secondary">Get in Touch</a>
            </div>
            <div class="tech-stack">
                <span class="tech-tag">Java</span>
                <span class="tech-tag">PHP</span>
                <span class="tech-tag">Svelte.js</span>
                <span class="tech-tag">Python</span>
            </div>
        </div>
        <div class="right-column">
            <div class="image-container">
                <img src="/images/taku.jpg" alt="Takue Mombe" class="profile-image">
                <div class="status-badge">
                    <span class="dot"></span>
                    Available for hire
                </div>
            </div>
        </div>
    </main>
</div>