import { BossConfig } from "./../../../config/BossConfig.js";
import { getRandomPositiveInteger, oneInXChance } from "./../../../lib/Random.js";
import State from "./../../../lib/State.js";
import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { debugOptions, sounds } from "./../../globals.js";
import CollisionDetector from "./../../services/CollisionDetector.js";
import Tile from "./../../services/Tile.js";

export default class FinalJuryState extends State {
    constructor(boss) {
        super();
        this.boss = boss;
        this.collisionDetector = new CollisionDetector(boss.map);
        
    }

    update(dt) {
        this.checkDirection();
		this.applyGravity(dt);
		this.updatePosition(dt);
        if (this.boss.numberOfHits == this.boss.staggerThreshold && !this.boss.isStunned) {
            this.boss.stateMachine.change(BossStateName.Stunning);
        }
        if(oneInXChance(1000)) {
            this.chant();
        }
        
		this.boss.currentAnimation.update(dt);
	}

    render(context) {
        // Call the parent class's render method
        super.render();

        // Save the current canvas state
        context.save();

        // Handle Final Jury orientation (facing right or left)
        if (this.boss.facingRight) {
            // If facing right, flip the sprite horizontally
            context.scale(-1, 1);
            // Adjust position to account for the flip
            context.translate(
                Math.floor(-this.boss.position.x - this.boss.dimensions.x - this.boss.renderOffset.x),
                Math.floor(this.boss.position.y - this.boss.renderOffset.y)
            );
        } else {
            // If facing left, just translate to the Final Jury's position
            context.translate(
                Math.floor(this.boss.position.x - this.boss.renderOffset.x),
                Math.floor(this.boss.position.y - this.boss.renderOffset.y)
            );
        }

        // Render the current frame of the Final Jury's animation
        this.boss.currentAnimation.getCurrentFrame().render(0, 0);

        // Restore the canvas state to what it was before our changes
        context.restore();

        // If debug mode is enabled, render additional debug information
        if (debugOptions.bossCollision) {
            this.renderDebug(context);
        }
    }

    renderDebug(context) {

        // Render a blue outline around the Final Jury's bounding box
        context.strokeStyle = 'blue';
        context.strokeRect(
            this.boss.position.x,
            this.boss.position.y,
            this.boss.dimensions.x,
            this.boss.dimensions.y
        );
    }
    checkDirection() {
        if(this.boss.isOnGround && !this.boss.stateMachine.currentState?.isSliding) {
            if(this.boss.player.position.x > this.boss.position.x) {
                this.boss.facingRight = true;
            } else {
                this.boss.facingRight = false;

            }
        }
    }

    applyGravity(dt) {
        if (!this.boss.isOnGround) {
            // Increase downward velocity, but don't exceed max fall speed
            this.boss.velocity.y = Math.min(
                this.boss.velocity.y + BossConfig.gravity * dt,
                BossConfig.maxFallSpeed
            );
        }
    }

    updatePosition(dt) {
        // Calculate position change
        const dx = this.boss.velocity.x * dt;
        const dy = this.boss.velocity.y * dt;

        // Update horizontal position and check for collisions
        this.boss.position.x += dx;
        this.collisionDetector.checkHorizontalCollisions(this.boss);

        // Update vertical position and check for collisions
        this.boss.position.y += dy;
        this.collisionDetector.checkVerticalCollisions(this.boss);

        // Keep Final Jury within horizontal map boundaries
        this.boss.position.x = Math.max(
            0,
            Math.min(
                Math.round(this.boss.position.x),
                this.boss.map.width * Tile.SIZE - this.boss.dimensions.x
            )
        );

        // Round vertical position to avoid sub-pixel rendering
        this.boss.position.y = Math.round(this.boss.position.y);
    }

    chant() {
        const chantId = getRandomPositiveInteger(1,2);
        switch(chantId) {
            case 1:
                sounds.play(SoundName.Chant1);
                break;
            case 2:
                sounds.play(SoundName.Chant2);
                break;
        }
    }
}