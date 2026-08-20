import SoundName from "./../../enums/SoundName.js";
import { sounds, timer } from "./../../globals.js";
import { Stats } from "./../../services/Stats.js";
import PlayerState from "./PlayerState.js";

export default class PlayerDyingState extends PlayerState {
    constructor(player) {
        super(player);
        this.deathPause = 2
    }

    enter() {
        this.player.currentAnimation = this.player.playerAnimations.death;
        this.player.isDying = true;
        sounds.play(SoundName.GruntDeath);
        localStorage.removeItem("songsilk_save");

        Stats.addDeath();
        timer.addTask(
            () => {},
            0.1,
            this.deathPause,
            () => this.checkTransition()
        );
    }

    update(dt) {
        
    }

    checkTransition() {
        this.player.isDying = false;
        this.player.die();
    }
}