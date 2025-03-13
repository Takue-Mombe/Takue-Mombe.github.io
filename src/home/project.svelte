<script>
    import '../style/components/projects.css';
    import { onMount } from 'svelte';

    onMount(() => {
        const projectCards = document.querySelectorAll('.project-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        projectCards.forEach(card => observer.observe(card));

        // Particles configuration
        particlesJS('particles-projects', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#007bff'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#007bff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    });

    const projects = [
        {
            title: "PDF Editor",
            description: "A robust desktop application for PDF manipulation, featuring merge, split, and watermark functionalities. Built with Python and PyQt5 for a native desktop experience.",
            image: "/images/projects/pdf-editor.jpg",
            tech: ["Python", "PyQt5", "PyPDF2", "Qt Designer"],
            github: "https://github.com/Takue-Mombe/PDF-Editor",
            download: "/projects/PDF_Editor.zip",
            category: "Desktop Application"
        },
        {
            title: "Event Scheduler",
            description: "This is an Event Scheduler app using Restful APIs using springboot, spring security and postgresql.",
            image: "/images/projects/event.jpg",
            tech: ["Java", "Springboot", "PSQL"],
            github: "https://github.com/Takue-Mombe/EventScheduler",
           
            category: "Web Application"
        },
        {
            title: "Watchlist Tracker",
            description: "Continuo is a watch list tracker that ensures you never lose track of your video progress across devices. Whether it's a TV series, YouTube, or local media, it offers seamless automation, synchronization, and an intuitive interface to enhance your viewing experience.",
            image: "/images/projects/continuo.jpg",
            tech: ["Python", "Django", "SQLite"],
            github: "https://github.com/Takue-Mombe/Continuo",
            category: "Backend"
        },
        {
            title: "Portfolio Website",
            description: "Modern portfolio website built with Svelte showcasing projects and skills.",
            image: "/images/projects/logo.png",
            tech: ["Svelte", "JavaScript", "CSS3", "Vite"],
            github: "https://github.com/Takue-Mombe/portfolio",
            live: "https://portfolio-mo5o.onrender.com/",
            category: "Frontend"
        }
    ];
</script>

<section class="projects-section" id="projects">
    <div id="particles-projects" class="particles-js"></div>
    <div id="projects-glow"></div>
    
    <div class="projects-content">
        <div class="projects-header">
            <span class="section-tag">Projects</span>
            <h1>Featured Work</h1>
            <p class="section-subtitle">Explore some of my recent projects</p>
        </div>

        <div class="projects-grid">
            {#each projects as project}
                <div class="project-card">
                    <div class="project-image">
                        <img src={project.image} alt={project.title} />
                        <div class="project-category">{project.category}</div>
                    </div>
                    
                    <div class="project-content">
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        
                        <div class="tech-stack">
                            {#each project.tech as tech}
                                <span class="tech-tag">{tech}</span>
                            {/each}
                        </div>

                        <div class="project-links">
                            <a href={project.github} target="_blank" class="project-link github">
                                <i class="fab fa-github"></i>
                                View Code
                            </a>
                            {#if project.live}
                                <a href={project.live} target="_blank" class="project-link live">
                                    <i class="fas fa-external-link-alt"></i>
                                    Live Demo
                                </a>
                            {/if}
                            {#if project.download}
                                <a href={project.download} download class="project-link download">
                                    <i class="fas fa-download"></i>
                                    Download App
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="more-projects">
            <a href="https://github.com/Takue-Mombe" target="_blank" class="github-link">
                <span>View More on GitHub</span>
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>
</section>

<style>
    /* Add this to your existing CSS */
    .project-link.download {
        background: #2ecc71;
        color: white;
    }

    .project-link.download:hover {
        background: #27ae60;
    }

    .particles-js {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .projects-content {
        position: relative;
        z-index: 2;
    }
</style>
