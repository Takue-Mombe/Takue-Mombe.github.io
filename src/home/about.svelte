<script>
    import '../style/components/about.css'
    import { onMount } from 'svelte';
    
    let isVisible = false;
    
    onMount(() => {
        isVisible = true;
        
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

<section class="about-section" id="about" class:visible={isVisible}>
    <div class="newspaper-container">
        <!-- Masthead -->
        <div class="masthead">
            <div class="edition-date">EDITION {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <h1 class="masthead-title">THE DEVELOPER CHRONICLE</h1>
            <div class="edition-type">PORTFOLIO EDITION</div>
            <div class="divider"></div>
        </div>

        <!-- Main Story -->
        <div class="main-story">
            <div class="story-header">
                <div class="category-label">DEVELOPER PROFILE</div>
                <h2 class="headline">The Journey of Innovation</h2>
                <div class="subhead">A Story of Code, Creativity, and Continuous Growth</div>
            </div>

            <div class="story-columns">
                <!-- Left Column -->
                <div class="column main-column">
                    <div class="lead-paragraph">
                        In the ever-evolving landscape of technology, every developer has a unique story. 
                        Here's an inside look at the journey, experience, and professional milestones 
                        that shape today's innovative solutions.
                    </div>

                    <div class="stats-grid">
                        <div class="about-card stats-box">
                            <span class="stat-value">2+</span>
                            <span class="stat-label">Years of Experience</span>
                        </div>
                        <div class="about-card stats-box">
                            <span class="stat-value">15+</span>
                            <span class="stat-label">Projects Completed</span>
                        </div>
                        <div class="about-card stats-box">
                            <span class="stat-value">5+</span>
                            <span class="stat-label">Technologies Mastered</span>
                        </div>
                    </div>

                    <blockquote class="about-card featured-quote">
                        <p>"Every line of code tells a story, and my journey has been about crafting narratives that solve real problems through technology."</p>
                        <cite>— Takudzwa Josiah Mombe</cite>
                    </blockquote>
                </div>

                <!-- Right Column -->
                <div class="column sidebar">
                    <div class="career-section">
                        <h3 class="section-title">CAREER HIGHLIGHTS</h3>
                        <div class="timeline">
                            <div class="about-card timeline-item">
                                <div class="timeline-header">
                                    <span class="timeline-date">2024 - Present</span>
                                    <h4>Full Stack Developer</h4>
                                </div>
                                <p>Leading development of web applications and APIs, focusing on scalable and maintainable solutions.</p>
                            </div>
                            <div class="about-card timeline-item">
                                <div class="timeline-header">
                                    <span class="timeline-date">2023 - 2025</span>
                                    <h4>Junior Developer</h4>
                                </div>
                                <p>Full-stack development and system maintenance, building strong foundations in modern web technologies.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+Pro:wght@400;600&display=swap');

    .about-section {
        width: 100%;
        min-height: 100vh;
        background-color: #f5f5f0;
        padding: 4rem 2rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease-out;
    }

    .about-section.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .newspaper-container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: #fff;
        padding: 3rem;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .masthead {
        text-align: center;
        margin-bottom: 2rem;
    }

    .edition-date {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .masthead-title {
        font-family: 'Playfair Display', serif;
        font-size: 3.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
        color: #000;
        letter-spacing: 2px;
    }

    .edition-type {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1rem;
        color: #666;
        margin-top: 0.5rem;
    }

    .divider {
        height: 2px;
        background-color: #000;
        margin: 1.5rem auto;
        width: 100%;
    }

    .story-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .category-label {
        display: inline-block;
        background: #000;
        color: #FFD700;
        padding: 0.4rem 1rem;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .headline {
        font-family: 'Playfair Display', serif;
        font-size: 2.8rem;
        margin: 0.5rem 0;
        color: #000;
    }

    .subhead {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1.2rem;
        color: #666;
    }

    .story-columns {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        margin-top: 2rem;
    }

    .lead-paragraph {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        line-height: 1.8;
        color: #333;
        margin-bottom: 2rem;
        border-left: 3px solid #FFD700;
        padding-left: 1.5rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin: 2rem 0;
    }

    .stats-box {
        background: #fff;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid #000;
        transition: all 0.3s ease;
    }

    .stats-box:hover {
        transform: translateY(-5px);
        border-bottom: 3px solid #FFD700;
    }

    .stat-value {
        font-family: 'Playfair Display', serif;
        font-size: 2.2rem;
        font-weight: 700;
        color: #000;
        display: block;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        color: #666;
    }

    .featured-quote {
        margin: 2rem 0;
        padding: 2rem;
        background: #f5f5f5;
        border-left: 3px solid #FFD700;
    }

    .featured-quote p {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem;
        font-style: italic;
        color: #000;
        margin: 0 0 1rem 0;
        line-height: 1.6;
    }

    .featured-quote cite {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1rem;
        color: #666;
        display: block;
        text-align: right;
    }

    .sidebar {
        border-left: 1px solid #000;
        padding-left: 2rem;
    }

    .section-title {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        color: #000;
        margin-bottom: 1.5rem;
        letter-spacing: 1px;
        padding: 0.5rem;
        background: #f5f5f5;
        border-left: 3px solid #FFD700;
    }

    .timeline-item {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #e0e0e0;
        position: relative;
        transition: all 0.3s ease;
    }

    .timeline-item:hover {
        border-color: #000;
        transform: translateX(10px);
    }

    .timeline-header {
        margin-bottom: 1rem;
    }

    .timeline-date {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 0.9rem;
        color: #666;
        display: block;
        margin-bottom: 0.5rem;
    }

    .timeline-header h4 {
        font-family: 'Playfair Display', serif;
        font-size: 1.3rem;
        margin: 0;
        color: #000;
    }

    .timeline-item p {
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 1rem;
        color: #333;
        margin: 0;
        line-height: 1.6;
    }

    .about-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }

    .about-card.visible {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 1024px) {
        .newspaper-container {
            padding: 2rem;
        }

        .masthead-title {
            font-size: 2.8rem;
        }

        .story-columns {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .sidebar {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid #000;
            padding-top: 2rem;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .about-section {
            padding: 2rem 1rem;
            min-height: auto;
        }

        .newspaper-container {
            padding: 1.5rem;
        }

        .masthead-title {
            font-size: 2rem;
        }

        .headline {
            font-size: 2rem;
        }

        .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .featured-quote {
            padding: 1.5rem;
        }

        .featured-quote p {
            font-size: 1.1rem;
        }

        .lead-paragraph {
            font-size: 1.1rem;
            padding-left: 1rem;
        }

        .timeline-item {
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .timeline-header h4 {
            font-size: 1.1rem;
        }
    }

    @media (max-width: 480px) {
        .about-section {
            padding: 1.5rem 0.5rem;
        }

        .newspaper-container {
            padding: 1rem;
        }

        .masthead-title {
            font-size: 1.5rem;
        }

        .headline {
            font-size: 1.5rem;
        }

        .category-label {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
        }

        .lead-paragraph {
            font-size: 1rem;
            line-height: 1.6;
        }

        .stats-box {
            padding: 1rem;
        }

        .stat-value {
            font-size: 1.8rem;
        }

        .featured-quote {
            padding: 1rem;
            margin: 1.5rem 0;
        }

        .featured-quote p {
            font-size: 1rem;
        }

        .timeline-item:hover {
            transform: none;
        }

        .timeline-header h4 {
            font-size: 1rem;
        }

        .timeline-item p {
            font-size: 0.9rem;
        }
    }
</style>