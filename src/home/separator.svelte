<script>
    export let text = "CONTINUED ON THIS PAGE";
</script>

<div class="newspaper-separator">
    <div class="separator-content">
        <div class="separator-line"></div>
        <div class="separator-center">
            <span class="separator-icon">✦</span>
            <span class="separator-text">{text}</span>
            <span class="separator-icon">✦</span>
        </div>
        <div class="separator-line"></div>
    </div>
    <div class="separator-ornament">
        <div class="ornament-line"></div>
        <div class="ornament-diamond">◆</div>
        <div class="ornament-line"></div>
    </div>
</div>

<style>
    .newspaper-separator {
        padding: 30px 20px;
        background-color: #f5f5f0;
        font-family: 'Old Standard TT', serif;
    }

    .separator-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .separator-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, #000, transparent);
    }

    .separator-center {
        display: flex;
        align-items: center;
        gap: 15px;
        white-space: nowrap;
    }

    .separator-text {
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        color: #666;
        letter-spacing: 1px;
    }

    .separator-icon {
        color: #FFD700;
        font-size: 1rem;
    }

    .separator-ornament {
        max-width: 200px;
        margin: 10px auto 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .ornament-line {
        flex: 1;
        height: 1px;
        background: #000;
    }

    .ornament-diamond {
        color: #000;
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .newspaper-separator {
            padding: 20px 15px;
        }

        .separator-text {
            font-size: 0.8rem;
        }
    }
</style> 