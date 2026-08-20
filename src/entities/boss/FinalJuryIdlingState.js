import { getRandomPositiveNumber, oneInXChance } from "./../../../lib/Random.js";
import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds, timer } from "./../../globals.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryIdlingState extends FinalJuryState {
    constructor(boss) {
        super (boss);
        this.cooldown = 0;
        this.isOnCooldown = false;
    }

    // === Helpers ===
    get distanceToPlayer() {
        return Math.abs(
            this.boss.player.position.x - this.boss.position.x
        );
    }

    get healthPercent() {
        return this.boss.health / this.boss.totalHealth;
    }

    // clever weight logic, assistance provided by AI
    pickWeighted(options) {
        const total = options.reduce((sum, o) => sum + o.weight, 0);
        let roll = Math.random() * total;

        for (const option of options) {
            if (roll < option.weight) {
                return option.state;
            }
            roll -= option.weight;
        }
    }
    

    enter() {
		this.boss.velocity.x = 0;
		this.boss.velocity.y = 0;

		this.boss.currentAnimation = this.boss.finalJuryAnimations.idle;
        if(oneInXChance(5)) {
            sounds.play(SoundName.BossTaunt);
        }
        
        this.isOnCooldown = true;
        this.cooldown = getRandomPositiveNumber(0.5, 1.5);
        timer.wait(this.cooldown).then(() => {
            this.isOnCooldown = false;
        });
	}

    update(dt) {
		super.update(dt);
		this.handleDecision();
	}

    // === Decision Logic ===
    handleDecision() {
        // Stop early if cooldown is still active
        if (this.isOnCooldown) return;

        // small hesitation
        if(oneInXChance(15)) return;

        const distance = this.distanceToPlayer;
        const aggressive = this.healthPercent < 0.5;

        const options = [
            {
                state: BossStateName.Whipping,
                weight: distance < 40 ? 6 : 0,
            },
            {
                state: BossStateName.Jumping,
                weight: distance >= 40 && distance < 120 ? 4 : 1,
            },
            {
                state: BossStateName.Spinning,
                weight: distance < 80 ? 3 : 1,
            },
            {
                state: BossStateName.Sliding,
                weight: distance >= 120 ? 5 : 1,
            }
        ];

        //Take aggression into effect
        if(aggressive) {
            options.forEach(o => {
                if (o.state === BossStateName.Spinning || o.state === BossStateName.Sliding) {
                    o.weight += 2;
                }
            });
        }

        // reduces move weight if it used it before hand
        if (this.boss.lastAttack ) {
            const last = options.find(o => o.state === this.boss.lastAttack);
            if(last) {
                last.weight *= 0.3;
            }
        }

        const validOptions = options.filter(o => o.weight > 0);
        const chosenState = this.pickWeighted(validOptions);

        if (chosenState) {
            this.boss.lastAttack = chosenState;
            this.boss.stateMachine.change(chosenState);
        }

        if(oneInXChance(100)) {
            this.boss.stateMachine.change(BossStateName.Whipping);
        } else if(oneInXChance(50)) {
            this.boss.stateMachine.change(BossStateName.Jumping);
        } else if(oneInXChance(50)) {
            this.boss.stateMachine.change(BossStateName.Spinning);
        } else if(oneInXChance(50)) {
            this.boss.stateMachine.change(BossStateName.Sliding);
        }
    }
}