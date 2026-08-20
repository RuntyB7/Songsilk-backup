import Vector from "./../../../lib/Vector.js";
import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds } from "./../../globals.js";
import FirePillarCollider from "./../collidervariants/FirePillarCollider.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJurySlidingState extends FinalJuryState {
    constructor(boss) {
        super(boss);

        this.elapsedTime = 0;
        this.slideDurationDuration = 3;

        this.pillarSpawnCooldown = 0.6;
        this.pillarSpawnTimer = 0;

        this.previousDimensions = this.boss.dimensions;
        this.isSliding = false;
    }

    enter() {
        this.isSliding = true;

        this.boss.currentAnimation = this.boss.finalJuryAnimations.slide;
        this.boss.currentAnimation.refresh();

        this.boss.dimensions = new Vector(29, 35);
        this.boss.position.y += 15;

        this.elapsedTime = 0;
        this.pillarSpawnTimer = 0;

        if(this.boss.facingRight) {
            this.boss.velocity.x += 200
        } else {
            this.boss.velocity.x -= 200
        }
        sounds.play(SoundName.BossJump);

        
    }

    update(dt) {
        super.update(dt);
        this.boss.currentAnimation.update(dt);
        this.elapsedTime += dt;
        this.pillarSpawnTimer += dt;
        // Create new rings periodically
            if (this.pillarSpawnTimer >= this.pillarSpawnCooldown) {
                this.spawnNewPillar();
                this.pillarSpawnTimer = 0;
            }
        this.handleDecision();
    }


    spawnNewPillar() {
        const baseX = this.boss.position.x + this.boss.dimensions.x / 2 - 16;
        const baseY = this.boss.position.y + this.boss.dimensions.y - 160;

        const pillarWidth = 32;
        const pillarHeight = 160;
        const lifetime = 1;
        this.boss.map.damageColliders.push(
            
            new FirePillarCollider(baseX, baseY, pillarWidth, pillarHeight, lifetime, this.boss, 8)
        );
        sounds.play(SoundName.FirePillarSummon);
    }

    handleDecision() { 
        if (this.boss.velocity.y > 0) {
            this.boss.dimensions = this.previousDimensions;
            this.isSliding = false;
            this.boss.stateMachine.change(BossStateName.Falling);
        } else if (this.elapsedTime > this.slideDurationDuration) {
            this.boss.dimensions = this.previousDimensions;
            this.isSliding = false;
            this.boss.stateMachine.change(BossStateName.Idling);
        } else if (this.boss.velocity.x === 0) {
            this.boss.dimensions = this.previousDimensions;
            this.isSliding = false;
            this.boss.stateMachine.change(BossStateName.Idling);
        }

    }
}