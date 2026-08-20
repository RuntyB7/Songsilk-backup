import PlayerState from './PlayerState.js';
import PlayerStateName from './../../enums/PlayerStateName.js';
import Player from './Player.js';
import { input } from './../../globals.js';
import Input from './../../../lib/Input.js';

/**
 * Represents the falling state of the player.
 * @extends PlayerState
 */
export default class PlayerFallingState extends PlayerState {
	/**
	 * Creates a new PlayerFallingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
	}

	/**
	 * Called when entering the falling state.
	 */
	enter() {
		// if(this.player.isBig) {
		// 	this.player.currentAnimation = this.player.bigAnimations.fall;
		// } else{
		// 	this.player.currentAnimation = this.player.smallAnimations.fall;
		// }
		this.player.currentAnimation = this.player.playerAnimations.fall;
	}

	/**
	 * Updates the falling state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		super.update(dt);

		this.handleHorizontalMovement();
		this.handleInput()
		this.checkTransitions();
	}

	/**
	 * Checks for state transitions.
	 */
	checkTransitions() {
		
		if (this.player.isOnGround) {
			if (Math.abs(this.player.velocity.x) < 0.1) {
				this.player.stateMachine.change(PlayerStateName.Idling);
			} else {
				this.player.stateMachine.change(PlayerStateName.Running);
			}
		}
		
	}
	handleInput(){
		super.handleInput();

		if (input.isKeyPressed(Input.KEYS.L)) {
			this.player.stateMachine.change(PlayerStateName.Slashing);
		}
		if (input.isKeyHeld(Input.KEYS.S) && input.isKeyPressed(Input.KEYS.L)) {
			this.player.stateMachine.change(PlayerStateName.Downslashing);
		}
	}
}
