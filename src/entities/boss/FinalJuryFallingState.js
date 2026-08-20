import BossStateName from "./../../enums/BossStateName.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryFallingState extends FinalJuryState {
    constructor(boss) {
        super (boss);
    }

    enter() {
		this.boss.currentAnimation = this.boss.finalJuryAnimations.idle;
	}

    update(dt) {
		super.update(dt);
		this.handleDecision();
	}

    handleDecision() {
        if(this.boss.velocity.y === 0) {
            this.boss.stateMachine.change(BossStateName.Idling);
        }
    }
}