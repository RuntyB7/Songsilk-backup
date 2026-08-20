import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds, timer } from "./../../globals.js";
import FirePillarCollider from "./../collidervariants/FirePillarCollider.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJurySlammingState extends FinalJuryState {
    constructor(boss) {
        super(boss);
    }

    enter() {
        this.boss.currentAnimation = this.boss.finalJuryAnimations.slam;
        this.boss.currentAnimation.refresh();
        sounds.play(SoundName.BossSlamVoice);
    }

    update(dt) {
        super.update(dt);
        this.boss.currentAnimation.update(dt);
        this.handleDecision();
    }

    handleDecision() { 
        if(this.boss.velocity.y === 0 && this.boss.currentAnimation.isDone()) {
            this.generateFireShockwaveColliders();
            sounds.play(SoundName.BossSlam);
            this.boss.stateMachine.change(BossStateName.Idling);
        }
    }

    generateFireShockwaveColliders() {
        const baseX = this.boss.position.x + this.boss.dimensions.x / 2 - 16;
        const baseY = this.boss.position.y + this.boss.dimensions.y - 20;

        const pillarWidth = 32;
        const pillarHeight = 20;   // shorter pillars for shockwave
        const lifetime = 1;
        const spacing = 40;        // horizontal spacing between pillars
        const waveCount = 5;      // number of pillars per side
        const delay = 0.15;        // wave speed

        // Spawn rightward shockwave
        for (let i = 0; i < waveCount; i++) {
            const x = baseX + spacing * (i + 1) - 40;
            timer.wait(i * delay).then(() => {
                sounds.play(SoundName.FireShockwave);
                this.boss.map.damageColliders.push(
                    new FirePillarCollider(x, baseY, pillarWidth, pillarHeight, lifetime, this.boss, 5)
                );
            });
        }

        // Spawn leftward shockwave
        for (let i = 0; i < waveCount; i++) {
            const x = baseX - spacing * (i + 1) + 40;
            timer.wait(i * delay).then(() => {
                sounds.play(SoundName.FireShockwave);
                this.boss.map.damageColliders.push(
                    new FirePillarCollider(x, baseY, pillarWidth, pillarHeight, lifetime, this.boss, 5)
                );
            });
        }
    }
}