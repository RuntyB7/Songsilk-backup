import State from './../../lib/State.js';
import Debug from '../../lib/Debug.js';
import Map from './../services/Map.js';
import Camera from './../services/Camera.js';
import { canvas, CANVAS_WIDTH, debugOptions, images, sounds, stateMachine, timer } from './../globals.js';
import Player from './../entities/player/Player.js';
import Tile from './../services/Tile.js';
import ImageName from './../enums/ImageName.js';
import MusicName from './../enums/MusicName.js';
import Particle from './../../lib/Particle.js';
import Vector from './../../lib/Vector.js';
import UserInterface from './../services/UserInterface.js';
import FinalJury from './../entities/boss/FinalJury.js';
import { getRandomNumber, getRandomPositiveInteger } from './../../lib/Random.js';
import GameStateName from './../enums/GameStateName.js';

/**
 * Represents the main play state of the game.
 * @extends State
 */
export default class PlayState extends State {
	/**
	 * Creates a new PlayState instance.
	 * @param {Object} mapDefinition - The definition object for the game map.
	 */
	constructor(mapDefinition) {
		super();

		this.map = new Map(mapDefinition);
		
		this.boss = new FinalJury(350, 30, 29, 50, this.map);

		this.player = new Player(50, 248, 11, 24, this.map, this.boss);

		this.boss.player = this.player;


		this.camera = new Camera(
			this.player,
			canvas.width,
			canvas.height,
			this.map.width * Tile.SIZE,
			this.map.height * Tile.SIZE
		);

		this.UI = new UserInterface(this.player);

		// Initialize debug tools
		this.debug = new Debug();

		// Load background image
		this.backgroundImage = images.get(ImageName.Background);

		// Set up parallax layers for background
		this.parallaxLayers = [
			{ image: this.backgroundImage, speedX: 0.04, speedY: 0.1 },
		];

		this.rain = [];
		this.rainGravity = new Vector(0, 600);
		this.wind = new Vector(200, 0);

		
		
	}

	enter() {
		this.boss.reset();
		this.player.reset();
		this.map.reset();
		this.selectBossTheme();
		this.loadGame();

		this.beforeUnloadHandler = () => this.saveGame();

		window.addEventListener("beforeunload", this.beforeUnloadHandler);
	}

	selectBossTheme() {
		const musicId = getRandomPositiveInteger(1,3);

		switch(musicId) {
			case 1:
				sounds.play(MusicName.BossTheme);
				break;
			case 2:
				sounds.play(MusicName.BossTheme1);
				break;
			case 3:
				sounds.play(MusicName.BossTheme2);
				break;
		}
	}

	exit() {
		window.removeEventListener("beforeunload", this.beforeUnloadHandler);
		this.beforeUnloadHandler = null;
	}

