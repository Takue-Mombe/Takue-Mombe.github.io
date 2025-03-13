<script>
    import '../style/components/topnav.css';
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';

    let isMenuOpen = false;
    let isScrolled = false;

    // Handle scroll effect
    onMount(() => {
        window.addEventListener('scroll', () => {
            isScrolled = window.scrollY > 50;
        });

        // Close menu when clicking outside
        window.addEventListener('click', (e) => {
            if (isMenuOpen && !e.target.closest('.navigation') && !e.target.closest('.hamburger')) {
                isMenuOpen = false;
            }
        });
    });

    // Toggle mobile menu
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        // Prevent scrolling when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    };

    // Add this function to handle scroll to sections
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
    <div class="logo">
        <a href="#" style="transform: scale(1)">
            <img src="/images/logo.png" alt="MOMBE Digitals Logo" 
                 in:fly="{{ y: -20, duration: 1000 }}"/>
        </a>
    </div>

    <div class="hamburger" class:active={isMenuOpen} on:click={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
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
                        {item}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</div>

<!-- Add some spacing below the fixed navbar -->
<style>
    :global(body) {
        padding-top: 77px; /* Adjust this value based on your navbar height */
    }
</style>
