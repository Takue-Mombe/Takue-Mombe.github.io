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

    <div class="navigation" class:active={isMenuOpen}>
        <ul>
            {#each ['Home', 'About', 'Projects', 'Contact'] as item, i}
                <li>
                    <a 
                        href="#{item.toLowerCase()}" 
                        class:active={item === 'Home'}
                        on:click={() => {
                            isMenuOpen = false;
                            document.body.style.overflow = '';
                        }}
                    >
                        {item}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</div>
