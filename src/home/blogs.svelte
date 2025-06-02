<script>
    import '../style/components/blog.css';

    import { onMount } from 'svelte';
  
  let typewriterText = '';
  const fullText = 'Where silicon dreams meet liquid logic...';
  let isVisible = false;
  
  onMount(() => {
    isVisible = true;
    // Typewriter effect
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        typewriterText += fullText.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
    
    return () => clearInterval(typeInterval);
  });
  
  const blogPosts = [
    {
      title: "Neural Networks and Coffee: A Developer's Morning Ritual",
      summary: "Exploring how AI-assisted debugging transforms the sacred art of morning code reviews, one caffeinated commit at a time.",
      date: "2025.05.28",
      tags: ["AI", "DevTools", "Automation"]
    },
    {
      title: "Ghost in the Shell Script: Automating the Invisible",
      summary: "Deep dive into background processes that make modern development feel like magic—from CI/CD pipelines to intelligent code completion.",
      date: "2025.05.21", 
      tags: ["Automation", "DevOps", "Shell"]
    },
    {
      title: "The Poetry of Clean Code: When Algorithms Dance",
      summary: "Why beautiful code isn't just functional—it's an art form. Examining the intersection of creativity and computational thinking.",
      date: "2025.05.14",
      tags: ["Clean Code", "Philosophy", "Craft"]
    }
  ];
</script>

