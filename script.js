const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const audio = document.getElementById('background-music');
audio.volume = 1.0;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const audioControl = document.getElementById('audio-control');
const responseButtons = document.getElementById('response-buttons');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

camera.position.set(0, 0, 6);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.6;
controls.enableZoom = true;
controls.zoomSpeed = 0.5;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 8;

const points = [];
const scale = 1.8;
const density = 800;
const phrase = "I LOVE YOU";

function heartPosition(u, v) {
    u = u * 2 * Math.PI;
    v = (v - 0.5) * Math.PI;
    const x = 16 * Math.pow(Math.sin(u), 3);
    const y = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
    const z = 10 * Math.sin(v);
    return new THREE.Vector3(x, y, z).multiplyScalar(0.06 * scale);
}

const heartGroup = new THREE.Group();
scene.add(heartGroup);

const sprites = [];
const initialPositions = [];
const targetPositions = [];

for (let i = 0; i < density; i++) {
    const u = Math.random();
    const v = Math.random();
    const targetPos = heartPosition(u, v);
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const radius = 10 + Math.random() * 10;
    const initialPos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
    );
    points.push({ initial: initialPos, target: targetPos, text: phrase });
    initialPositions.push(initialPos);
    targetPositions.push(targetPos);
}

const textureLoader = new THREE.TextureLoader();
points.forEach((point, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 40px Georgia';
    ctx.fillStyle = 'rgba(255, 102, 178, 0.9)';
    ctx.shadowColor = '#ff3399';
    ctx.shadowBlur = 12;
    ctx.fillText(point.text, 10, 50);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(point.initial);
    sprite.scale.set(0.25, 0.06, 1);
    sprite.userData = { 
        initial: point.initial, 
        target: point.target, 
        progress: 0, 
        isAnimating: false,
        swirlAngle: Math.random() * 2 * Math.PI
    };
    heartGroup.add(sprite);
    sprites.push(sprite);
});

let centerSprite = null;
function createCenterMessage() {
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 32px "Dancing Script"';
    ctx.fillStyle = 'rgba(255, 102, 178, 0.9)';
    ctx.shadowColor = '#ff3399';
    ctx.shadowBlur = 15;
    ctx.textAlign = 'center';
    
    ctx.fillText('Do I still have a chance?💕', 325, 80);
    ctx.fillText('I know its a misunderstanding', 325, 130);
    ctx.fillText('but my heart is still yours.', 325, 180);
    ctx.fillText('Suwayig "No" gaan tikag singko hahaha', 325, 230);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    centerSprite = new THREE.Sprite(material);
    centerSprite.position.set(0, 0, 0);
    centerSprite.scale.set(1.8, 0.8, 1);
    heartGroup.add(centerSprite);
}
createCenterMessage();

let celebrationSprite = null;
function createCelebrationMessage() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 40px "Dancing Script"';
    ctx.fillStyle = 'rgba(255, 153, 204, 0.9)';
    ctx.shadowColor = '#ff66b2';
    ctx.shadowBlur = 20;
    ctx.textAlign = 'center';

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    celebrationSprite = new THREE.Sprite(material);
    celebrationSprite.position.set(0, 2, 0);
    celebrationSprite.scale.set(1.8, 0.9, 1);
    heartGroup.add(celebrationSprite);
}
createCelebrationMessage();

const ambientLight = new THREE.AmbientLight(0x332233, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff66b2, 1.5, 10);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
const pointLight2 = new THREE.PointLight(0xcc33ff, 1, 10);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

const fireworks = [];
const loveParticles = [];
const glowingHearts = [];
const sparklingTrail = [];

function createFirework() {
    const particleCount = 50;
    const particles = new THREE.Group();
    for (let i = 0; i < particleCount; i++) {
        const material = new THREE.SpriteMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 60 + 300}, 80%, 70%)`),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(0, 0, 0);
        sprite.scale.set(0.1, 0.1, 1);
        sprite.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3
            ),
            life: 2
        };
        particles.add(sprite);
    }
    particles.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0);
    scene.add(particles);
    fireworks.push(particles);
}

function createLoveParticle() {
    const material = new THREE.SpriteMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 30 + 330}, 90%, 80%)`),
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
    sprite.scale.set(0.05, 0.05, 1);
    sprite.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 0.5 + 0.5,
            (Math.random() - 0.5) * 0.5
        ),
        life: 2
    };
    scene.add(sprite);
    loveParticles.push(sprite);
}

