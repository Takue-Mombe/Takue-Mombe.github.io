<script>
    import { onMount } from 'svelte';
    let name = "Takue Mombe";
    import "../style/components/hero.css";

    // Add smooth scroll function
    function scrollToSection(sectionId) {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    onMount(() => {
        // Typewriter effect
        const typewriterElement = document.querySelector('.typewriter');
        if (typewriterElement) {
            const text = "SOFTWARE DEVELOPER";
            let i = 0;
            const speed = 100; // milliseconds
            
            function typeWriter() {
                if (i < text.length) {
                    typewriterElement.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Add blinking cursor
                    typewriterElement.innerHTML += '<span class="cursor">|</span>';
                }
            }
            
            setTimeout(typeWriter, 1000); // Delay start
        }
    });
</script>

<div class="hero-section">
    <div class="newspaper-container">
        <header class="newspaper-header">
            <h1 class="newspaper-title">THE DEVELOPER TIMES</h1>
            <div class="newspaper-meta">
                <p class="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p class="edition">DIGITAL EDITION</p>
            </div>
        </header>

        <div class="content-wrapper">
            <div class="text-content">
                <div class="headline">
                    <span class="category">FEATURED DEVELOPER</span>
                    <h2 class="name">{name}</h2>
                    <h3 class="typewriter"></h3>
                </div>

                <p class="lead">
                    In the ever-evolving landscape of technology, a developer emerges 
                    with a passion for crafting elegant solutions and pushing the 
                    boundaries of digital innovation.
                </p>
                
                <div class="cta-buttons">
                    <button 
                        class="btn primary" 
                        on:click={() => scrollToSection('#projects')}
                    >
                        View Portfolio
                    </button>
                    <button 
                        class="btn secondary" 
                        on:click={() => scrollToSection('#contact')}
                    >
                        Get in Touch
                    </button>
                </div>

                <div class="tech-stack">
                    <h4>TECHNOLOGIES OF CHOICE</h4>
                    <div class="tech-tags">
                        <span class="tech-tag">Java</span>
                        <span class="tech-tag">PHP</span>
                        <span class="tech-tag">Svelte.js</span>
                        <span class="tech-tag">Python</span>
                    </div>
                </div>
            </div>
            
            <div class="image-content">
                <div class="image-container">
                    <img src="/images/taku.jpg" alt="Takue Mombe" class="profile-image">
                    <div class="image-caption">Portrait of Innovation</div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:wght@400;600&display=swap');
    
    .hero-section {
        min-height: 100vh;
        background-color: #f5f5f0;
        background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/></svg>');
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .newspaper-container {
        max-width: 1200px;
        width: 100%;
        background-color: #fff;
        padding: 3rem;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
    }

    .newspaper-header {
        text-align: center;
        border-bottom: 2px solid #000;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }

    .newspaper-title {
        font-family: 'Playfair Display', serif;
        font-size: 3rem;
        margin: 0;
        letter-spacing: 2px;
        color: #000;
    }

    .newspaper-meta {
        display: flex;
        justify-content: space-between;
        font-family: 'Source Sans Pro', sans-serif;
        color: #666;
        margin-top: 0.5rem;
    }

    .content-wrapper {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 4rem;
        margin-top: 2rem;
    }

    .headline {
        margin-bottom: 2rem;
    }

    .category {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        color: #FFD700;
        background: #000;
        padding: 0.3rem 0.8rem;
        display: inline-block;
        margin-bottom: 1rem;
    }

    .name {
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        margin: 0.5rem 0;
        line-height: 1.1;
        color: #000;
    }

    .typewriter {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1.5rem;
        color: #666;
        margin: 1rem 0;
        min-height: 2rem;
    }

    .cursor {
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    .lead {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        line-height: 1.8;
        color: #333;
        margin-bottom: 2rem;
        border-left: 3px solid #FFD700;
        padding-left: 1.5rem;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        margin: 2rem 0;
    }

    .btn {
        font-family: 'Source Sans Pro', sans-serif;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn.primary {
        background-color: #000;
        color: #FFD700;
        border: none;
    }

    .btn.primary:hover {
        background-color: #FFD700;
        color: #000;
    }

    .btn.secondary {
        background-color: transparent;
        color: #000;
        border: 2px solid #000;
    }

    .btn.secondary:hover {
        background-color: #000;
        color: #FFD700;
    }

    .tech-stack {
        margin-top: 3rem;
        border-top: 1px solid #e0e0e0;
        padding-top: 2rem;
    }

    .tech-stack h4 {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
    }

    .tech-tag {
        font-family: 'Source Sans Pro', sans-serif;
        background-color: #f5f5f5;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        color: #333;
        border-left: 3px solid #FFD700;
    }

    .image-container {
        position: relative;
    }

    .profile-image {
        width: 100%;
        height: auto;
        filter: grayscale(20%);
        border: 1px solid #e0e0e0;
        padding: 10px;
        background: #fff;
        box-shadow: 5px 5px 0 #FFD700;
    }

    .image-caption {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.8rem;
        color: #666;
        text-align: right;
        margin-top: 0.5rem;
        font-style: italic;
    }

    @media (max-width: 1024px) {
        .content-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .newspaper-container {
            padding: 2rem;
        }

        .newspaper-title {
            font-size: 2.5rem;
        }

        .name {
            font-size: 3rem;
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 1rem;
        }

        .newspaper-meta {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        .cta-buttons {
            flex-direction: column;
        }

        .btn {
            width: 100%;
            text-align: center;
        }

        .name {
            font-size: 2.5rem;
        }

        .lead {
            font-size: 1.1rem;
        }
    }
</style>