<main class="cyber-container" class:visible={isVisible}>
  <!-- Header Section -->
  <header class="cyber-header">
    <div class="glitch-wrapper">
      <h1 class="cyber-title" data-text="NEURAL CODEX">NEURAL CODEX</h1>
    </div>
    <div class="typewriter-container">
      <p class="typewriter">{typewriterText}<span class="cursor">█</span></p>
    </div>
  </header>

  <!-- Welcome Section -->
  <section class="welcome-section">
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="btn-close"></span>
          <span class="btn-minimize"></span>
          <span class="btn-maximize"></span>
        </div>
        <span class="terminal-title">~/dev/thoughts</span>
      </div>
      <div class="terminal-body">
        <div class="welcome-text">
          <p class="cyber-welcome">
            In the vast expanse of digital consciousness, where <span class="highlight">algorithms breathe</span> 
            and <span class="highlight">data flows like poetry</span>, welcome to my neural sanctuary.
          </p>
          <p class="cyber-subtitle">
            Here, human intuition merges with artificial intelligence to craft tomorrow's code today.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Subheading -->
  <section class="tagline-section">
    <div class="neon-border">
      <p class="cyber-tagline">
        <span class="bracket">[</span>
        Weekly chronicles from the intersection of creativity, code, and computational thinking
        <span class="bracket">]</span>
      </p>
    </div>
  </section>

  <!-- Latest Posts -->
  <section class="posts-section">
    <h2 class="section-title">
      <span class="title-decoration">></span> LATEST_TRANSMISSIONS
      <span class="cursor-blink">_</span>
    </h2>
    
    <div class="posts-grid">
      {#each blogPosts as post, i}
        <article class="post-card" style="animation-delay: {i * 0.2}s">
          <div class="post-header">
            <span class="post-date">{post.date}</span>
            <div class="post-tags">
              {#each post.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </div>
          <h3 class="post-title">{post.title}</h3>
          <p class="post-summary">{post.summary}</p>
          <div class="post-footer">
            <button class="read-more">
              <span>DECRYPT</span>
              <span class="arrow">→</span>
            </button>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- Call to Action -->
  <section class="cta-section">
    <div class="cta-container">
      <div class="cta-text">
        <h3 class="cta-title">Join the Neural Network</h3>
        <p class="cta-description">
          Subscribe to receive weekly transmissions directly to your neural interface.
          Explore the archive of digital wisdom or contribute to the collective consciousness.
        </p>
      </div>
      <div class="cta-buttons">
        <button class="cta-btn primary">
          <span class="btn-text">INITIALIZE_SUBSCRIPTION</span>
          <div class="btn-glow"></div>
        </button>
        <button class="cta-btn secondary">
          <span class="btn-text">BROWSE_ARCHIVE</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Background Effects -->
  <div class="cyber-bg">
    <div class="grid-overlay"></div>
    <div class="particle-field">
      {#each Array(20) as _, i}
        <div class="particle" style="animation-delay: {i * 0.5}s; left: {Math.random() * 100}%; animation-duration: {3 + Math.random() * 4}s"></div>
      {/each}
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Source+Code+Pro:wght@300;400;600&display=swap');

  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0a0a;
    color: #00ff41;
    font-family: 'Source Code Pro', monospace;
    overflow-x: hidden;
  }

  /* Main Container */
  .cyber-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%);
    position: relative;
    padding: 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 1s ease-out;
  }

  .cyber-container.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Background Effects */
  .cyber-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }

  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridPulse 4s ease-in-out infinite;
  }

  .particle-field {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #00ff41;
    border-radius: 50%;
    animation: particleFloat linear infinite;
    box-shadow: 0 0 6px #00ff41;
  }

  /* Header */
  .cyber-header {
    text-align: center;
    margin: 4rem 0 6rem 0;
  }

  .glitch-wrapper {
    margin-bottom: 2rem;
  }

  .cyber-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    color: #00ff41;
    text-shadow: 
      0 0 10px #00ff41,
      0 0 20px #00ff41,
      0 0 40px #00ff41;
    position: relative;
    margin: 0;
    animation: titleGlow 2s ease-in-out infinite alternate;
  }

  .cyber-title::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #ff0040;
    animation: glitch 0.3s linear infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }

  .typewriter-container {
    margin-top: 1rem;
  }

  .typewriter {
    font-family: 'Source Code Pro', monospace;
    font-size: 1.5rem;
    color: #00ff41;
    margin: 0;
  }

  .cursor {
    animation: blink 1s infinite;
  }

  /* Terminal Welcome */
  .welcome-section {
    max-width: 800px;
    margin: 0 auto 4rem auto;
  }

  .terminal-window {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #00ff41;
    border-radius: 8px;
    box-shadow: 
      0 0 20px rgba(0, 255, 65, 0.3),
      inset 0 0 20px rgba(0, 255, 65, 0.1);
    overflow: hidden;
  }

  .terminal-header {
    background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #333;
  }

  .terminal-buttons {
    display: flex;
    gap: 0.5rem;
    margin-right: 1rem;
  }

  .terminal-buttons span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .btn-close { background: #ff5f57; }
  .btn-minimize { background: #ffbd2e; }
  .btn-maximize { background: #28ca42; }

  .terminal-title {
    color: #888;
    font-size: 0.9rem;
  }

  .terminal-body {
    padding: 2rem;
  }

  .cyber-welcome {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 1rem;
    color: #00ff41;
  }

  .cyber-subtitle {
    font-size: 1rem;
    color: #00ccff;
    margin: 0;
    font-style: italic;
  }

  .highlight {
    color: #ff0080;
    text-shadow: 0 0 10px #ff0080;
  }

  /* Tagline */
  .tagline-section {
    text-align: center;
    margin: 4rem 0;
  }

  .neon-border {
    display: inline-block;
    padding: 1rem 2rem;
    border: 2px solid #00ff41;
    border-radius: 4px;
    background: rgba(0, 255, 65, 0.05);
    box-shadow: 
      0 0 20px rgba(0, 255, 65, 0.3),
      inset 0 0 20px rgba(0, 255, 65, 0.1);
  }

  .cyber-tagline {
    margin: 0;
    font-size: 1.1rem;
    color: #00ff41;
  }

  .bracket {
    color: #ff0080;
    font-weight: bold;
  }

  /* Posts Section */
  .posts-section {
    max-width: 1200px;
    margin: 0 auto 4rem auto;
  }

  .section-title {
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    color: #00ff41;
    margin-bottom: 3rem;
    text-align: center;
  }

  .title-decoration {
    color: #ff0080;
    margin-right: 0.5rem;
  }

  .cursor-blink {
    animation: blink 1s infinite;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .post-card {
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid #333;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.6s ease-out forwards;
    position: relative;
    overflow: hidden;
  }

  .post-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .post-card:hover {
    border-color: #00ff41;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    transform: translateY(-5px);
  }

  .post-card:hover::before {
    left: 100%;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .post-date {
    color: #00ccff;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .post-tags {
    display: flex;
    gap: 0.5rem;
  }

  .tag {
    background: rgba(255, 0, 128, 0.2);
    color: #ff0080;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
    font-size: 0.7rem;
    border: 1px solid #ff0080;
  }

  .post-title {
    color: #00ff41;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .post-summary {
    color: #ccc;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .post-footer {
    display: flex;
    justify-content: flex-end;
  }

  .read-more {
    background: transparent;
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    font-family: 'Source Code Pro', monospace;
  }

  .read-more:hover {
    background: #00ff41;
    color: #000;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
  }

  .arrow {
    transition: transform 0.3s ease;
  }

  .read-more:hover .arrow {
    transform: translateX(5px);
  }

  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(255, 0, 128, 0.1));
    border: 1px solid #333;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;
    margin: 4rem auto;
    max-width: 800px;
  }

  .cta-title {
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    color: #00ff41;
    margin-bottom: 1rem;
  }

  .cta-description {
    color: #ccc;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-btn {
    padding: 1rem 2rem;
    border-radius: 4px;
    font-family: 'Source Code Pro', monospace;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .cta-btn.primary {
    background: #00ff41;
    color: #000;
    border: none;
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }

  .cta-btn.primary:hover {
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
    transform: translateY(-2px);
  }

  .cta-btn.secondary {
    background: transparent;
    color: #00ff41;
    border: 1px solid #00ff41;
  }

  .cta-btn.secondary:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }

  .btn-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  .cta-btn.primary:hover .btn-glow {
    left: 100%;
  }

  /* Animations */
  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
  }

  @keyframes titleGlow {
    0% { text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 40px #00ff41; }
    100% { text-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41, 0 0 60px #00ff41; }
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.1; }
  }

  @keyframes particleFloat {
    0% { 
      transform: translateY(100vh) translateX(0px);
      opacity: 0;
    }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { 
      transform: translateY(-100px) translateX(50px);
      opacity: 0;
    }
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .cyber-container {
      padding: 1rem;
    }

    .cyber-title {
      font-size: 3rem;
    }

    .typewriter {
      font-size: 1.2rem;
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }

    .cta-section {
      padding: 2rem;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-btn {
      width: 100%;
      max-width: 300px;
    }
  }
</style>