function createGlowingHeart() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 40px Georgia';
    ctx.fillStyle = 'rgba(255, 102, 178, 0.9)';
    ctx.shadowColor = '#ff3399';
    ctx.shadowBlur = 10;
    ctx.textAlign = 'center';
    ctx.fillText('💖', 32, 48);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
    sprite.scale.set(0.2, 0.2, 1);
    sprite.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.3 + 0.2,
            (Math.random() - 0.5) * 0.3
        ),
        life: 3,
        pulse: Math.random() * Math.PI * 2
    };
    scene.add(sprite);
    glowingHearts.push(sprite);
}

function createSparklingTrail() {
    const material = new THREE.SpriteMaterial({
        color: new THREE.Color(`hsl(${Math.random() * 30 + 330}, 90%, 90%)`),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set((Math.random() - 0.5) * 3, -2, (Math.random() - 0.5) * 3);
    sprite.scale.set(0.03, 0.03, 1);
    sprite.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            Math.random() * 0.4 + 0.3,
            (Math.random() - 0.5) * 0.2
        ),
        life: 1.5
    };
    scene.add(sprite);
    sparklingTrail.push(sprite);
}

let time = 0;
let animationTriggered = false;
let zoomProgress = 0;
let buttonsShown = false;
let celebrationActive = false;

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    if (animationTriggered && !sprites.some(sprite => sprite.userData.isAnimating)) {
        heartGroup.rotation.y += 0.005;
        if (centerSprite) {
            centerSprite.material.opacity = Math.min(centerSprite.material.opacity + 0.01, 0.9);
        }
        if (zoomProgress < 1) {
            zoomProgress += 0.005;
            camera.position.z = 6 - 1.5 * zoomProgress;
            camera.updateProjectionMatrix();
        }
        if (!buttonsShown && centerSprite.material.opacity >= 0.9) {
            responseButtons.style.display = 'flex';
            buttonsShown = true;
        }
    }

    if (celebrationActive && celebrationSprite) {
        celebrationSprite.material.opacity = Math.min(celebrationSprite.material.opacity + 0.01, 0.9);
        if (time % 0.8 < 0.01) {
            createFirework();
        }
        if (time % 0.1 < 0.01) {
            createLoveParticle();
        }
        if (time % 0.15 < 0.01) {
            createGlowingHeart();
        }
        if (time % 0.05 < 0.01) {
            createSparklingTrail();
        }
    }

    sprites.forEach(sprite => {
        if (sprite.userData.isAnimating) {
            sprite.userData.progress += 0.015;
            if (sprite.userData.progress < 1) {
                const t = sprite.userData.progress;
                const swirl = 1 - t;
                const swirlPos = sprite.userData.initial.clone();
                sprite.userData.swirlAngle += 0.1;
                swirlPos.x += Math.cos(sprite.userData.swirlAngle) * swirl * 2;
                swirlPos.y += Math.sin(sprite.userData.swirlAngle) * swirl * 2;
                sprite.position.lerpVectors(
                    swirlPos,
                    sprite.userData.target,
                    t * t
                );
            } else {
                sprite.position.copy(sprite.userData.target);
                sprite.userData.isAnimating = false;
            }
        }
        const pulse = 0.8 + 0.1 * Math.sin(time * 2 + sprite.position.x);
        sprite.material.opacity = 0.7 * pulse;
        sprite.scale.set(0.25 * pulse, 0.06 * pulse, 1);
    });

    fireworks.forEach(particles => {
        particles.children.forEach(sprite => {
            sprite.userData.life -= 0.01;
            if (sprite.userData.life > 0) {
                sprite.position.add(sprite.userData.velocity.clone().multiplyScalar(0.03));
                sprite.material.opacity = sprite.userData.life * 0.8;
                sprite.userData.velocity.multiplyScalar(0.97);
            } else {
                sprite.material.opacity = 0;
            }
        });
        if (particles.children.every(sprite => sprite.userData.life <= 0)) {
            scene.remove(particles);
            fireworks.splice(fireworks.indexOf(particles), 1);
        }
    });

    loveParticles.forEach(sprite => {
        sprite.userData.life -= 0.01;
        if (sprite.userData.life > 0) {
            sprite.position.add(sprite.userData.velocity.clone().multiplyScalar(0.05));
            sprite.material.opacity = sprite.userData.life * 0.6;
            sprite.userData.velocity.y -= 0.01;
        } else {
            scene.remove(sprite);
            loveParticles.splice(loveParticles.indexOf(sprite), 1);
        }
    });

    glowingHearts.forEach(sprite => {
        sprite.userData.life -= 0.008;
        if (sprite.userData.life > 0) {
            sprite.position.add(sprite.userData.velocity.clone().multiplyScalar(0.03));
            sprite.userData.pulse += 0.05;
            sprite.material.opacity = sprite.userData.life * (0.5 + 0.3 * Math.sin(sprite.userData.pulse));
            sprite.scale.set(
                0.2 * (1 + 0.2 * Math.sin(sprite.userData.pulse)),
                0.2 * (1 + 0.2 * Math.sin(sprite.userData.pulse)),
                1
            );
        } else {
            scene.remove(sprite);
            glowingHearts.splice(glowingHearts.indexOf(sprite), 1);
        }
    });

    sparklingTrail.forEach(sprite => {
        sprite.userData.life -= 0.015;
        if (sprite.userData.life > 0) {
            sprite.position.add(sprite.userData.velocity.clone().multiplyScalar(0.04));
            sprite.material.opacity = sprite.userData.life * 0.5;
        } else {
            scene.remove(sprite);
            sparklingTrail.splice(sparklingTrail.indexOf(sprite), 1);
        }
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function playAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            audio.play().catch(error => {
                console.error("Audio playback failed:", error);
            });
        });
    } else {
        audio.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    }
}

