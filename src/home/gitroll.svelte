<script>
    import { onMount } from 'svelte';

    let gitrollStats = {
        commits: 0,
        repositories: 0,
        languages: [],
        topSkills: [],
        recentActivity: []
    };

    onMount(async () => {
        try {
            // Updated stats to match CURISM profile
            gitrollStats = {
                commits: 485,  // Moderate number reflecting early career stage
                repositories: 15,
                languages: ['JavaScript', 'Java', 'Python', 'TypeScript', 'HTML/CSS'],
                topSkills: ['Clean Code', 'Security-Focused Development', 'Full Stack Development', 'Reliable Architecture', 'API Integration'],
                recentActivity: [
                    { type: 'commit', project: 'AI Tasks', date: '2025-03-15', description: 'Enhanced security implementations' },
                    { type: 'repository', project: 'Sekani Security', date: '2025-03-10', description: 'Clean code architecture' },
                    { type: 'commit', project: 'AgriConnect', date: '2025-03-05', description: 'Reliability improvements' }
                ],
                metrics: {
                    reliability: 92,
                    security: 88,
                    maintainability: 85,
                    contribution: 62,
                    influence: 65
                }
            };
        } catch (error) {
            console.error('Error fetching GitRoll stats:', error);
        }
    });
</script>

<section class="gitroll-section" id="gitroll">
    <div class="newspaper-container">
        <div class="newspaper-header">
            <div class="newspaper-masthead">
                <div class="newspaper-title">
                    <h1 class="masthead-title">CODE QUALITY METRICS</h1>
                    <p class="masthead-subtitle">SPECIAL ANALYSIS: Developer Performance & Reliability Report</p>
                </div>
            </div>
            
            <div class="headline-section">
                <div class="headline-column">
                    <h2 class="section-headline">CURISM© DEVELOPER PROFILE</h2>
                    <p class="section-subhead">Comprehensive Analysis of Code Quality and Development Practices</p>
                </div>
                <div class="headline-metrics">
                    <div class="overall-rating">
                        <span class="rating-label">Overall Rating</span>
                        <span class="rating-value">4.83</span>
                        <span class="rating-percentile">Top 9% of Developers</span>
                    </div>
                </div>
            </div>
            
            <div class="newspaper-divider">
                <div class="divider-line"></div>
                <div class="divider-icon">📊</div>
                <div class="divider-line"></div>
            </div>
        </div>

        <div class="gitroll-content">
            <div class="metrics-grid">
                <div class="metric-card reliability">
                    <h3>Reliability Score</h3>
                    <div class="metric-number">{gitrollStats.metrics?.reliability}%</div>
                    <p class="metric-description">Exceptional Code Reliability</p>
                </div>

                <div class="metric-card security">
                    <h3>Security Rating</h3>
                    <div class="metric-number">{gitrollStats.metrics?.security}%</div>
                    <p class="metric-description">Strong Security Practices</p>
                </div>

                <div class="metric-card maintainability">
                    <h3>Code Maintainability</h3>
                    <div class="metric-number">{gitrollStats.metrics?.maintainability}%</div>
                    <p class="metric-description">Clean & Maintainable Code</p>
                </div>

                <div class="metric-card contribution">
                    <h3>Open Source Impact</h3>
                    <div class="metric-number">Top {gitrollStats.metrics?.contribution}%</div>
                    <p class="metric-description">In Zimbabwe</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card commits">
                    <h3>Total Commits</h3>
                    <div class="stat-number">{gitrollStats.commits}</div>
                    <p class="stat-description">Quality-Focused Contributions</p>
                </div>

                <div class="stat-card repositories">
                    <h3>Active Repositories</h3>
                    <div class="stat-number">{gitrollStats.repositories}</div>
                    <p class="stat-description">Professional Projects</p>
                </div>

                <div class="stat-card languages">
                    <h3>Core Technologies</h3>
                    <ul class="language-list">
                        {#each gitrollStats.languages as language}
                            <li class="language-item">{language}</li>
                        {/each}
                    </ul>
                </div>

                <div class="stat-card skills">
                    <h3>Development Focus</h3>
                    <ul class="skill-list">
                        {#each gitrollStats.topSkills as skill}
                            <li class="skill-item">{skill}</li>
                        {/each}
                    </ul>
                </div>
            </div>

            <div class="activity-section">
                <h3 class="activity-title">Recent Code Quality Improvements</h3>
                <div class="activity-timeline">
                    {#each gitrollStats.recentActivity as activity}
                        <div class="activity-item">
                            <div class="activity-icon">{activity.type === 'commit' ? '✓' : '★'}</div>
                            <div class="activity-details">
                                <h4>{activity.project}</h4>
                                <p>{activity.description}</p>
                                <time>{new Date(activity.date).toLocaleDateString('en-US', { 
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}</time>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="view-stats-section">
            <a href="https://gitroll.io/profile/uQO0DpfZuTuZYEAWlwINJl6MNbou1" 
               target="_blank" 
               class="stats-banner-link">
                <div class="stats-banner">
                    <div class="banner-content">
                        <div class="banner-left">
                            <span class="banner-tag">EXCLUSIVE ACCESS</span>
                        </div>
                        <div class="banner-center">
                            <h3 class="banner-headline">VIEW COMPLETE DEVELOPMENT METRICS</h3>
                            <p class="banner-subtext">Detailed Analysis • Performance Metrics • Code Quality Insights</p>
                        </div>
                        <div class="banner-right">
                            <div class="stats-cta">
                                <span class="cta-text">VIEW FULL REPORT</span>
                                <span class="cta-arrow">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        <div class="newspaper-footer">
            <div class="footer-line"></div>
            <p class="footer-text">Code Quality Report • Updated Daily • Comprehensive Developer Analytics</p>
        </div>
    </div>
</section>

<style>
    .gitroll-section {
        padding: 60px 20px;
        background-color: #f5f5f0;
        font-family: 'Old Standard TT', serif;
    }

    .newspaper-container {
        max-width: 1200px;
        margin: 0 auto;
        background: #fff;
        padding: 40px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin: 40px 0;
    }

    .stat-card {
        background: #fff;
        padding: 25px;
        border: 1px solid #ddd;
        text-align: center;
        transition: all 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border-color: #FFD700;
    }

    .stat-card h3 {
        font-family: 'Special Elite', cursive;
        font-size: 1.2rem;
        margin: 0 0 15px;
        color: #000;
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #000;
        margin: 10px 0;
        font-family: 'IM Fell English', serif;
    }

    .stat-description {
        color: #666;
        font-style: italic;
        margin: 5px 0 0;
    }

    .language-list, .skill-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .language-item, .skill-item {
        background: #000;
        color: #FFD700;
        padding: 5px 10px;
        margin: 5px 0;
        border-radius: 3px;
        font-size: 0.9rem;
    }

    .activity-section {
        margin: 50px 0;
        padding: 30px;
        border: 1px solid #ddd;
        background: #f9f9f9;
    }

    .activity-title {
        font-family: 'Special Elite', cursive;
        font-size: 1.4rem;
        margin: 0 0 20px;
        text-align: center;
        color: #000;
    }

    .activity-timeline {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        background: #fff;
        border: 1px solid #eee;
        transition: all 0.3s ease;
    }

    .activity-item:hover {
        transform: translateX(10px);
        border-color: #FFD700;
    }

    .activity-icon {
        background: #000;
        color: #FFD700;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 1rem;
    }

    .activity-details {
        flex: 1;
    }

    .activity-details h4 {
        margin: 0;
        font-size: 1.1rem;
        color: #000;
    }

    .activity-details p {
        margin: 5px 0;
        color: #666;
    }

    .activity-details time {
        font-size: 0.9rem;
        color: #999;
        font-style: italic;
    }

    .gitroll-cta {
        text-align: center;
        margin-top: 40px;
    }

    .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #000;
        color: #FFD700;
        padding: 12px 25px;
        text-decoration: none;
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        border: 1px solid #000;
        transition: all 0.3s ease;
    }

    .cta-button:hover {
        background: #FFD700;
        color: #000;
    }

    .cta-arrow {
        transition: transform 0.3s ease;
    }

    .cta-button:hover .cta-arrow {
        transform: translateX(5px);
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 30px 0;
    }

    .metric-card {
        background: #fff;
        padding: 25px;
        border: 1px solid #ddd;
        text-align: center;
        transition: all 0.3s ease;
    }

    .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border-color: #FFD700;
    }

    .metric-number {
        font-size: 2.8rem;
        font-weight: 700;
        color: #000;
        margin: 15px 0;
        font-family: 'IM Fell English', serif;
    }

    .metric-description {
        color: #666;
        font-style: italic;
        margin: 5px 0 0;
    }

    .headline-metrics {
        text-align: right;
        padding: 20px 0;
    }

    .overall-rating {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .rating-label {
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        color: #666;
    }

    .rating-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #000;
        margin: 5px 0;
        font-family: 'IM Fell English', serif;
    }

    .rating-percentile {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
    }

    .view-stats-section {
        margin: 50px 0 30px;
        padding: 2px;
        background: linear-gradient(45deg, #000 0%, #111 100%);
        position: relative;
        overflow: hidden;
    }

    .view-stats-section::before {
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

    .stats-banner {
        background: linear-gradient(45deg, #000 0%, #111 100%);
        padding: 30px;
        transition: all 0.3s ease;
    }

    .banner-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
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

    .stats-cta {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #FFD700;
        color: #000;
        padding: 12px 25px;
        border-radius: 3px;
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        font-weight: bold;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid #FFD700;
    }

    .stats-cta:hover {
        background: transparent;
        color: #FFD700;
        transform: translateY(-2px);
    }

    .cta-arrow {
        transition: transform 0.3s ease;
    }

    .stats-cta:hover .cta-arrow {
        transform: translateX(5px);
    }

    .newspaper-footer {
        margin-top: 40px;
        padding-top: 20px;
        text-align: center;
    }

    .footer-line {
        height: 1px;
        background: #000;
        margin-bottom: 15px;
    }

    .footer-text {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
    }

    .stats-banner-link {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
    }

    .stats-banner-link:hover {
        transform: translateY(-2px);
    }

    .stats-banner-link:hover .stats-banner {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .stats-banner-link:hover .banner-headline {
        color: #FFF;
    }

    .stats-banner-link:hover .stats-cta {
        background: transparent;
        color: #FFD700;
    }

    .stats-banner-link:hover .cta-arrow {
        transform: translateX(5px);
    }

    @media (max-width: 1024px) {
        .newspaper-container {
            padding: 30px 20px;
        }

        .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .metric-number, .stat-number {
            font-size: 2.2rem;
        }
    }

    @media (max-width: 768px) {
        .newspaper-container {
            padding: 20px 15px;
        }

        .masthead-title {
            font-size: 2rem;
        }

        .section-headline {
            font-size: 1.5rem;
        }

        .metrics-grid, .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .activity-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
        }

        .activity-icon {
            margin-bottom: 10px;
        }

        .banner-content {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
        }

        .banner-left, .banner-center, .banner-right {
            width: 100%;
            text-align: center;
        }

        .banner-headline {
            font-size: 1.2rem;
        }

        .stats-cta {
            width: 100%;
            justify-content: center;
        }

        .language-list, .skill-list {
            justify-content: center;
        }

        .language-item, .skill-item {
            width: calc(50% - 10px);
            text-align: center;
        }
    }

    @media (max-width: 480px) {
        .newspaper-container {
            padding: 15px 10px;
        }

        .masthead-title {
            font-size: 1.5rem;
        }

        .section-headline {
            font-size: 1.2rem;
        }

        .metric-number, .stat-number {
            font-size: 1.8rem;
        }

        .activity-timeline {
            gap: 10px;
        }

        .activity-details h4 {
            font-size: 1rem;
        }

        .activity-details p, .activity-details time {
            font-size: 0.85rem;
        }

        .language-item, .skill-item {
            width: 100%;
            font-size: 0.85rem;
        }

        .banner-tag {
            font-size: 0.8rem;
        }

        .banner-subtext {
            font-size: 0.8rem;
        }

        .stats-cta {
            padding: 10px 15px;
            font-size: 0.85rem;
        }
    }
</style> 