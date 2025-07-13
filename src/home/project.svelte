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
    });

    const projects = [
        {
            title: "AI Tasks",
            description: "A sophisticated productivity app featuring glass morphism UI, AI-powered task suggestions using Google's Gemini API, and smart scheduling. Includes authentication with email/password and Google SSO, along with intelligent task management and modern design elements.",
            image: "/images/projects/aischeduler.png",
            tech: ["React", "Gemini API", "Glass UI", "Firebase Auth", "Google SSO"],
            github: "https://github.com/Takue-Mombe/AITasks",
            live: "https://aitasks-git-main-takudzwa-josiah-mombes-projects.vercel.app/",
            category: "Full Stack"
        },
        {
            title: "Sekani Security",
            description: "A professional security company website showcasing comprehensive security solutions. Features a modern catalog-style services section, trust-building elements, and seamless contact integration. Built with a focus on professionalism and user trust.",
            image: "/images/projects/sekani.png",
            tech: ["React", "Next.js", "Tailwind CSS", "Responsive Design", "SEO Optimized"],
            github: "https://github.com/Takue-Mombe/Sekani-Security",
            live: "https://sekani-secure-web-takudzwa-josiah-mombes-projects.vercel.app/",
            category: "Web Development"
        },
        {
            title: "AgriConnect",
            description: "An elegant platform connecting smallholder farmers with local buyers, restaurants, and cooperatives. Features include produce listings, real-time chat, harvest planning, and push notifications. Built with a focus on empowering local agriculture communities.",
            image: "/images/projects/agriconnect.png",
            tech: ["React", "Expo", "Node.js", "Firebase", "Push Notifications"],
            github: "https://github.com/Takue-Mombe/AgriConnect",
            live: "https://agriconnectmobi.netlify.app/",
            category: "Full Stack"
        },
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
        }
    ];
</script>