function triggerAnimation() {
    if (!animationTriggered) {
        animationTriggered = true;
        startScreen.style.display = 'none';
        audioControl.style.display = 'block';
        sprites.forEach(sprite => {
            sprite.userData.isAnimating = true;
            sprite.userData.progress = 0;
            sprite.userData.swirlAngle = Math.random() * 2 * Math.PI;
        });
        playAudio();
    }
}

startBtn.addEventListener('click', triggerAnimation);

audioControl.addEventListener('click', () => {
    if (audio.paused) {
        playAudio();
        audioControl.textContent = 'Pause Music';
    } else {
        audio.pause();
        audioControl.textContent = 'Play Music';
    }
});

yesBtn.addEventListener('click', () => {
    responseButtons.style.display = 'none';
    celebrationActive = true;
    for (let i = 0; i < 8; i++) {
        setTimeout(createFirework, i * 400);
    }
    for (let i = 0; i < 15; i++) {
        setTimeout(createLoveParticle, i * 100);
    }
    for (let i = 0; i < 10; i++) {
        setTimeout(createGlowingHeart, i * 200);
    }
    for (let i = 0; i < 20; i++) {
        setTimeout(createSparklingTrail, i * 50);
    }
});

noBtn.addEventListener('mouseenter', () => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = 50;
    noBtn.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
});

noBtn.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const angle = Math.random() * 2 * Math.PI;
    const distance = 50;
    noBtn.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
});

let isTouching = false;
let prevTouchX = 0;
let prevTouchY = 0;

renderer.domElement.addEventListener('touchstart', (event) => {
    event.preventDefault();
    isTouching = true;
    const touch = event.touches[0];
    prevTouchX = touch.clientX;
    prevTouchY = touch.clientY;
});

renderer.domElement.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (isTouching) {
        const touch = event.touches[0];
        const deltaX = touch.clientX - prevTouchX;
        const deltaY = touch.clientY - prevTouchY;
        controls.rotateLeft(deltaX * 0.003);
        controls.rotateUp(deltaY * 0.003);
        prevTouchX = touch.clientX;
        prevTouchY = touch.clientY;
    }
});

renderer.domElement.addEventListener('touchend', () => {
    isTouching = false;
});
