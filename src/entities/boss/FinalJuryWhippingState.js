import BossStateName from "./../../enums/BossStateName.js";
import DamageCollider from "./../collidervariants/DamageCollider.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryWhippingState extends FinalJuryState {
    constructor(boss) {
        super(boss);
    }

    enter() {
        // play whip sound effect
        this.boss.currentAnimation = this.boss.finalJuryAnimations.whip;
        this.boss.currentAnimation.refresh();

        this.spawnedHitbox = false;
    }

    update(dt) {
        this.boss.currentAnimation.update(dt);
        if (this.boss.currentAnimation.isHalfwayDone()) {
            this.spawnSlashHitbox();
		}
        if(this.boss.currentAnimation.isDone()) {
            this.boss.currentAnimation.refresh();
            this.boss.stateMachine.change(BossStateName.Idling);
        }
    }

    spawnSlashHitbox() {
        let effectSprite = this.boss.slashEffects.baseL[0];

        const width = effectSprite.width;
        const height = effectSprite.height;

        // Position hitbox relative to boss
        let x = this.boss.position.x;
        let y = this.boss.position.y + this.boss.dimensions.y / 2 - height / 2;

        if (this.boss.facingRight) {
            x += this.boss.dimensions.x; 
            effectSprite = this.boss.slashEffects.baseR[0]
        }
        else {
            x -= width; 
        }

        const hitbox = new DamageCollider(
            x,
            y,
            width,
            height,
            effectSprite,
            0.05,
            this.boss
        );

        this.boss.map.damageColliders.push(hitbox);
    }
}