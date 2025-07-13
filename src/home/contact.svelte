<script>
    import '../style/components/contact.css'
    import { onMount } from 'svelte';
    import emailjs from '@emailjs/browser';

    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
    
    let isSubmitting = false;
    let submitStatus = null;

    // Initialize EmailJS with your public key
    emailjs.init("B31rxbPMCio3oeS6_");

    onMount(() => {
        particlesJS('particles-contact', {
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#FFD700' // Changed to gold
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.3,
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
                    color: '#FFD700', // Changed to gold
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
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
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    });

    async function handleSubmit() {
        isSubmitting = true;
        submitStatus = null;
        
        try {
            const response = await emailjs.send(
                "service_9hcq2g4",
                "template_gxanx4b",
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    reply_to: "mombejose@gmail.com",
                    to_email: "mombejose@gmail.com",
                    company_name: "Mombe Digitals"
                },
                "B31rxbPMCio3oeS6_"
            );
            
            submitStatus = {
                type: 'success',
                message: 'Thank you! Your message has been sent successfully.'
            };
            
            // Reset form
            formData = {
                name: '',
                email: '',
                subject: '',
                message: ''
            };
            
        } catch (error) {
            submitStatus = {
                type: 'error',
                message: `Error: ${error.message || 'Something went wrong. Please try again.'}`
            };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="contact-section" id="contact">
    <div id="particles-contact" class="particles-js"></div>
    <div class="newspaper-container">
        <div class="newspaper-header">
            <div class="newspaper-masthead">
                <div class="newspaper-title">
                    <h1 class="masthead-title">THE DAILY DEVELOPER</h1>
                    <p class="masthead-subtitle">Est. 2024 • Vol. 1, No. 1 • www.takuemombe.me</p>
                </div>
                <div class="newspaper-date">
                    <p class="date-line">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p class="price-line">Price: 1 Bitcoin</p>
                </div>
            </div>
            
            <div class="headline-section">
                <div class="headline-column">
                    <h2 class="section-headline">CONTACT THE EDITOR</h2>
                    <p class="section-subhead">Send Your Inquiries and Correspondence</p>
                </div>
                <div class="headline-column">
                    <p class="newspaper-byline">For Immediate Publication Consideration</p>
                </div>
            </div>
            
            <div class="newspaper-divider">
                <div class="divider-line"></div>
                <div class="divider-icon">✻</div>
                <div class="divider-line"></div>
            </div>
        </div>

        <div class="contact-content">
            <div class="contact-columns">
                <div class="contact-form-column">
                    <form class="contact-form" on:submit|preventDefault={handleSubmit}>
                        <div class="form-group">
                            <label class="form-label">YOUR NAME</label>
                            <input 
                                type="text" 
                                name="name" 
                                bind:value={formData.name}
                                placeholder="Enter your full name"
                                required
                                class="form-input"
                            />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">TELEGRAPH ADDRESS</label>
                            <input 
                                type="email" 
                                name="email" 
                                bind:value={formData.email}
                                placeholder="Your electronic mail"
                                required
                                class="form-input"
                            />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">SUBJECT MATTER</label>
                            <input 
                                type="text" 
                                name="subject" 
                                bind:value={formData.subject}
                                placeholder="Nature of your correspondence"
                                required
                                class="form-input"
                            />
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">YOUR MESSAGE</label>
                            <textarea 
                                name="message" 
                                bind:value={formData.message}
                                placeholder="Compose your message here..."
                                rows="5"
                                required
                                class="form-textarea"
                            ></textarea>
                        </div>
                        
                        <button type="submit" class="submit-btn" disabled={isSubmitting}>
                            <span class="btn-icon">✉</span>
                            {isSubmitting ? 'Dispatching...' : 'Send Correspondence'}
                        </button>
                    </form>

                    {#if submitStatus}
                        <div class="status-message {submitStatus.type}">
                            <div class="status-icon">
                                {#if submitStatus.type === 'success'}
                                    ✓
                                {:else}
                                    !
                                {/if}
                            </div>
                            {submitStatus.message}
                        </div>
                    {/if}
                </div>
                
                <div class="contact-info-column">
                    <div class="contact-card">
                        <h3 class="card-title">EDITORIAL OFFICE</h3>
                        <div class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <span>mombejose@gmail.com</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-phone"></i>
                            <span>+263 78 875 4745</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Harare, Zimbabwe</span>
                        </div>
                    </div>
                    
                    <div class="office-hours">
                        <h3 class="card-title">PUBLICATION HOURS</h3>
                        <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                        <p>Saturday: 9:00 AM - 1:00 PM</p>
                        <p>Sunday: Closed</p>
                    </div>
                    
                    <div class="dispatch-notice">
                        <p>All correspondence will be answered within 24-48 hours during publication days.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="newspaper-footer">
            <div class="footer-line"></div>
            <p class="footer-text">© 2024 The Daily Developer. All rights reserved. | Next Edition: Tomorrow Morning</p>
        </div>
    </div>
    
    <!-- Floating social buttons -->
    <div class="floating-socials">
        <a href="https://wa.me/788754745" target="_blank" rel="noopener noreferrer" class="social-btn whatsapp">
            <i class="fab fa-whatsapp"></i>
            <span class="tooltip">Send Telegram</span>
        </a>
        <a href="https://x.com/JoseMombe" target="_blank" rel="noopener noreferrer" class="social-btn twitter">
            <i class="fab fa-twitter"></i>
            <span class="tooltip">Dispatch Pigeon</span>
        </a>
        <a href="mailto:mombejose@gmail.com" class="social-btn email">
            <i class="fas fa-envelope"></i>
            <span class="tooltip">Send Courier</span>
        </a>
    </div>
</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Special+Elite&family=IM+Fell+English:ital@0;1&display=swap');
    
    .contact-section {
        position: relative;
        padding: 40px 20px;
        background-color: #f5f5f0;
        background-image: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/></svg>');
        font-family: 'Old Standard TT', serif;
        color: #222;
        min-height: 100vh;
    }
    
    #particles-contact {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
        opacity: 0.3;
    }
    
    .newspaper-container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: #fff;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
        padding: 40px;
        position: relative;
        z-index: 1;
        border: 1px solid #ddd;
    }
    
    .contact-content {
        margin-top: 40px;
    }
    
    .contact-columns {
        display: flex;
        gap: 50px;
    }
    
    .contact-form-column {
        flex: 2;
    }
    
    .contact-info-column {
        flex: 1;
    }
    
    .contact-form {
        margin-top: 20px;
    }
    
    .form-group {
        margin-bottom: 25px;
    }
    
    .form-label {
        display: block;
        font-family: 'Special Elite', cursive;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        color: #555;
    }
    
    .form-input,
    .form-textarea {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        background: #fff;
        font-family: 'IM Fell English', serif;
        font-size: 1rem;
        transition: all 0.3s ease;
        border-left: 3px solid #000;
    }
    
    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #FFD700;
        box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
    }
    
    .form-textarea {
        min-height: 150px;
        resize: vertical;
    }
    
    .submit-btn {
        background: #000;
        color: #FFD700;
        border: none;
        padding: 15px 30px;
        font-family: 'Special Elite', cursive;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }
    
    .submit-btn:hover {
        background: #FFD700;
        color: #000;
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .btn-icon {
        font-size: 1.2rem;
    }
    
    .status-message {
        padding: 15px;
        margin-top: 30px;
        border: 1px solid;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'IM Fell English', serif;
    }
    
    .status-message.success {
        background: rgba(0, 128, 0, 0.1);
        border-color: green;
        color: darkgreen;
    }
    
    .status-message.error {
        background: rgba(255, 0, 0, 0.1);
        border-color: darkred;
        color: darkred;
    }
    
    .status-icon {
        font-weight: bold;
        font-size: 1.2rem;
    }
    
    .contact-card {
        background: #f5f5f0;
        padding: 25px;
        margin-bottom: 30px;
        border-top: 3px double #000;
    }
    
    .card-title {
        font-family: 'Special Elite', cursive;
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 20px;
        color: #000;
    }
    
    .contact-method {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
        font-family: 'IM Fell English', serif;
    }
    
    .contact-method i {
        color: #FFD700;
        width: 20px;
        text-align: center;
    }
    
    .office-hours {
        padding: 25px 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        margin-bottom: 30px;
    }
    
    .office-hours p {
        font-family: 'IM Fell English', serif;
        margin: 0 0 10px;
    }
    
    .dispatch-notice {
        font-family: 'IM Fell English', serif;
        font-size: 0.9rem;
        font-style: italic;
        color: #666;
    }
    
    .floating-socials {
        position: fixed;
        bottom: 30px;
        right: 30px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 100;
    }
    
    .social-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        position: relative;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .social-btn:hover {
        transform: translateY(-5px);
    }
    
    .social-btn.whatsapp {
        background: #25D366;
    }
    
    .social-btn.twitter {
        background: #1DA1F2;
    }
    
    .social-btn.email {
        background: #000;
    }
    
    .tooltip {
        position: absolute;
        right: 60px;
        background: #000;
        color: #FFD700;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 0.8rem;
        font-family: 'Special Elite', cursive;
        opacity: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
    }
    
    .social-btn:hover .tooltip {
        opacity: 1;
        right: 70px;
    }
    
    @media (max-width: 1000px) {
        .contact-columns {
            flex-direction: column;
        }
    }
    
    @media (max-width: 768px) {
        .newspaper-container {
            padding: 20px;
        }
        
        .floating-socials {
            bottom: 20px;
            right: 20px;
        }
    }
    
    @media (max-width: 480px) {
        .social-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
        
        .tooltip {
            display: none;
        }
    }
</style>