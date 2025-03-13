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
            <div class="header-content">
                <span class="section-tag">Experience</span>
                <h1>My Journey</h1>
                <div class="tech-line"></div>
            </div>
        </div>

        <div class="about-grid">
            <!-- Professional Growth Card -->
            <div class="about-card timeline">
                <div class="card-content">
                    <h2>Professional Growth</h2>
                    <div class="timeline-items">
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Senior Backend Developer</h3>
                                <p>Leading architecture design and implementation</p>
                                <span class="timeline-date">2023 - Present</span>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Full Stack Developer</h3>
                                <p>Full-cycle application development</p>
                                <span class="timeline-date">2021 - 2023</span>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>Junior Developer</h3>
                                <p>Web development and maintenance</p>
                                <span class="timeline-date">2020 - 2021</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Key Projects Card -->
            <div class="about-card projects">
                <div class="card-content">
                    <h2>Notable Projects</h2>
                    <div class="project-items">
                        <div class="project-item">
                            <div class="project-icon">🤖</div>
                            <div class="project-details">
                                <h3>AI-Powered Analytics</h3>
                                <p>Machine learning solution for predictive business insights</p>
                                <div class="tech-used">Python • TensorFlow • AWS</div>
                            </div>
                        </div>
                        <div class="project-item">
                            <div class="project-icon">💼</div>
                            <div class="project-details">
                                <h3>Enterprise Resource Platform</h3>
                                <p>Scalable ERP system for manufacturing</p>
                                <div class="tech-used">Java • Spring Boot • PostgreSQL</div>
                            </div>
                        </div>
                        <div class="project-item">
                            <div class="project-icon">🌐</div>
                            <div class="project-details">
                                <h3>Cloud Migration</h3>
                                <p>Legacy system modernization to cloud infrastructure</p>
                                <div class="tech-used">Docker • AWS • Terraform</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Expertise Areas Card -->
            <div class="about-card expertise">
                <div class="card-content">
                    <h2>Core Expertise</h2>
                    <div class="expertise-grid">
                        <div class="expertise-item">
                            <i class="fas fa-server"></i>
                            <h3>Backend Systems</h3>
                            <p>Microservices architecture, API design, Database optimization</p>
                        </div>
                        <div class="expertise-item">
                            <i class="fas fa-brain"></i>
                            <h3>AI Solutions</h3>
                            <p>Machine learning models, Data analysis, Predictive systems</p>
                        </div>
                        <div class="expertise-item">
                            <i class="fas fa-cloud"></i>
                            <h3>Cloud Architecture</h3>
                            <p>AWS infrastructure, Scalability, DevOps practices</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Achievements Card -->
            <div class="about-card achievements">
                <div class="card-content">
                    <h2>Milestones</h2>
                    <div class="achievement-stats">
                        <div class="stat">
                            <span class="number">15+</span>
                            <span class="label">Enterprise Projects</span>
                        </div>
                        <div class="stat">
                            <span class="number">99%</span>
                            <span class="label">Client Satisfaction</span>
                        </div>
                        <div class="stat">
                            <span class="number">24/7</span>
                            <span class="label">Support Provided</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