<section class="projects-section" id="projects">
    <div class="newspaper-container">
        <div class="newspaper-header">
            <div class="newspaper-masthead">
                <div class="newspaper-title">
                    <h1 class="masthead-title">THE DEVELOPER TIMES</h1>
                    <p class="masthead-subtitle">SPECIAL HIRING EDITION • Breaking News in Tech Innovation</p>
                </div>
                <div class="newspaper-date">
                    <p class="date-line">URGENT EDITION 2024</p>
                    <p class="price-line">Value: Priceless Talent</p>
                </div>
            </div>
            
            <div class="headline-section">
                <div class="headline-column">
                    <h2 class="section-headline">EXCEPTIONAL DEVELOPER SEEKS NEW OPPORTUNITY</h2>
                    <p class="section-subhead">Portfolio of Innovation and Excellence</p>
                </div>
                <div class="headline-column">
                    <p class="newspaper-byline">Featured Developer: <span class="author-name">Takudzwa Josiah Mombe</span></p>
                    <p class="developer-quote">"Transforming Ideas into Exceptional Digital Experiences"</p>
                </div>
        </div>

            <div class="newspaper-divider">
                <div class="divider-line"></div>
                <div class="divider-icon">★</div>
                <div class="divider-line"></div>
            </div>

            <div class="hire-banner">
                <div class="banner-content">
                    <div class="banner-left">
                        <span class="banner-tag">AVAILABLE NOW</span>
                    </div>
                    <div class="banner-center">
                        <h3 class="banner-headline">EXCEPTIONAL DEVELOPER READY FOR NEXT CHALLENGE</h3>
                        <p class="banner-subtext">Full Stack • AI Integration • Modern Technologies</p>
                    </div>
                    <div class="banner-right">
                        <div class="banner-cta">
                            <span class="cta-text">HIRE TODAY</span>
                            <span class="cta-arrow">→</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="newspaper-divider">
                <div class="divider-line"></div>
                <div class="divider-icon">✦</div>
                <div class="divider-line"></div>
            </div>
                    </div>
                    
        <div class="newspaper-content">
            <div class="newspaper-article">
                {#each projects as project}
                    <article class="project-article">
                        <div class="article-header">
                            <h3 class="article-title">{project.title}</h3>
                            <p class="article-dateline">EXPERTISE IN {@html project.category.toUpperCase()} • Completed {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                        </div>
                        
                        <div class="article-body">
                            <div class="article-image">
                                <img src={project.image} alt={project.title} class="news-image" />
                                <p class="image-caption">Showcase: The innovative {project.title} platform in action.</p>
                            </div>
                            
                            <div class="article-text">
                                <p class="article-lead">{project.description}</p>
                                
                                <div class="article-tech">
                                    <h4 class="tech-heading">TECHNICAL EXPERTISE DEMONSTRATED:</h4>
                                    <ul class="tech-list">
                            {#each project.tech as tech}
                                            <li class="tech-item">{tech}</li>
                            {/each}
                                    </ul>
                        </div>

                                <div class="article-links">
                                    <div class="link-box">
                                        <a href={project.github} target="_blank" class="news-link">
                                            <span class="link-icon">⚡</span>
                                            <span class="link-text">Examine Code Quality</span>
                                        </a>
                                    </div>
                            {#if project.live}
                                        <div class="link-box">
                                            <a href={project.live} target="_blank" class="news-link">
                                                <span class="link-icon">✨</span>
                                                <span class="link-text">Experience Live</span>
                                            </a>
                                        </div>
                            {/if}
                            {#if project.download}
                                        <div class="link-box">
                                            <a href={project.download} download class="news-link">
                                                <span class="link-icon">📥</span>
                                                <span class="link-text">Try It Now</span>
                                            </a>
                                        </div>
                            {/if}
                                </div>
                            </div>
                        </div>
                        
                        <div class="article-footer">
                            <div class="footer-line"></div>
                            <p class="footer-note">More Impressive Projects on Next Page</p>
                        </div>
                    </article>
                {/each}
            </div>
            
            <div class="newspaper-sidebar">
                <div class="sidebar-ad hire-me-box">
                    <div class="ad-content">
                        <p class="ad-label">CAREER OPPORTUNITY</p>
                        <h4 class="ad-title">WHY HIRE ME?</h4>
                        <ul class="hire-me-points">
                            <li>✓ Full-stack development expertise</li>
                            <li>✓ AI & modern tech integration</li>
                            <li>✓ Problem-solving mindset</li>
                            <li>✓ Strong project portfolio</li>
                            <li>✓ Passionate about innovation</li>
                        </ul>
                        <p class="ad-contact">Let's Connect: <a href="mailto:mombejose@gmail.com">mombejose@gmail.com</a></p>
                    </div>
                </div>
                
                <div class="sidebar-section testimonial">
                    <h4 class="sidebar-title">DEVELOPER HIGHLIGHTS</h4>
                    <p class="sidebar-text">"Bringing together technical excellence and creative problem-solving to deliver outstanding digital solutions. Experienced in modern frameworks and emerging technologies."</p>
                    <p class="sidebar-signature">Ready to contribute to your next big project</p>
                </div>
                
                <div class="sidebar-section availability">
                    <h4 class="sidebar-title">AVAILABILITY</h4>
                    <p class="sidebar-text">Available for exciting opportunities in full-stack development, AI integration, and innovative tech projects.</p>
                    <p class="availability-status">Status: Ready for New Challenges</p>
                </div>
            </div>
        </div>

        <div class="newspaper-footer">
            <div class="footer-line"></div>
            <p class="footer-text">Don't Miss This Opportunity • Contact Now for a Technical Discussion • Portfolio Edition 2024</p>
        </div>
    </div>
</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
    
    .projects-section {
        padding: 40px 20px;
        background-color: #f5f5f0;
        background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/></svg>');
        font-family: 'Old Standard TT', serif;
        color: #222;
        line-height: 1.6;
    }
    
    .newspaper-container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: #fff;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
        padding: 40px;
        position: relative;
        border: 1px solid #ddd;
    }
    
    .newspaper-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 98%, rgba(0,0,0,0.1) 100%);
        pointer-events: none;
    }
    
    .newspaper-masthead {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 20px;
        border-bottom: 3px double #000;
        padding-bottom: 15px;
    }
    
    .masthead-title {
        font-family: 'Special Elite', cursive;
        font-size: 3.5rem;
        margin: 0;
        line-height: 1;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #000;
        text-shadow: 2px 2px 0 #FFD700;
    }
    
    .masthead-subtitle {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        margin: 5px 0 0;
        color: #555;
    }
    
    .newspaper-date {
        text-align: right;
        font-family: 'IM Fell English', serif;
    }
    
    .date-line {
        margin: 0;
        font-size: 1rem;
    }
    
    .price-line {
        margin: 5px 0 0;
        font-size: 0.9rem;
        font-style: italic;
    }
    
    .headline-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin: 30px 0 20px;
    }
    
    .section-headline {
        font-family: 'Old Standard TT', serif;
        font-size: 2.5rem;
        margin: 0;
        font-weight: 700;
        border-bottom: 2px solid #FFD700;
        display: inline-block;
        padding-bottom: 5px;
        color: #000;
    }
    
    .section-subhead {
        font-family: 'IM Fell English', serif;
        font-size: 1.2rem;
        margin: 5px 0 0;
        font-style: italic;
    }
    
    .newspaper-byline {
        font-family: 'IM Fell English', serif;
        margin: 0;
        font-size: 0.95rem;
    }
    
    .author-name {
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .newspaper-divider {
        display: flex;
        align-items: center;
        margin: 20px 0 30px;
    }
    
    .divider-line {
        flex-grow: 1;
        height: 1px;
        background-color: #000;
    }
    
    .divider-icon {
        margin: 0 15px;
        font-size: 1.2rem;
    }
    
    .newspaper-content {
        display: flex;
        gap: 40px;
    }
    
    .newspaper-article {
        flex: 2;
    }
    
    .newspaper-sidebar {
        flex: 1;
        border-left: 1px solid #ddd;
        padding-left: 30px;
    }
    
    .project-article {
        margin-bottom: 50px;
    }
    
    .article-header {
        margin-bottom: 20px;
    }
    
    .article-title {
        font-family: 'Old Standard TT', serif;
        font-size: 2rem;
        margin: 0;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #000;
        border-left: 4px solid #FFD700;
        padding-left: 15px;
    }
    
    .article-dateline {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        color: #666;
        margin: 5px 0 0;
        font-style: italic;
    }
    
    .article-body {
        display: flex;
        gap: 30px;
        margin-top: 15px;
    }
    
    .article-image {
        flex: 1;
        margin-bottom: 15px;
    }
    
    .news-image {
        width: 100%;
        height: auto;
        border: 1px solid #ddd;
        filter: sepia(0.3) contrast(1.1);
    }
    
    .image-caption {
        font-family: 'IM Fell English', serif;
        font-size: 0.8rem;
        margin: 5px 0 0;
        color: #666;
        font-style: italic;
        text-align: center;
    }
    
    .article-text {
        flex: 2;
    }
    
    .article-lead {
        font-family: 'Old Standard TT', serif;
        font-size: 1.1rem;
        margin: 0 0 20px;
        text-align: justify;
        column-count: 2;
        column-gap: 30px;
        hyphens: auto;
    }
    
    .article-tech {
        margin: 25px 0;
    }
    
    .tech-heading {
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        margin: 0 0 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
    }
    
    .tech-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .tech-item {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        background: #000;
        color: #FFD700;
        padding: 5px 10px;
        border-radius: 3px;
        border: none;
    }
    
    .article-links {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 30px;
    }
    
    .link-box {
        border: 1px solid #000;
        padding: 0;
        transition: all 0.3s ease;
        background: #fff;
    }
    
    .link-box:hover {
        background: #FFD700;
        border-color: #000;
    }
    
    .news-link {
        display: inline-block;
        padding: 8px 15px;
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        text-decoration: none;
        color: #000;
        transition: all 0.3s ease;
    }
    
    .link-box:hover .news-link {
        color: #000;
    }
    
    .link-icon {
        margin-right: 5px;
    }
    
    .article-footer {
        margin-top: 30px;
    }
    
    .footer-line {
        height: 1px;
        background-color: #000;
        margin-bottom: 5px;
    }
    
    .footer-note {
        font-family: 'IM Fell English', serif;
        font-size: 0.8rem;
        color: #666;
        text-align: right;
        font-style: italic;
    }
    
    .sidebar-ad {
        background-color: #f5f5f0;
        padding: 20px;
        margin-bottom: 30px;
        border: 1px dashed #999;
    }
    
    .ad-label {
        font-family: 'Special Elite', cursive;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 10px;
        color: #666;
    }
    
    .ad-title {
        font-family: 'Old Standard TT', serif;
        font-size: 1.2rem;
        margin: 0 0 10px;
        font-weight: 700;
    }
    
    .ad-text {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        margin: 0 0 10px;
    }
    
    .ad-contact {
        font-family: 'IM Fell English', serif;
        font-size: 0.8rem;
        font-style: italic;
        margin: 0;
    }
    
    .sidebar-section {
        margin-bottom: 30px;
    }
    
    .sidebar-title {
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
    }
    
    .sidebar-text {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        margin: 0 0 10px;
    }
    
    .sidebar-signature {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        font-style: italic;
        text-align: right;
        margin: 0;
    }
    
    .newspaper-footer {
        margin-top: 50px;
        padding-top: 20px;
    }
    
    .footer-text {
        font-family: 'IM Fell English', serif;
        font-size: 0.8rem;
        color: #666;
        text-align: center;
    }
    
    @media (max-width: 1000px) {
        .newspaper-content {
            flex-direction: column;
        }
        
        .newspaper-sidebar {
            border-left: none;
            border-top: 1px solid #ddd;
            padding-left: 0;
            padding-top: 30px;
        }
        
        .article-lead {
            column-count: 1;
        }
    }
    
    @media (max-width: 768px) {
        .newspaper-container {
            padding: 20px;
        }
        
        .masthead-title {
            font-size: 2.5rem;
        }
        
        .section-headline {
            font-size: 1.8rem;
        }
        
        .article-body {
            flex-direction: column;
        }
        
        .article-title {
            font-size: 1.5rem;
        }
        
        .newspaper-masthead {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .newspaper-date {
            text-align: left;
            margin-top: 10px;
        }
    }
    
    @media (max-width: 480px) {
        .masthead-title {
            font-size: 1.8rem;
        }
        
        .section-headline {
            font-size: 1.5rem;
        }
        
        .article-links {
            flex-direction: column;
        }
    }

    .breaking-news-banner {
        background: #000;
        color: #FFD700;
        padding: 10px;
        text-align: center;
        margin: 20px 0;
        font-family: 'Special Elite', cursive;
        font-size: 1.2rem;
        letter-spacing: 1px;
        animation: ticker 20s linear infinite;
    }

    .banner-text {
        display: inline-block;
    }

    .hire-me-box {
        border: 2px solid #000 !important;
        background: #fff !important;
    }

    .hire-me-points {
        list-style: none;
        padding: 0;
        margin: 15px 0;
    }

    .hire-me-points li {
        margin: 10px 0;
        font-family: 'IM Fell English', serif;
        font-size: 0.95rem;
    }

    .availability-status {
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        color: #000;
        text-align: center;
        margin-top: 15px;
        padding: 10px;
        border: 1px solid #000;
        background: #FFD700;
    }

    .developer-quote {
        font-family: 'IM Fell English', serif;
        font-style: italic;
        font-size: 1rem;
        margin: 5px 0 0;
        color: #666;
    }

    .testimonial {
        border: 1px solid #ddd;
        padding: 20px;
        background: #f9f9f9;
    }

    @keyframes ticker {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
    }

    .ad-contact a {
        color: #000;
        text-decoration: underline;
        font-weight: bold;
    }

    .ad-contact a:hover {
        color: #FFD700;
        background: #000;
        padding: 2px 5px;
        text-decoration: none;
    }

    .hire-banner {
        background: linear-gradient(45deg, #000 0%, #111 100%);
        margin: 30px 0;
        padding: 2px;
        position: relative;
        overflow: hidden;
    }

    .hire-banner::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, #FFD700, #FFF8DC, #FFD700);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        padding: 2px;
    }

    .banner-content {
        background: linear-gradient(45deg, #000 0%, #111 100%);
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }

    .banner-left {
        flex: 1;
        text-align: center;
    }

    .banner-tag {
        background: #FFD700;
        color: #000;
        padding: 5px 15px;
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        font-weight: bold;
        letter-spacing: 1px;
        display: inline-block;
        clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
    }

    .banner-center {
        flex: 3;
        text-align: center;
    }

    .banner-headline {
        color: #FFD700;
        font-family: 'Special Elite', cursive;
        font-size: 1.4rem;
        margin: 0 0 5px;
        letter-spacing: 1px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .banner-subtext {
        color: #FFF;
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        margin: 0;
        opacity: 0.9;
    }

    .banner-right {
        flex: 1;
        text-align: center;
    }

    .banner-cta {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #FFD700;
        color: #000;
        padding: 8px 20px;
        border-radius: 3px;
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #FFD700;
    }

    .banner-cta:hover {
        background: transparent;
        color: #FFD700;
    }

    .cta-arrow {
        transition: transform 0.3s ease;
    }

    .banner-cta:hover .cta-arrow {
        transform: translateX(5px);
    }

    @media (max-width: 768px) {
        .banner-content {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
        }

        .banner-headline {
            font-size: 1.2rem;
        }

        .banner-left, .banner-center, .banner-right {
            width: 100%;
        }
    }
</style>