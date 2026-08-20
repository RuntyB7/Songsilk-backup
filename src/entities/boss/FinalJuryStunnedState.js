import Vector from "./../../../lib/Vector.js";
import BossStateName from "./../../enums/BossStateName.js";
import { timer } from "./../../globals.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryStunnedState extends FinalJuryState {
    constructor(boss) {
        super(boss);
        this.stunDuration = 2;

        this.previousDimensions = this.boss.dimensions;
    }

    enter(){
        this.boss.isStunned = true;
        this.boss.currentAnimation = this.boss.finalJuryAnimations.stun;

        this.boss.dimensions = new Vector(29, 35);
        this.boss.position.y += 15;

        this.boss.grunt();

        timer.addTask(
            () => {},
            1,
            this.stunDuration,
            () => {
                this.boss.isStunned = false;
                this.boss.numberOfHits = 0;
                this.boss.dimensions = this.previousDimensions;
                this.boss.stateMachine.change(BossStateName.Idling);
            }
        );
    }

    update(dt) {
        super.update(dt);
        this.boss.currentAnimation.update(dt);
    }
}