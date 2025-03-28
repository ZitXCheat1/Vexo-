document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.classList.add(savedTheme + '-theme');
    updateThemeIcon(savedTheme);
    
    // Initialize particles with correct theme
    initParticles(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
            updateParticlesTheme('light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
            updateParticlesTheme('dark');
        }
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Color theme customization
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            document.documentElement.style.setProperty('--primary-color', color);
            
            // Calculate a slightly darker version for hover states
            const hoverColor = shadeColor(color, -20);
            document.documentElement.style.setProperty('--primary-hover', hoverColor);
            
            // Update particles color if in light mode
            if (!body.classList.contains('dark-theme')) {
                updateParticlesColor(color);
            }
            
            // Save the selected color
            localStorage.setItem('primaryColor', color);
            localStorage.setItem('primaryHover', hoverColor);
        });
    });
    
    // Apply saved color theme if exists
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedPrimaryHover = localStorage.getItem('primaryHover');
    if (savedPrimaryColor) {
        document.documentElement.style.setProperty('--primary-color', savedPrimaryColor);
        document.documentElement.style.setProperty('--primary-hover', savedPrimaryHover || shadeColor(savedPrimaryColor, -20));
        
        // Update particles if in light mode
        if (!body.classList.contains('dark-theme')) {
            updateParticlesColor(savedPrimaryColor);
        }
    }
    
    // Helper function to shade colors
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1,3), 16);
        let G = parseInt(color.substring(3,5), 16);
        let B = parseInt(color.substring(5,7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
    
    // Particles.js functions
    function initParticles(theme) {
        particlesJS('particles-js', getParticlesConfig(theme));
    }
    
    function updateParticlesTheme(theme) {
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particles = window.pJSDom[0].pJS.particles;
            const config = getParticlesConfig(theme);
            
            particles.color.value = config.particles.color.value;
            particles.line_linked.color = config.particles.line_linked.color;
            
            // Refresh particles
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
    
    function updateParticlesColor(color) {
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particles = window.pJSDom[0].pJS.particles;
            
            particles.color.value = color;
            particles.line_linked.color = color;
            
            // Refresh particles
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
    
    function getParticlesConfig(theme) {
        const isDark = theme === 'dark';
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#1e90ff';
        
        return {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": isDark ? "#ffffff" : primaryColor
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": isDark ? 0.2 : 0.3,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": isDark ? "#ffffff" : primaryColor,
                    "opacity": isDark ? 0.2 : 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        };
    }
});
