import PlayerState from './PlayerState.js';
import { input, sounds } from './../../globals.js';
import { PlayerConfig } from './../../../config/PlayerConfig.js';
import Input from './../../../lib/Input.js';
import PlayerStateName from './../../enums/PlayerStateName.js';
import Player from './Player.js';
import SoundName from './../../enums/SoundName.js';

/**
 * Represents the jumping state of the player.
 * @extends PlayerState
 */
export default class PlayerJumpingState extends PlayerState {
	/**
	 * Creates a new PlayerJumpingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
	}

	/**
	 * Called when entering the jumping state.
	 */
	enter() {
		this.player.velocity.y = PlayerConfig.jumpPower;
		this.player.currentAnimation = this.player.playerAnimations.jump;
		sounds.play(SoundName.JumpVoice);
	}

	/**
	 * Called when exiting the jumping state.
	 */
	exit() {}

	/**
	 * Updates the jumping state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);

		this.handleInput();
		this.handleHorizontalMovement();
		this.checkTransitions();
	}

	/**
	 * Handles player input.
	 */
	handleInput(){
		super.handleInput();

		if (input.isKeyPressed(Input.KEYS.L)) {
			this.player.stateMachine.change(PlayerStateName.Slashing);
		}
		if (input.isKeyHeld(Input.KEYS.S) && input.isKeyPressed(Input.KEYS.L)) {
			this.player.stateMachine.change(PlayerStateName.Downslashing);
		}
		if (!input.isKeyHeld(Input.KEYS.SPACE) && this.player.velocity.y < 0) {
			this.player.velocity.y *= 0.5;
		}
	}

	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		if (this.player.velocity.y >= 0) {
			this.player.stateMachine.change(PlayerStateName.Falling);
		}
	}
}
