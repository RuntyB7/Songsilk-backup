import { BossConfig } from "./../../../config/BossConfig.js";
import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds } from "./../../globals.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryJumpingState extends FinalJuryState {
    constructor(boss) {
        super(boss);
        this.validSlam = false;
    }

    enter() {
        const boss = this.boss;
        // ---------------------------------------------
        // JUMP POWER LOGIC
        // ---------------------------------------------
        let jumpPower;

        // Chooses between a random selection of jumps
        const jumps = [
            BossConfig.jumpPower * 0.6,   // low jump
            BossConfig.jumpPower * 0.85,  // medium jump
            BossConfig.jumpPower * 1,   // high jump
        ];
        jumpPower = jumps[Math.floor(Math.random() * jumps.length)];
        if(jumpPower == BossConfig.jumpPower) {
            this.validSlam = true;
        }
        boss.velocity.y = jumpPower;

        boss.velocity.x = boss.facingRight ? BossConfig.maxSpeed : -BossConfig.maxSpeed;

        boss.currentAnimation = boss.finalJuryAnimations.jump;
        sounds.play(SoundName.BossJump);
        boss.isOnGround = false;
    }

    exit() {}

    update(dt) {
        super.update(dt);
        this.checkTransitions();
    }

    checkTransitions() {
        if(this.boss.velocity.y > 0 && this.validSlam) {
            this.boss.stateMachine.change(BossStateName.Slamming);
        } else if (this.boss.velocity.y > 0) {
            this.boss.stateMachine.change(BossStateName.Slamming);
        }
    }
}