	/**
	 * Updates the play state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		timer.update(dt);
		this.debug.update();
		this.map.update(dt);
		this.camera.update(dt);
		this.player.update(dt);
		this.boss.update(dt);
		this.UI.update(dt);

		const spawnX = this.camera.position.x-150 + Math.random() * this.camera.viewportWidth;

		const spawnY = this.camera.position.y - 200;


		this.rain.push(new Particle(spawnX, spawnY));
		
		this.rain = this.rain.filter(particle => particle.isAlive);

		this.rain.forEach(particle => {
			const windVariance = (Math.random() - 0.5) * 200;
			particle.applyForce(new Vector(50,getRandomNumber(50,100)), dt);
			particle.applyForce(new Vector(this.wind.x + windVariance, this.wind.y),dt);
			particle.applyForce(this.rainGravity, dt);
			
			particle.update(dt);
		});

		if(this.boss.health <= 0) {

			sounds.stopAll();
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.Victory],
			});
		}

		if (this.player.isDead) {
			sounds.stopAll();
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.TitleScreen],
			});

		}
	}

	saveGame() {
		localStorage.setItem("songsilk_save", JSON.stringify({
			player: {
				x: this.player.position.x,
				y: this.player.position.y,
				health: this.player.health,
			},
			boss: {
				x: this.boss.position.x,
				y: this.boss.position.y,
				health: this.boss.health,
			}
		}));
	}

	loadGame() {
		const data = JSON.parse(localStorage.getItem("songsilk_save"));

		if(!data) return false;

		// === Restore player ===
		this.player.position.x = data.player.x;
		this.player.position.y = data.player.y;
		this.player.health = data.player.health;

		// === Restore boss ===
		this.boss.position.x = data.boss.x;
		this.boss.position.y = data.boss.y;
		this.boss.health = data.boss.health;

		return true;
	}

	/**
	 * Renders the play state.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
		this.camera.applyTransform(context);

		if (!debugOptions.mapGrid) {
			this.renderParallaxBackground();
		}

		this.map.render(context);
		this.player.render(context);
		this.boss.render(context);
		this.map.damageColliders.forEach(collider => {
			collider.render(context, '#1b2e4a');
		});

		

		this.rain.forEach(particle => {
			particle.render(context,'#1b2e4a');
		});

		this.camera.resetTransform(context);

		this.UI.render(context);

		if (debugOptions.cameraCrosshair) {
			this.renderCameraGuidelines(context);
			this.renderLookahead(context);
		}

		if (debugOptions.watchPanel) {
			this.setDebugPanel();
		} else {
			this.debug.unwatch('Map');
			this.debug.unwatch('Camera');
			this.debug.unwatch('Player');
			this.debug.unwatch('Goombas');
		}
	}

	/**
	 * Renders the parallax background.
	 */
	renderParallaxBackground() {
		this.parallaxLayers.forEach((layer) => {
			const parallaxX = -this.camera.position.x * layer.speedX;
			const parallaxY = -this.camera.position.y * layer.speedY;

			// Calculate repetitions needed to cover the screen
			const repetitionsX =
				Math.ceil(canvas.width / layer.image.width) + 1;
			const repetitionsY =
				Math.ceil(canvas.height / layer.image.height) + 1;

			for (let y = 0; y < repetitionsY; y++) {
				for (let x = 0; x < repetitionsX; x++) {
					const drawX =
						(parallaxX % layer.image.width) + x * layer.image.width;
					const drawY =
						(parallaxY % layer.image.height) +
						y * layer.image.height;
					layer.image.render(drawX, drawY);
				}
			}
		});
	}

	/**
	 * Renders the camera lookahead crosshair for debugging.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	renderLookahead(context) {
		const lookaheadPos = this.camera.getLookaheadPosition();
		const size = 10;

		context.strokeStyle = 'rgba(255, 0, 0, 0.8)';
		context.lineWidth = 2;

		// Draw crosshair
		context.beginPath();
		context.moveTo(lookaheadPos.x - size, lookaheadPos.y);
		context.lineTo(lookaheadPos.x + size, lookaheadPos.y);
		context.moveTo(lookaheadPos.x, lookaheadPos.y - size);
		context.lineTo(lookaheadPos.x, lookaheadPos.y + size);
		context.stroke();

		// Draw circle
		context.beginPath();
		context.arc(lookaheadPos.x, lookaheadPos.y, size / 2, 0, Math.PI * 2);
		context.stroke();
	}

	/**
	 * Renders camera guidelines for debugging.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	renderCameraGuidelines(context) {
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		context.setLineDash([5, 5]);
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(255, 255, 255, 0.9)';

		// Draw vertical line
		context.beginPath();
		context.moveTo(centerX, 0);
		context.lineTo(centerX, canvas.height);
		context.stroke();

		// Draw horizontal line
		context.beginPath();
		context.moveTo(0, centerY);
		context.lineTo(canvas.width, centerY);
		context.stroke();

		context.setLineDash([]);
	}

	/**
	 * Sets up the debug panel with various game object properties.
	 */
	setDebugPanel() {
		this.debug.watch('Map', {
			width: () => this.map.width,
			height: () => this.map.height,
			coins: () => this.map.coins,
			mushrooms: () => this.map.mushrooms
		});

		this.debug.watch('Camera', {
			position: () =>
				`(${this.camera.position.x.toFixed(
					2
				)}, ${this.camera.position.y.toFixed(2)})`,
			lookahead: () =>
				`(${this.camera.lookahead.x.toFixed(
					2
				)}, ${this.camera.lookahead.y.toFixed(2)})`,
		});

		this.debug.watch('Player', {
			position: () =>
				`(${this.player.position.x.toFixed(
					2
				)}, ${this.player.position.y.toFixed(2)})`,
			velocity: () =>
				`(${this.player.velocity.x.toFixed(
					2
				)}, ${this.player.velocity.y.toFixed(2)})`,
			isDying: () => this.player.isDying,
			isOnGround: () => this.player.isOnGround,
			isGraced: () => this.player.isGraced,
			isBig: () => this.player.isBig,
			state: () => this.player.stateMachine.currentState.name,
		});

		this.debug.watch('Goombas', {
			count: () => this.map.goombas.length,
		});

		this.debug.watch('Coins', {
			count: () => this.player.coinCount
		})
	}
}
