
/* ========================================
   LIFE OS — Ultra-Premium JS Interactions
   ======================================== */

// Register GSAP plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// === LENIS SMOOTH SCROLL ===
let lenis;
function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
}

// === CUSTOM CURSOR ===
function initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if (!dot || !outline) return;
    
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let outlinePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.left = mouse.x + 'px';
        dot.style.top = mouse.y + 'px';
    });
    
    function animateOutline() {
        let dx = mouse.x - outlinePos.x;
        let dy = mouse.y - outlinePos.y;
        outlinePos.x += dx * 0.15;
        outlinePos.y += dy * 0.15;
        outline.style.left = outlinePos.x + 'px';
        outline.style.top = outlinePos.y + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .dock-item, .task-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hover'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
    });
}

// === LOADER ===
function initLoader() {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (!loaderWrapper) return;
    
    const loaderBar = document.querySelector('.loader-bar');
    
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        tl.to(loaderBar, { width: '100%', duration: 1.5, ease: 'power2.inOut' })
          .to('.loader-text', { opacity: 0, duration: 0.5, ease: 'power1.out' }, '+=0.2')
          .to(loaderWrapper, { y: '-100%', duration: 0.8, ease: 'power3.inOut' })
          .from('.hero-content', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' }, '-=0.3');
    } else {
        setTimeout(() => {
            loaderWrapper.style.display = 'none';
        }, 1500);
    }
}

// === THREE.JS PARTICLES (Replace Tubes) ===
function initParticlesBackground() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 5;
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        particlesMesh.rotation.y = elapsedTime * 0.05 + mouseX * 0.5;
        particlesMesh.rotation.x = mouseY * 0.5;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// === GSAP SCROLL ANIMATIONS ===
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Cards stagger reveal
    const sections = ['.philosophy-grid', '.features-grid', '.pricing-grid', '.stats-row'];
    
    sections.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            gsap.fromTo(container.children, 
                { y: 50, opacity: 0 },
                { 
                    y: 0, opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                    }
                }
            );
        }
    });

    // Chart animation
    const chartCard = document.querySelector('.chart-card');
    if (chartCard) {
        gsap.fromTo('.chart-bar',
            { height: 0, opacity: 0 },
            {
                height: () => 50 + Math.random() * 200,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "bounce.out",
                scrollTrigger: {
                    trigger: chartCard,
                    start: "top 80%"
                }
            }
        );
    }
}

// === DOCK PHYSICS ===
function initDockMagnification() {
    const dock = document.querySelector('.dock');
    if (!dock) return;
    
    const items = dock.querySelectorAll('.dock-item');
    
    dock.addEventListener('mousemove', (e) => {
        const rect = dock.getBoundingClientRect();
        const mouseX = e.clientX;
        
        items.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = itemRect.left + itemRect.width / 2;
            const itemDistance = Math.abs(mouseX - itemCenterX);
            
            if (itemDistance < 100) {
                const scale = 1 + ((100 - itemDistance) / 100) * 0.5; // Max scale 1.5
                const translateY = -((100 - itemDistance) / 100) * 15;
                item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            } else {
                item.style.transform = 'scale(1) translateY(0)';
            }
        });
    });
    
    dock.addEventListener('mouseleave', () => {
        items.forEach(item => {
            item.style.transform = 'scale(1) translateY(0)';
            item.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
    
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'none';
        });
    });
}

// === KEEP EXISTING LOGIC ===
function initTaskList() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
        });
    });
}

function initDockActiveState() {
    const dockItems = document.querySelectorAll('.dock-item');
    const navItems = document.querySelectorAll('.sidebar-item');
    
    function setActive(item) {
        dockItems.forEach(d => d.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        
        // Flash glow effect
        if(typeof gsap !== 'undefined') {
            gsap.fromTo(item, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
        }
    }
    
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            setActive(item);
            // Handle navigation for real links
            if(item.tagName === 'A' && item.getAttribute('href')) {
                window.location.href = item.getAttribute('href');
            } else {
                const label = item.dataset.label;
                const sidebarItem = document.querySelector(`.sidebar-item[data-page="${label ? label.toLowerCase() : ''}"]`);
                if (sidebarItem) sidebarItem.classList.add('active');
            }
        });
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            setActive(item);
            const pageName = item.dataset.page;
            const dockItem = document.querySelector(`.dock-item[data-label="${pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : ''}"]`);
            if (dockItem) dockItem.classList.add('active');
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initCustomCursor();
    initLoader();
    initParticlesBackground();
    setTimeout(initGSAPAnimations, 500); // slight delay for DOM parsing
    initDockMagnification();
    initTaskList();
    initDockActiveState();
});
