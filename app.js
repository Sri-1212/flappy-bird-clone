/**
 * Flappy Bird - Ultimate Arcade Edition
 * Built with Phaser 3 + Web Audio API
 * Fully animated, responsive fullscreen, sound effects, particle juice, and sleek UI.
 */

// ==========================================
// Web Audio API Sound Synthesizer
// ==========================================
class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('flappy_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('flappy_muted', this.muted);
        return this.muted;
    }

    playFlap() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.09);
        } catch (e) {}
    }

    playScore() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // First note (B5)
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(987.77, now);
            gain1.gain.setValueAtTime(0.25, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.12);

            // Second note (E6)
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(1318.51, now + 0.08);
            gain2.gain.setValueAtTime(0.28, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.25);
        } catch (e) {}
    }

    playHit() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    playDie() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.35);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {}
    }

    playClick() {
        if (this.muted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    }
}

const soundManager = new SoundController();

// ==========================================
// Main Flappy Bird Game Scene
// ==========================================
class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameScene' });
    }

    preload() {
        // Generate crisp procedural high-res textures
        this.generateTextures();
    }

    generateTextures() {
        const frameW = 44;
        const frameH = 34;

        const wingPositions = [
            { y: 8, angle: -0.45 }, // Frame 0: Wing Up
            { y: 14, angle: 0 },     // Frame 1: Wing Mid
            { y: 20, angle: 0.45 }   // Frame 2: Wing Down
        ];

        // 1. Generate 3 Separate Bird Frame Textures (bird_0, bird_1, bird_2)
        for (let i = 0; i < 3; i++) {
            const birdTex = this.textures.createCanvas(`bird_${i}`, frameW, frameH);
            const ctx = birdTex.getContext();

            // Bird Body (Fluffy Golden-Orange Oval)
            ctx.beginPath();
            ctx.ellipse(20, 18, 16, 13, 0, 0, Math.PI * 2);
            const gradBody = ctx.createLinearGradient(8, 6, 28, 30);
            gradBody.addColorStop(0, '#ffd13b');
            gradBody.addColorStop(1, '#ff7d1a');
            ctx.fillStyle = gradBody;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#542600';
            ctx.stroke();

            // Belly Highlight
            ctx.beginPath();
            ctx.ellipse(16, 22, 9, 6, -0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffeaa7';
            ctx.fill();

            // Eye (Large Retro Arcade Eye)
            ctx.beginPath();
            ctx.ellipse(28, 12, 7, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#542600';
            ctx.stroke();

            // Pupil & Light Glint
            ctx.beginPath();
            ctx.arc(31, 12, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#1e1e24';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(32.5, 10.5, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Cheek Blush
            ctx.beginPath();
            ctx.arc(22, 22, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 90, 95, 0.45)';
            ctx.fill();

            // Beak
            ctx.beginPath();
            ctx.moveTo(33, 14);
            ctx.lineTo(43, 18);
            ctx.lineTo(33, 23);
            ctx.closePath();
            ctx.fillStyle = '#ff4d00';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#542600';
            ctx.stroke();

            // Wing
            ctx.save();
            ctx.translate(12, wingPositions[i].y);
            ctx.rotate(wingPositions[i].angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, 9, 6, -0.2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#542600';
            ctx.stroke();
            ctx.restore();

            birdTex.refresh();
        }

        // 2. Generate Pipe Texture
        const pipeW = 76;
        const pipeH = 640;
        const pipeTex = this.textures.createCanvas('pipe', pipeW, pipeH);
        const pctx = pipeTex.getContext();

        // Pipe Body Gradient (Metallic / 3D Retro Green)
        const pGrad = pctx.createLinearGradient(0, 0, pipeW, 0);
        pGrad.addColorStop(0, '#55bb3b');
        pGrad.addColorStop(0.18, '#8de85e');
        pGrad.addColorStop(0.45, '#55bb3b');
        pGrad.addColorStop(0.85, '#2e8220');
        pGrad.addColorStop(1, '#1b5612');

        pctx.fillStyle = pGrad;
        pctx.fillRect(0, 0, pipeW, pipeH);

        // Pipe Rim (Cap)
        const rimH = 34;
        const rimGrad = pctx.createLinearGradient(0, 0, pipeW, 0);
        rimGrad.addColorStop(0, '#5ec743');
        rimGrad.addColorStop(0.2, '#a5f578');
        rimGrad.addColorStop(0.5, '#5ec743');
        rimGrad.addColorStop(0.85, '#2c7a1e');
        rimGrad.addColorStop(1, '#184f10');

        pctx.fillStyle = rimGrad;
        pctx.fillRect(0, 0, pipeW, rimH);
        pctx.lineWidth = 3;
        pctx.strokeStyle = '#0e340a';
        pctx.strokeRect(1.5, 1.5, pipeW - 3, rimH - 3);

        // Dark side borders
        pctx.fillStyle = 'rgba(0,0,0,0.2)';
        pctx.fillRect(0, rimH, 3, pipeH - rimH);
        pctx.fillRect(pipeW - 3, rimH, 3, pipeH - rimH);

        pipeTex.refresh();

        // 3. Generate Ground Pattern Texture
        const groundW = 120;
        const groundH = 120;
        const groundTex = this.textures.createCanvas('ground_texture', groundW, groundH);
        const gctx = groundTex.getContext();

        // Earth Base
        gctx.fillStyle = '#ded895';
        gctx.fillRect(0, 0, groundW, groundH);

        // Diagonal Striping
        gctx.fillStyle = '#c7be77';
        for (let x = -groundW; x < groundW * 2; x += 24) {
            gctx.beginPath();
            gctx.moveTo(x, 18);
            gctx.lineTo(x + 14, 18);
            gctx.lineTo(x + 14 - 30, groundH);
            gctx.lineTo(x - 30, groundH);
            gctx.closePath();
            gctx.fill();
        }

        // Top Grass Band
        gctx.fillStyle = '#73bf2e';
        gctx.fillRect(0, 0, groundW, 16);
        gctx.fillStyle = '#8ce03a';
        gctx.fillRect(0, 0, groundW, 5);

        // Grass Blade Highlights
        gctx.fillStyle = '#5ca320';
        gctx.fillRect(0, 14, groundW, 4);

        groundTex.refresh();

        // 4. Generate Cloud Texture
        const cloudTex = this.textures.createCanvas('cloud', 160, 70);
        const cctx = cloudTex.getContext();
        cctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        cctx.beginPath();
        cctx.arc(45, 45, 25, 0, Math.PI * 2);
        cctx.arc(80, 35, 32, 0, Math.PI * 2);
        cctx.arc(115, 45, 24, 0, Math.PI * 2);
        cctx.arc(140, 52, 16, 0, Math.PI * 2);
        cctx.arc(20, 52, 16, 0, Math.PI * 2);
        cctx.fill();
        cloudTex.refresh();

        // 5. Generate City Skyline Texture
        const cityTex = this.textures.createCanvas('city', 400, 140);
        const ctctx = cityTex.getContext();
        ctctx.fillStyle = '#8bd8bd';
        const buildings = [
            { x: 0, w: 35, h: 80 },
            { x: 40, w: 25, h: 110 },
            { x: 70, w: 45, h: 65 },
            { x: 120, w: 30, h: 125 },
            { x: 155, w: 40, h: 90 },
            { x: 200, w: 35, h: 105 },
            { x: 240, w: 50, h: 75 },
            { x: 295, w: 30, h: 120 },
            { x: 330, w: 35, h: 85 },
            { x: 370, w: 30, h: 100 }
        ];
        buildings.forEach(b => {
            ctctx.fillRect(b.x, 140 - b.h, b.w, b.h);
            ctctx.fillStyle = '#b5edd8';
            for (let wy = 140 - b.h + 10; wy < 130; wy += 14) {
                for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 9) {
                    ctctx.fillRect(wx, wy, 4, 6);
                }
            }
            ctctx.fillStyle = '#8bd8bd';
        });
        cityTex.refresh();

        // 6. Generate Particle Textures
        const dotTex = this.textures.createCanvas('particle_dot', 16, 16);
        const pctx2 = dotTex.getContext();
        pctx2.fillStyle = '#ffffff';
        pctx2.beginPath();
        pctx2.arc(8, 8, 7, 0, Math.PI * 2);
        pctx2.fill();
        dotTex.refresh();

        const featherTex = this.textures.createCanvas('feather', 16, 8);
        const fctx = featherTex.getContext();
        fctx.fillStyle = '#ffd13b';
        fctx.beginPath();
        fctx.ellipse(8, 4, 7, 3, -0.3, 0, Math.PI * 2);
        fctx.fill();
        featherTex.refresh();
    }

    create() {
        // Game States
        this.STATE = {
            MENU: 0,
            PLAYING: 1,
            GAMEOVER: 2
        };
        this.currentState = this.STATE.MENU;

        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('flappy_highscore') || '0', 10);
        this.pipeSpeed = 220;
        this.pipeGap = 190;
        this.pipeSpawnTimer = null;
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.groundHeight = 110;

        // Visual Setup
        this.createBackground();
        this.createGround();
        this.createPipesGroup();
        this.createBird();
        this.createHUD();
        this.createStartMenu();
        this.createGameOverMenu();

        // Input Bindings
        this.setupInputs();

        // Responsive Resizing Handler
        this.scale.on('resize', this.handleResize, this);

        // Define Wing Flap Animation
        if (!this.anims.exists('fly')) {
            this.anims.create({
                key: 'fly',
                frames: [
                    { key: 'bird_0' },
                    { key: 'bird_1' },
                    { key: 'bird_2' },
                    { key: 'bird_1' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
        this.bird.play('fly');

        // Start state menu display
        this.showStartMenu();
    }

    createBackground() {
        // Sky Gradient
        this.skyBg = this.add.graphics().setDepth(0);
        this.drawSkyGradient();

        // Parallax Clouds
        this.clouds = this.add.tileSprite(0, this.gameHeight - this.groundHeight - 140, this.gameWidth, 70, 'cloud')
            .setOrigin(0, 1)
            .setDepth(1)
            .setAlpha(0.85);

        // Parallax City Skyline
        this.cityline = this.add.tileSprite(0, this.gameHeight - this.groundHeight, this.gameWidth, 140, 'city')
            .setOrigin(0, 1)
            .setDepth(2)
            .setAlpha(0.65);
    }

    drawSkyGradient() {
        this.skyBg.clear();
        this.skyBg.fillGradientStyle(0x38bdf8, 0x38bdf8, 0xbae6fd, 0xe0f2fe, 1);
        this.skyBg.fillRect(0, 0, this.scale.width, this.scale.height);
    }

    createGround() {
        this.ground = this.add.tileSprite(0, this.gameHeight - this.groundHeight, this.gameWidth, this.groundHeight, 'ground_texture')
            .setOrigin(0, 0)
            .setDepth(10);

        // Physics static platform for ground collision
        this.groundBody = this.physics.add.staticGroup();
        this.groundPlatform = this.groundBody.create(this.gameWidth / 2, this.gameHeight - this.groundHeight / 2)
            .setSize(this.gameWidth * 2, this.groundHeight)
            .setVisible(false);
    }

    createPipesGroup() {
        this.pipes = this.physics.add.group();
    }

    createBird() {
        const startX = Math.min(this.gameWidth * 0.28, 260);
        const startY = this.gameHeight * 0.45;

        this.bird = this.physics.add.sprite(startX, startY, 'bird_0')
            .setDepth(20)
            .setScale(1.3)
            .setCollideWorldBounds(false);

        // Precise circular hitbox
        this.bird.body.setCircle(14, 8, 4);
        this.bird.body.allowGravity = false;

        // Collision detection
        this.physics.add.overlap(this.bird, this.pipes, this.handleCollision, null, this);
        this.physics.add.collider(this.bird, this.groundPlatform, this.handleCollision, null, this);
    }

    emitFlapPuff(x, y) {
        for (let i = 0; i < 3; i++) {
            const p = this.add.image(x, y, 'particle_dot')
                .setScale(Phaser.Math.FloatBetween(0.3, 0.6))
                .setAlpha(0.6)
                .setDepth(18);
            this.tweens.add({
                targets: p,
                x: x - Phaser.Math.Between(20, 45),
                y: y + Phaser.Math.Between(-12, 12),
                alpha: 0,
                scale: 0,
                duration: Phaser.Math.Between(250, 400),
                ease: 'Sine.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }

    emitFeatherExplosion(x, y) {
        for (let i = 0; i < 18; i++) {
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const speed = Phaser.Math.FloatBetween(70, 240);
            const f = this.add.image(x, y, 'feather')
                .setDepth(25)
                .setScale(Phaser.Math.FloatBetween(0.8, 1.4))
                .setRotation(Phaser.Math.FloatBetween(0, 6.28));
            this.tweens.add({
                targets: f,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed + 90,
                rotation: f.rotation + Phaser.Math.FloatBetween(-3, 3),
                alpha: 0,
                duration: Phaser.Math.Between(600, 900),
                ease: 'Cubic.easeOut',
                onComplete: () => f.destroy()
            });
        }
    }

    createHUD() {
        this.hudContainer = this.add.container(0, 0).setDepth(40);

        // Big Top Score Display
        this.scoreText = this.add.text(this.gameWidth / 2, 60, '0', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '52px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0,0,0,0.5)', blur: 4, stroke: true, fill: true }
        }).setOrigin(0.5).setVisible(false);

        // Audio Toggle Button (Top Right)
        this.soundBtn = this.add.container(this.gameWidth - 55, 45);
        const btnBg = this.add.circle(0, 0, 24, 0x1e293b, 0.8)
            .setStrokeStyle(2, 0xffffff, 0.4);
        
        this.soundIcon = this.add.text(0, 0, soundManager.muted ? '🔇' : '🔊', {
            fontSize: '22px'
        }).setOrigin(0.5);

        this.soundBtn.add([btnBg, this.soundIcon]);
        this.soundBtn.setSize(48, 48);
        this.soundBtn.setInteractive({ useHandCursor: true });
        this.soundBtn.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            soundManager.init();
            const isMuted = soundManager.toggleMute();
            this.soundIcon.setText(isMuted ? '🔇' : '🔊');
            soundManager.playClick();
        });

        this.hudContainer.add([this.scoreText, this.soundBtn]);
    }

    createStartMenu() {
        this.startMenuContainer = this.add.container(this.gameWidth / 2, this.gameHeight / 2).setDepth(50);

        // Title Glow & Text
        const titleGlow = this.add.text(0, -170, 'FLAPPY BIRD', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '44px',
            color: '#f59e0b',
            stroke: '#000000',
            strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5);

        const titleText = this.add.text(0, -170, 'FLAPPY BIRD', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '44px',
            color: '#fef08a',
            stroke: '#78350f',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Title Float Animation
        this.tweens.add({
            targets: [titleGlow, titleText],
            y: '-=12',
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Best High Score Pill
        const bestPill = this.add.graphics();
        bestPill.fillStyle(0x0f172a, 0.7);
        bestPill.fillRoundedRect(-140, -105, 280, 42, 21);
        bestPill.lineStyle(2, 0xf59e0b, 0.6);
        bestPill.strokeRoundedRect(-140, -105, 280, 42, 21);

        this.startBestText = this.add.text(0, -84, `🏆 BEST SCORE: ${this.highScore}`, {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '18px',
            fontWeight: '800',
            color: '#fde047'
        }).setOrigin(0.5);

        // START BUTTON (Pulsing Glow & Interactive)
        this.startBtn = this.add.container(0, 10);
        
        const btnGlow = this.add.graphics();
        btnGlow.fillStyle(0x22c55e, 0.4);
        btnGlow.fillRoundedRect(-135, -35, 270, 70, 35);

        const btnBody = this.add.graphics();
        btnBody.fillStyle(0x22c55e, 1);
        btnBody.fillRoundedRect(-125, -28, 250, 56, 28);
        btnBody.lineStyle(3, 0xffffff, 0.9);
        btnBody.strokeRoundedRect(-125, -28, 250, 56, 28);

        const btnLabel = this.add.text(0, 0, '▶  START GAME', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '24px',
            fontWeight: '900',
            color: '#ffffff',
            shadow: { offsetX: 0, offsetY: 2, color: 'rgba(0,0,0,0.4)', blur: 2, fill: true }
        }).setOrigin(0.5);

        this.startBtn.add([btnGlow, btnBody, btnLabel]);
        this.startBtn.setSize(260, 60);
        this.startBtn.setInteractive({ useHandCursor: true });

        // Start Button Pulse Tween
        this.tweens.add({
            targets: this.startBtn,
            scaleX: 1.06,
            scaleY: 1.06,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.startBtn.on('pointerover', () => this.startBtn.setScale(1.1));
        this.startBtn.on('pointerout', () => this.startBtn.setScale(1.0));
        this.startBtn.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            this.startGame();
        });

        // Instructions Hint
        const hintBg = this.add.graphics();
        hintBg.fillStyle(0x1e293b, 0.85);
        hintBg.fillRoundedRect(-175, 95, 350, 54, 16);
        hintBg.lineStyle(1.5, 0x64748b, 0.5);
        hintBg.strokeRoundedRect(-175, 95, 350, 54, 16);

        const hintIcon = this.add.text(0, 112, '⌨️ SPACE / ↑ ARROW  or  🖱️ CLICK TO FLY', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '15px',
            fontWeight: '700',
            color: '#cbd5e1'
        }).setOrigin(0.5);

        const hintSub = this.add.text(0, 134, 'Dodge the pipes & beat your high score!', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            color: '#94a3b8'
        }).setOrigin(0.5);

        this.startMenuContainer.add([
            titleGlow, titleText,
            bestPill, this.startBestText,
            this.startBtn,
            hintBg, hintIcon, hintSub
        ]);
    }

    createGameOverMenu() {
        this.gameOverContainer = this.add.container(this.gameWidth / 2, this.gameHeight / 2).setDepth(60);
        this.gameOverContainer.setVisible(false);

        // Modal Backdrop Card
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x0f172a, 0.95);
        cardBg.fillRoundedRect(-190, -170, 380, 340, 24);
        cardBg.lineStyle(3, 0xf59e0b, 0.9);
        cardBg.strokeRoundedRect(-190, -170, 380, 340, 24);

        // Header
        const goTitle = this.add.text(0, -125, 'GAME OVER', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '28px',
            color: '#ef4444',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Medal Display
        const medalBox = this.add.graphics();
        medalBox.fillStyle(0x1e293b, 0.8);
        medalBox.fillRoundedRect(-155, -80, 90, 90, 16);
        medalBox.lineStyle(2, 0x475569, 0.6);
        medalBox.strokeRoundedRect(-155, -80, 90, 90, 16);

        this.medalIcon = this.add.text(-110, -35, '🥉', {
            fontSize: '44px'
        }).setOrigin(0.5);

        this.medalLabel = this.add.text(-110, 20, 'MEDAL', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '13px',
            fontWeight: '800',
            color: '#94a3b8'
        }).setOrigin(0.5);

        // Score Panel
        const scoreBox = this.add.graphics();
        scoreBox.fillStyle(0x1e293b, 0.8);
        scoreBox.fillRoundedRect(-45, -80, 200, 90, 16);
        scoreBox.lineStyle(2, 0x475569, 0.6);
        scoreBox.strokeRoundedRect(-45, -80, 200, 90, 16);

        const currentScoreLabel = this.add.text(55, -60, 'SCORE', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '14px',
            fontWeight: '800',
            color: '#94a3b8'
        }).setOrigin(0.5);

        this.finalScoreText = this.add.text(55, -35, '0', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.finalBestText = this.add.text(55, -5, `BEST: ${this.highScore}`, {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '15px',
            fontWeight: '800',
            color: '#fde047'
        }).setOrigin(0.5);

        // NEW RECORD Flashing Banner
        this.newRecordBanner = this.add.text(0, 42, '⭐ NEW HIGH SCORE! ⭐', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '16px',
            fontWeight: '900',
            color: '#22c55e'
        }).setOrigin(0.5).setVisible(false);

        this.tweens.add({
            targets: this.newRecordBanner,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // PLAY AGAIN Button
        this.restartBtn = this.add.container(0, 105);

        const rBtnGlow = this.add.graphics();
        rBtnGlow.fillStyle(0x3b82f6, 0.4);
        rBtnGlow.fillRoundedRect(-125, -28, 250, 56, 28);

        const rBtnBody = this.add.graphics();
        rBtnBody.fillStyle(0x2563eb, 1);
        rBtnBody.fillRoundedRect(-115, -24, 230, 48, 24);
        rBtnBody.lineStyle(2.5, 0xffffff, 0.9);
        rBtnBody.strokeRoundedRect(-115, -24, 230, 48, 24);

        const rBtnLabel = this.add.text(0, 0, '🔄  PLAY AGAIN', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '20px',
            fontWeight: '900',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.restartBtn.add([rBtnGlow, rBtnBody, rBtnLabel]);
        this.restartBtn.setSize(240, 52);
        this.restartBtn.setInteractive({ useHandCursor: true });

        this.restartBtn.on('pointerover', () => this.restartBtn.setScale(1.08));
        this.restartBtn.on('pointerout', () => this.restartBtn.setScale(1.0));
        this.restartBtn.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            this.resetGame();
        });

        this.gameOverContainer.add([
            cardBg, goTitle,
            medalBox, this.medalIcon, this.medalLabel,
            scoreBox, currentScoreLabel, this.finalScoreText, this.finalBestText,
            this.newRecordBanner,
            this.restartBtn
        ]);
    }

    setupInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Pointer click / tap handler
        this.input.on('pointerdown', (pointer) => {
            soundManager.init();
            if (this.currentState === this.STATE.MENU) {
                this.startGame();
            } else if (this.currentState === this.STATE.PLAYING) {
                this.flap();
            } else if (this.currentState === this.STATE.GAMEOVER && this.canRestart) {
                this.resetGame();
            }
        });

        // Keyboard handler
        const handleKeyPress = () => {
            soundManager.init();
            if (this.currentState === this.STATE.MENU) {
                this.startGame();
            } else if (this.currentState === this.STATE.PLAYING) {
                this.flap();
            } else if (this.currentState === this.STATE.GAMEOVER && this.canRestart) {
                this.resetGame();
            }
        };

        this.spaceKey.on('down', handleKeyPress);
        this.cursors.up.on('down', handleKeyPress);
        this.wKey.on('down', handleKeyPress);
        this.enterKey.on('down', () => {
            if (this.currentState === this.STATE.GAMEOVER && this.canRestart) {
                this.resetGame();
            } else if (this.currentState === this.STATE.MENU) {
                this.startGame();
            }
        });
    }

    showStartMenu() {
        this.currentState = this.STATE.MENU;
        this.startMenuContainer.setVisible(true);
        this.gameOverContainer.setVisible(false);
        this.scoreText.setVisible(false);

        // Reset bird position for idle bobbing
        this.bird.body.allowGravity = false;
        this.bird.setVelocity(0, 0);
        this.bird.setPosition(Math.min(this.gameWidth * 0.28, 260), this.gameHeight * 0.45);
        this.bird.setAngle(0);
        this.bird.play('fly');

        // Bobbing Tween
        if (this.bobTween) this.bobTween.stop();
        this.bobTween = this.tweens.add({
            targets: this.bird,
            y: this.bird.y - 18,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startGame() {
        if (this.currentState === this.STATE.PLAYING) return;
        soundManager.init();
        soundManager.playClick();

        if (this.bobTween) this.bobTween.stop();

        this.currentState = this.STATE.PLAYING;
        this.startMenuContainer.setVisible(false);
        this.gameOverContainer.setVisible(false);

        this.score = 0;
        this.scoreText.setText('0').setVisible(true);

        // Activate Bird Physics
        this.bird.body.allowGravity = true;
        this.bird.setVelocity(0, 0);

        // Initial Flap
        this.flap();

        // Start Spawning Pipes
        this.startPipeSpawner();
    }

    flap() {
        if (this.currentState !== this.STATE.PLAYING) return;

        this.bird.setVelocityY(-370);
        soundManager.playFlap();

        // Fast upward tilt
        this.tweens.add({
            targets: this.bird,
            angle: -22,
            duration: 110,
            ease: 'Power1'
        });

        // Squash and stretch bounce
        this.tweens.add({
            targets: this.bird,
            scaleX: 1.45,
            scaleY: 1.15,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeInOut'
        });

        // Emit puff particle trail
        this.emitFlapPuff(this.bird.x - 14, this.bird.y + 4);
    }

    startPipeSpawner() {
        if (this.pipeSpawnTimer) this.pipeSpawnTimer.remove();

        this.time.delayedCall(1200, () => {
            if (this.currentState === this.STATE.PLAYING) {
                this.spawnPipePair();
                this.pipeSpawnTimer = this.time.addEvent({
                    delay: 1650,
                    callback: this.spawnPipePair,
                    callbackScope: this,
                    loop: true
                });
            }
        });
    }

    spawnPipePair() {
        if (this.currentState !== this.STATE.PLAYING) return;

        const currentW = this.scale.width;
        const currentH = this.scale.height;
        const spawnX = currentW + 60;
        const playableHeight = currentH - this.groundHeight;

        // Gap calculations with safety margins
        const minGapY = 130;
        const maxGapY = playableHeight - 130;
        const gapCenterY = Phaser.Math.Between(minGapY, maxGapY);
        const gapSize = Phaser.Math.Clamp(this.pipeGap, 170, 220);

        // Top Pipe (Inverted)
        const topPipeY = gapCenterY - gapSize / 2;
        const topPipe = this.pipes.create(spawnX, topPipeY, 'pipe');
        topPipe.setOrigin(0.5, 1);
        topPipe.setFlipY(true);
        topPipe.body.allowGravity = false;
        topPipe.body.immovable = true;
        topPipe.body.velocity.x = -this.pipeSpeed;
        topPipe.scored = false;

        // Bottom Pipe (Upright)
        const bottomPipeY = gapCenterY + gapSize / 2;
        const bottomPipe = this.pipes.create(spawnX, bottomPipeY, 'pipe');
        bottomPipe.setOrigin(0.5, 0);
        bottomPipe.body.allowGravity = false;
        bottomPipe.body.immovable = true;
        bottomPipe.body.velocity.x = -this.pipeSpeed;

        topPipe.isTop = true;
    }

    handleCollision() {
        if (this.currentState === this.STATE.GAMEOVER) return;

        this.currentState = this.STATE.GAMEOVER;
        this.canRestart = false;

        // Audio and Screen Juice
        soundManager.playHit();
        this.time.delayedCall(100, () => soundManager.playDie());

        this.cameras.main.shake(250, 0.018);
        this.cameras.main.flash(180, 255, 255, 255, true);

        // Feather explosion
        this.emitFeatherExplosion(this.bird.x, this.bird.y);

        // Stop all pipes and timers
        if (this.pipeSpawnTimer) this.pipeSpawnTimer.remove();
        this.pipes.setVelocityX(0);

        // Stop bird flapping animation & let it fall
        this.bird.stop();
        this.bird.setTexture('bird_0');
        this.bird.setVelocityY(-150);

        this.tweens.add({
            targets: this.bird,
            angle: 90,
            duration: 600,
            ease: 'Cubic.easeIn'
        });

        // Show Game Over scoreboard with smooth delay
        this.time.delayedCall(600, () => {
            this.showGameOverMenu();
        });
    }

    showGameOverMenu() {
        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.highScore = this.score;
            localStorage.setItem('flappy_highscore', this.highScore);
        }

        this.finalScoreText.setText(`${this.score}`);
        this.finalBestText.setText(`BEST: ${this.highScore}`);
        this.newRecordBanner.setVisible(isNewRecord);

        // Award Medal
        let medal = '🥉';
        let label = 'BRONZE';
        if (this.score >= 40) {
            medal = '💎';
            label = 'PLATINUM';
        } else if (this.score >= 25) {
            medal = '🥇';
            label = 'GOLD';
        } else if (this.score >= 12) {
            medal = '🥈';
            label = 'SILVER';
        } else if (this.score >= 5) {
            medal = '🥉';
            label = 'BRONZE';
        } else {
            medal = '🥚';
            label = 'BEGINNER';
        }
        this.medalIcon.setText(medal);
        this.medalLabel.setText(label);

        // Animate Panel Entrance
        this.gameOverContainer.setPosition(this.scale.width / 2, -300);
        this.gameOverContainer.setVisible(true);

        this.tweens.add({
            targets: this.gameOverContainer,
            y: this.scale.height / 2,
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.canRestart = true;
            }
        });
    }

    resetGame() {
        soundManager.playClick();
        this.pipes.clear(true, true);
        this.showStartMenu();
    }

    update(time, delta) {
        // Parallax Scrolling during MENU and PLAYING states
        if (this.currentState === this.STATE.MENU || this.currentState === this.STATE.PLAYING) {
            this.ground.tilePositionX += (this.pipeSpeed * delta) / 1000;
            this.cityline.tilePositionX += ((this.pipeSpeed * 0.35) * delta) / 1000;
            this.clouds.tilePositionX += ((this.pipeSpeed * 0.12) * delta) / 1000;
        }

        // Gameplay Update Logic
        if (this.currentState === this.STATE.PLAYING) {
            if (this.bird.body.velocity.y > 60) {
                this.bird.angle = Phaser.Math.Clamp(this.bird.angle + 2.5, -25, 75);
            }

            if (this.bird.y < 0) {
                this.bird.y = 0;
                this.bird.setVelocityY(50);
            }

            this.pipes.children.iterate((pipe) => {
                if (!pipe) return;

                if (pipe.isTop && !pipe.scored && pipe.x < this.bird.x) {
                    pipe.scored = true;
                    this.score++;
                    this.scoreText.setText(`${this.score}`);
                    soundManager.playScore();

                    // Score Pop Animation
                    this.tweens.add({
                        targets: this.scoreText,
                        scaleX: 1.35,
                        scaleY: 1.35,
                        duration: 90,
                        yoyo: true,
                        ease: 'Quad.easeInOut'
                    });

                    this.showScorePopup(pipe.x + 40, this.bird.y - 30);
                }

                if (pipe.x < -100) {
                    pipe.destroy();
                }
            });
        }
    }

    showScorePopup(x, y) {
        const popup = this.add.text(x, y, '+1', {
            fontFamily: '"Outfit", sans-serif',
            fontSize: '24px',
            fontWeight: '900',
            color: '#fde047',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(35);

        this.tweens.add({
            targets: popup,
            y: y - 45,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 600,
            ease: 'Power2',
            onComplete: () => popup.destroy()
        });
    }

    handleResize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        this.gameWidth = width;
        this.gameHeight = height;

        this.cameras.main.setSize(width, height);

        this.drawSkyGradient();

        if (this.clouds) {
            this.clouds.setSize(width, 70);
            this.clouds.setPosition(0, height - this.groundHeight - 140);
        }
        if (this.cityline) {
            this.cityline.setSize(width, 140);
            this.cityline.setPosition(0, height - this.groundHeight);
        }

        if (this.ground) {
            this.ground.setSize(width, this.groundHeight);
            this.ground.setPosition(0, height - this.groundHeight);
        }
        if (this.groundPlatform) {
            this.groundPlatform.setPosition(width / 2, height - this.groundHeight / 2);
            this.groundPlatform.setSize(width * 2, this.groundHeight);
        }

        if (this.scoreText) {
            this.scoreText.setPosition(width / 2, 60);
        }
        if (this.soundBtn) {
            this.soundBtn.setPosition(width - 55, 45);
        }
        if (this.startMenuContainer) {
            this.startMenuContainer.setPosition(width / 2, height / 2);
        }
        if (this.gameOverContainer && this.gameOverContainer.visible) {
            this.gameOverContainer.setPosition(width / 2, height / 2);
        }
    }
}

// ==========================================
// Phaser Game Initialization
// ==========================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1050 },
            debug: false
        }
    },
    scene: [MainGameScene]
};

window.addEventListener('DOMContentLoaded', () => {
    new Phaser.Game(config);
});