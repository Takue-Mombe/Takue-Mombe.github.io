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
    emailjs.init("B31rxbPMCio3oeS6_"); // Your public key

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

        // Verify EmailJS initialization
        console.log('EmailJS initialized'); // Debug log
    });

    async function handleSubmit() {
        isSubmitting = true;
        submitStatus = null;
        
        try {
            console.log('Attempting to send email...'); // Debug log
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
            
            console.log('Email sent successfully:', response);
            
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
            console.error('Detailed email error:', error);
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
            
            <button type="submit" class="submit-btn" disabled={isSubmitting}>
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
            <i class="fab fa-twitter"></i>
            <span class="tooltip">Twitter</span>
        </a>
        <a href="mailto:mombejose@gmail.com" class="social-btn email">
            <i class="fas fa-envelope"></i>
            <span class="tooltip">Email</span>
        </a>
    </div>
</section>

