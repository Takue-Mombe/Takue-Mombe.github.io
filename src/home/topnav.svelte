<script>
    import '../style/components/topnav.css';
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';

    let isMenuOpen = false;
    let isScrolled = false;
    let currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });

    // Handle scroll effect
    onMount(() => {
        window.addEventListener('scroll', () => {
            isScrolled = window.scrollY > 50;
        });

        // Close menu when clicking outside
        window.addEventListener('click', (e) => {
            if (isMenuOpen && !e.target.closest('.navigation') && !e.target.closest('.hamburger')) {
                isMenuOpen = false;
                document.body.style.overflow = '';
            }
        });
    });

    // Toggle mobile menu
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    };

    // Scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const elementPosition = element.offsetTop;
            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: 'smooth'
            });
        }
        isMenuOpen = false;
        document.body.style.overflow = '';
    };
</script>

<div class="main-nav" class:scrolled={isScrolled}>
    <div class="newspaper-masthead">
        <div class="masthead-left">
            <div class="logo">
                <a href="#" style="transform: scale(1)">
                    <img src="/images/logo.png" alt="MOMBE Digitals Logo" 
                         in:fly="{{ y: -20, duration: 1000 }}"/>
                </a>
            </div>
            <div class="masthead-title">
                <span>THE DAILY DEVELOPER</span>
                <span class="edition-info">Evening Edition • {currentDate}</span>
            </div>
        </div>
        
        <div class="hamburger" class:active={isMenuOpen} on:click={toggleMenu}>
            <div class="hamburger-line top-line"></div>
            <div class="hamburger-line middle-line"></div>
            <div class="hamburger-line bottom-line"></div>
        </div>
    </div>

    <nav class="navigation" class:active={isMenuOpen}>
        <ul>
            {#each ['Home', 'About', 'Projects', 'Contact'] as item, i}
                <li style="--item-index: {i}">
                    <a 
                        href="#{item.toLowerCase()}" 
                        class:active={item === 'Home'}
                        on:click|preventDefault={() => {
                            scrollToSection(item.toLowerCase());
                        }}
                    >
                        <span class="nav-item-number">0{i+1}</span>
                        <span class="nav-item-text">{item}</span>
                    </a>
                </li>
            {/each}
        </ul>
        
        <div class="mobile-nav-footer">
            <div class="weather-report">
                <i class="fas fa-cloud-sun"></i>
                <span>72° • Mostly Sunny</span>
            </div>
            <div class="price-tag">
                <span>Price: 1 Bitcoin</span>
            </div>
        </div>
    </nav>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
    
    :global(body) {
        padding-top: 90px; /* Adjust based on your navbar height */
    }
    
    .main-nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #fff;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .main-nav.scrolled {
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.98);
        backdrop-filter: blur(5px);
    }
    
    .newspaper-masthead {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .masthead-left {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .logo img {
        height: 40px;
        transition: transform 0.3s ease;
    }
    
    .logo:hover img {
        transform: scale(1.1);
    }
    
    .masthead-title {
        display: flex;
        flex-direction: column;
        font-family: 'Special Elite', cursive;
    }
    
    .masthead-title span:first-child {
        font-size: 1.2rem;
        font-weight: bold;
        letter-spacing: 1px;
        color: #000;
    }
    
    .edition-info {
        font-family: 'IM Fell English', serif;
        font-size: 0.8rem;
        color: #666;
        font-style: italic;
    }
    
    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-between;
        width: 30px;
        height: 20px;
        cursor: pointer;
        z-index: 1001;
        position: relative;
    }
    
    .hamburger-line {
        height: 2px;
        width: 100%;
        background: #000;
        transition: all 0.3s ease;
        transform-origin: center;
    }
    
    .hamburger.active .top-line {
        transform: translateY(9px) rotate(45deg);
    }
    
    .hamburger.active .middle-line {
        opacity: 0;
    }
    
    .hamburger.active .bottom-line {
        transform: translateY(-9px) rotate(-45deg);
    }
    
    .navigation {
        display: flex;
        justify-content: center;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .navigation ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .navigation li {
        position: relative;
    }
    
    .navigation li::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: #FFD700;
        transition: all 0.3s ease;
    }
    
    .navigation li:hover::after {
        width: 100%;
        left: 0;
    }
    
    .navigation a {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 25px;
        text-decoration: none;
        color: #000;
        font-family: 'Old Standard TT', serif;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
    }
    
    .nav-item-number {
        font-family: 'Special Elite', cursive;
        font-size: 0.7rem;
        color: #FFD700;
        margin-bottom: 3px;
    }
    
    .nav-item-text {
        position: relative;
    }
    
    .navigation a.active {
        color: #FFD700;
        font-weight: bold;
    }
    
    .mobile-nav-footer {
        display: none;
        padding: 20px;
        background: #f5f5f0;
        border-top: 1px solid #ddd;
    }
    
    .weather-report, .price-tag {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        color: #666;
    }
    
    .weather-report i {
        color: #FFD700;
    }
    
    @media (max-width: 992px) {
        .hamburger {
            display: flex;
        }
        
        .navigation {
            position: fixed;
            top: 0;
            right: -100%;
            width: 300px;
            height: 100vh;
            background: #fff;
            flex-direction: column;
            justify-content: flex-start;
            padding-top: 80px;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            border-left: 1px solid #ddd;
        }
        
        .navigation.active {
            right: 0;
        }
        
        .navigation ul {
            flex-direction: column;
            width: 100%;
        }
        
        .navigation li::after {
            display: none;
        }
        
        .navigation a {
            padding: 15px 25px;
            flex-direction: row;
            gap: 15px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .nav-item-number {
            margin-bottom: 0;
        }
        
        .mobile-nav-footer {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
        }
    }
    
    @media (max-width: 576px) {
        .masthead-title span:first-child {
            font-size: 1rem;
        }
        
        .edition-info {
            font-size: 0.7rem;
        }
        
        .navigation {
            width: 100%;
            right: -100%;
        }
        
        .navigation.active {
            right: 0;
        }
    }
</style>