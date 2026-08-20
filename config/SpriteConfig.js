import Sprite from '../lib/Sprite.js';

export const playerSpriteConfig = {
    idle: [
        {x: 0, y: 0, width: 32, height: 32},
    ],
    run: [
        {x: 32, y: 0, width: 32, height: 32},
        {x: 64, y: 0, width: 32, height: 32},
    ],
    jump: [
        {x: 96, y: 0, width: 32, height: 32},
    ],
    fall: [
        {x: 128, y: 0, width: 32, height: 32},
    ],
	slash: [
		{x: 0, y: 32, width: 32, height: 32},
		{x: 32, y: 32, width: 32, height: 32},
        {x: 64, y: 32, width: 32, height: 32},
	],
	slasheffectL: [
		{x: 96, y: 32, width: 32, height: 32},
	],
	slasheffectR: [
		{x: 160, y: 32, width: 32, height: 32},
	],
	downslash: [
		{x: 0, y: 64, width: 32, height: 32},
		{x: 32, y: 64, width: 32, height: 32},
        {x: 64, y: 64, width: 32, height: 32},
	],
	downeffectL: [
		{x: 96, y: 64, width: 32, height: 32},
	],
	downeffectR: [
		{x: 160, y: 64, width: 32, height: 32},
	],
	bind: [
		{x:128, y: 32, width: 32, height: 32}
	],
	death: [
		{x:128, y: 64, width: 32, height: 32}
	],
}
export const silkAnimConfig = {
	animation: [
		{x: 0, y: 0, width: 405, height: 155},
		{x: 0, y: 155, width: 405, height: 155},
		{x: 0, y: 310, width: 405, height: 155},
		{x: 0, y: 465, width: 405, height: 155},
		{x: 0, y: 620, width: 405, height: 155},
		{x: 0, y: 775, width: 405, height: 155},
		{x: 0, y: 930, width: 405, height: 155},
		{x: 0, y: 1085, width: 405, height: 155},
		{x: 0, y: 1240, width: 405, height: 155},
		{x: 0, y: 1395, width: 405, height: 155},
		{x: 0, y: 1550, width: 405, height: 155},
		{x: 0, y: 1705, width: 405, height: 155},
		{x: 0, y: 1860, width: 405, height: 155},
		{x: 0, y: 2015, width: 405, height: 155},
		{x: 0, y: 2170, width: 405, height: 155},
		{x: 0, y: 2325, width: 405, height: 155},
		{x: 0, y: 2480, width: 405, height: 155},
		{x: 0, y: 2635, width: 405, height: 155},
		{x: 0, y: 2790, width: 405, height: 155},
		{x: 0, y: 2945, width: 405, height: 155},
		{x: 0, y: 3100, width: 405, height: 155},
		{x: 0, y: 3255, width: 405, height: 155},
		{x: 0, y: 3410, width: 405, height: 155},
		{x: 0, y: 3565, width: 405, height: 155},
		{x: 0, y: 3720, width: 405, height: 155},
		{x: 0, y: 3875, width: 405, height: 155},
		{x: 0, y: 4030, width: 405, height: 155},
		{x: 0, y: 4185, width: 405, height: 155},
		{x: 0, y: 4340, width: 405, height: 155},
		{x: 0, y: 4495, width: 405, height: 155},
		{x: 0, y: 4650, width: 405, height: 155},
		{x: 0, y: 4805, width: 405, height: 155},
		{x: 0, y: 4960, width: 405, height: 155},
	]
}

export function loadPlayerSprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}

export const finalJurySpriteConfig = {
	idle: [
		{x: 0, y: 0, width: 48, height: 64},
	],
	jump: [
		{x: 48, y: 0, width: 48, height: 64},
	],
	slam: [
		{x: 0, y: 64, width: 48, height: 64},
		{x: 48, y: 64, width: 48, height: 64},
		{x: 96, y: 64, width: 48, height: 64},
		{x: 144, y: 64, width: 48, height: 64},
	],
	whip: [
		{x: 0, y: 128, width: 48, height: 64},
		{x: 96, y: 0, width: 48, height: 64},
		{x: 144, y: 0, width: 48, height: 64},
		{x: 144, y: 0, width: 48, height: 64},
	],
	spin: [
		{x: 0, y: 128, width: 48, height: 64},
		{x: 48, y: 128, width: 48, height: 64},
		{x: 96, y: 128, width: 48, height: 64},
		{x: 144, y: 128, width: 48, height: 64},
	],
	slide: [
		{x: 48, y: 192, width: 64, height: 48},
	],
	stun: [
		{x: 112, y: 192, width: 48, height: 48},
	],
	slasheffectL: [
		{x: 0, y: 192, width: 48, height: 64},
	],
	slasheffectR: [
		{x: 160, y: 192, width: 48, height: 64},
	]
}

export function loadFinalJurySprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}

export const UIspriteConfig = {
	healthbarspawn: [
		{x: 0, y: 0, width: 335, height: 142},
		{x: 0, y: 142, width: 335, height: 142},
		{x: 0, y: 284, width: 335, height: 142},
		{x: 0, y: 426, width: 335, height: 142},
		{x: 0, y: 568, width: 335, height: 142},
		{x: 0, y: 710, width: 335, height: 142},
	],
}
export const HealthbarMaskConfig = {
	mask: [
		{x: 0, y: 0, width: 170, height: 275}
	],
	breakanimation: [
		{x: 0, y: 275, width: 170, height: 275},
		{x: 0, y: 550, width: 170, height: 275},
		{x: 0, y: 825, width: 170, height: 275},
		{x: 0, y: 1100, width: 170, height: 275},
		{x: 0, y: 1375, width: 170, height: 275},
		{x: 0, y: 1650, width: 170, height: 275}
	],
	maskoutline: [
		{x: 0, y: 1925, width: 170, height: 275}
	],
}

export function loadUISprites(spriteSheet, spriteConfig) {
	const sprites = {};

	for (const [animationName, frames] of Object.entries(spriteConfig)) {
		sprites[animationName] = frames.map(
			(frame) =>
				new Sprite(
					spriteSheet,
					frame.x,
					frame.y,
					frame.width,
					frame.height
				)
		);
	}

	return sprites;
}
