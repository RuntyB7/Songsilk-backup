import Sprite from './../../lib/Sprite.js';

/**
 * Represents a single tile in the game world.
 */
export default class Tile {
	/**
	 * The size of a tile in pixels.
	 * @type {number}
	 */
	static SIZE = 16;

	/**
	 * List of ids of any tile that should not be interactable with any solid game entity
	 * @type {array}
	 */
	static BACKGROUND_TILES = [
		4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 30, 31, 34, 35, 36, 37, 47, 48, 49, 50,
		56, 57, 59, 60, 62, 66, 68, 75, 76, 81, 86, 88, 89, 143, 144,
		145, 146, 147, 148, 150, 157, 163
	];



	/**
	 * Creates a new Tile instance.
	 * @param {number} id - The ID of the tile, corresponding to its sprite in the spritesheet.
	 * @param {Sprite[]} sprites - An array of Sprite objects representing all possible tile sprites.
	 */
	constructor(id, sprites, isCollidable = true) {
		this.sprites = sprites;
		this.id = id;
		if (Tile.BACKGROUND_TILES.find(t => t == this.id)) {
			this.isCollidable = false;
		} else {
			this.isCollidable = isCollidable;	
		}
	}

	/**
	 * Renders the tile at the specified grid coordinates.
	 * @param {number} x - The x-coordinate in the tile grid (not pixels).
	 * @param {number} y - The y-coordinate in the tile grid (not pixels).
	 */
	render(x, y) {
		// Multiply by Tile.SIZE to convert grid coordinates to pixel coordinates
		this.sprites[this.id].render(x * Tile.SIZE, y * Tile.SIZE);
	}
}
