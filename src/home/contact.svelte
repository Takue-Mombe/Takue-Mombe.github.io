<script>
    import '../style/components/contact.css'
    import { onMount } from 'svelte';

    let formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };
    
    let isSubmitting = false;
    let submitStatus = null;

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
                    value: '#007bff'
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
                    color: '#007bff',
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
            // Here you would typically send the data to your backend
            // For demonstration, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
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
                message: 'Oops! Something went wrong. Please try again.'
            };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section class="contact-section" id="contact">
    <div id="particles-contact" class="particles-js"></div>
    <div class="contact-container">
        <h2>Get in Touch</h2>
        <p class="contact-description">Have a question or want to work together? Drop me a message!</p>
        
        <form class="contact-form" on:submit|preventDefault={handleSubmit}>
            <div class="form-group">
                <input 
                    type="text" 
                    name="name" 
                    bind:value={formData.name}
                    placeholder="Your Name"
                    required
                />
            </div>
            
            <div class="form-group">
                <input 
                    type="email" 
                    name="email" 
                    bind:value={formData.email}
                    placeholder="Your Email"
                    required
                />
            </div>
            
            <div class="form-group">
                <input 
                    type="text" 
                    name="subject" 
                    bind:value={formData.subject}
                    placeholder="Subject"
                    required
                />
            </div>
            
            <div class="form-group">
                <textarea 
                    name="message" 
                    bind:value={formData.message}
                    placeholder="Your Message"
                    rows="5"
                    required
                ></textarea>
            </div>
            
            <button type="submit" class="submit-btn">
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>

        {#if submitStatus}
            <div class="status-message {submitStatus.type}">
                {submitStatus.message}
            </div>
        {/if}
    </div>
    
    <!-- Floating social buttons -->
    <div class="floating-socials">
        <a href="https://wa.me/788754745" target="_blank" rel="noopener noreferrer" class="social-btn whatsapp">
            <i class="fab fa-whatsapp"></i>
            <span class="tooltip">WhatsApp</span>
        </a>
        <a href="https://x.com/JoseMombe" target="_blank" rel="noopener noreferrer" class="social-btn twitter">
            <i class="fab fa-x-twitter"></i>
            <span class="tooltip">Twitter</span>
        </a>
        <a href="mailto:mombejose@gmail.com" class="social-btn email">
            <i class="fas fa-envelope"></i>
            <span class="tooltip">Email</span>
        </a>
    </div>
</section>

<style>
    /* Add to existing styles */
    .particles-js {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .contact-container {
        position: relative;
        z-index: 2;
    }

    .floating-socials {
        z-index: 3;
    }

    /* Floating Social Buttons */
    .floating-socials {
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 1000;
    }

    .social-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        text-decoration: none;
        position: relative;
        transition: all 0.3s ease;
    }

    .social-btn:hover {
        transform: translateX(-10px);
    }

    .social-btn .tooltip {
        position: absolute;
        right: 60px;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .social-btn:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }

    .whatsapp {
        background: #25D366;
    }

    .twitter {
        background: #000000;
    }

    .email {
        background: #EA4335;
    }

    /* Responsive Design for Social Buttons */
    @media (max-width: 768px) {
        .floating-socials {
            position: fixed;
            bottom: 20px;
            right: 50%;
            transform: translateX(50%);
            top: auto;
            flex-direction: row;
        }

        .social-btn:hover {
            transform: translateY(-10px);
        }

        .social-btn .tooltip {
            bottom: 60px;
            right: auto;
            left: 50%;
            transform: translateX(-50%);
        }
    }
</style>
