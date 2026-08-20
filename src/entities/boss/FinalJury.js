import { finalJurySpriteConfig, loadFinalJurySprites } from "./../../../config/SpriteConfig.js";
import Animation from "./../../../lib/Animation.js";
import { getRandomPositiveInteger } from "./../../../lib/Random.js";
import StateMachine from "./../../../lib/StateMachine.js";
import Vector from "./../../../lib/Vector.js";
import BossStateName from "./../../enums/BossStateName.js";
import ImageName from "./../../enums/ImageName.js";
import SoundName from "./../../enums/SoundName.js";
import { images, sounds, timer } from "./../../globals.js";
import Entity from "./../Entity.js";
import FinalJuryFallingState from "./FinalJuryFallingState.js";
import FinalJuryFireSpinningstate from "./FinalJuryFireSpinningstate.js";
import FinalJuryIdlingState from "./FinalJuryIdlingState.js";
import FinalJuryJumpingState from "./FinalJuryJumpingState.js";
import FinalJurySlammingState from "./FinalJurySlammingState.js";
import FinalJurySlidingState from "./FinalJurySlidingState.js";
import FinalJuryStunnedState from "./FinalJuryStunnedState.js";
import FinalJuryWhippingState from "./FinalJuryWhippingState.js";

export default class FinalJury extends Entity {
    constructor(x, y, width, height, map, player) {
        super(x, y, width, height);
        this.isBoss = true;
        this.initialPosition = new Vector(x,y);
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.renderOffset = {
			x: 7,
			y: 11,
		}
        this.velocity = new Vector(0, 0);
        this.map = map;
        this.player = player;
        this.facingRight = false;

        this.totalHealth = 720;
        this.health = this.totalHealth;

        this.numberOfHits = 0;
        // number of hits required to stun Final Jury
        this.staggerThreshold = 14;

        this.isStunned = false;

        this.FinalJurySprites = loadFinalJurySprites(
            images.get(ImageName.FinalJury),
            finalJurySpriteConfig
        );

        this.finalJuryAnimations = {
            idle: new Animation(this.FinalJurySprites.idle),
            jump: new Animation(this.FinalJurySprites.jump),
            slam: new Animation(this.FinalJurySprites.slam, 0.15, 1),
            whip: new Animation(this.FinalJurySprites.whip, 0.1, 1),
            spin: new Animation(this.FinalJurySprites.spin, 0.1),
            slide: new Animation(this.FinalJurySprites.slide),
            stun: new Animation(this.FinalJurySprites.stun),
        };

        this.slashEffects = {
            baseL: this.FinalJurySprites.slasheffectL,
            baseR: this.FinalJurySprites.slasheffectR,
        };
        this.currentAnimation = this.finalJuryAnimations.idle;

        this.stateMachine = new StateMachine();
        this.stateMachine.add(
            BossStateName.Stunning,
            new FinalJuryStunnedState(this)
        );
        this.stateMachine.add(
            BossStateName.Whipping,
            new FinalJuryWhippingState(this)
        );
        this.stateMachine.add(
            BossStateName.Falling,
            new FinalJuryFallingState(this)
        );
        this.stateMachine.add(
            BossStateName.Jumping,
            new FinalJuryJumpingState(this)
        );
        this.stateMachine.add(
            BossStateName.Slamming,
            new FinalJurySlammingState(this)
        );
        this.stateMachine.add(
            BossStateName.Sliding,
            new FinalJurySlidingState(this)
        );
        this.stateMachine.add(
            BossStateName.Spinning,
            new FinalJuryFireSpinningstate(this)
        );
        this.stateMachine.add(
            BossStateName.Idling,
            new FinalJuryIdlingState(this)
        );

        this.lastAttack = null;
    }

    /**
	 * Updates the Final Jury's state.
	 * @param {number} dt - The time passed since the last update.
	 */
    update(dt) {
        this.checkDamageColliderCollisions();
		this.stateMachine.update(dt);
	}
    checkDamageColliderCollisions() {
        this.map.damageColliders.forEach(collider => {
            collider.checkHit(this);
        })
    }

    getHurt(source) {
        this.isGraced = true;
        this.health -= this.player.damageValue;
        this.numberOfHits += 1;
        this.grunt();
        timer.addTask(
            () => {},
            0.1,
            0.1,
            () => {
                this.isGraced = false;
            }
        );
    }

    grunt() {
        const gruntId = getRandomPositiveInteger(1,3);
        switch(gruntId) {
            case 1:
                sounds.play(SoundName.BossStun1);
                break;
            case 2:
                sounds.play(SoundName.BossStun2);
                break;
            case 3:
                sounds.play(SoundName.BossStun3);
                break;
        }
    }

    /**
	 * Renders the ]Final Jury.
	 * @param {CanvasRenderingContext2D} context - The rendering context.
	 */
	render(context) {
        this.stateMachine.render(context);
	}

    reset() {
        this.position.x = this.initialPosition.x;
        this.position.y = this.initialPosition.y;
        this.facingRight = false;

        this.health = this.totalHealth;

        this.isDead = false;
        this.isDying = false;

        this.stateMachine.change(BossStateName.Idling);
    }
}