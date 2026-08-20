import Input from "./../../lib/Input.js";
import State from "./../../lib/State.js";
import GameStateName from "./../enums/GameStateName.js";
import ImageName from "./../enums/ImageName.js";
import MusicName from "./../enums/MusicName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, input, sounds, stateMachine, timer } from "./../globals.js";
import { Stats } from "./../services/Stats.js";

export default class VictoryState extends State {
	constructor() {
		super();
		this.isVictory = true;

		this.scrollY = CANVAS_HEIGHT;     // starting below the screen
        this.scrollSpeed = 15;            // pixels per second
        this.credits = this.buildCredits();
        this.lineHeight = 16;             // space between lines

        this.totalHeight = this.credits.length * this.lineHeight + 100;
	}

	enter() {
		sounds.stopAll();
        sounds.play(MusicName.VictoryMusic);
        localStorage.removeItem("songsilk_save");

        Stats.addVictory();
        // Start credit roll below the screen
        this.scrollY = CANVAS_HEIGHT;
	}

	exit() {
		sounds.stop(MusicName.VictoryMusic);
	}

	update(dt) {
		timer.update(dt);

		// Scroll up
        if (this.scrollY > -this.totalHeight) {
            this.scrollY -= this.scrollSpeed * dt;
        }

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.TitleScreen],
			});
		}
	}

	render(context) {

		images.render(ImageName.VictoryScreen,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        images.render(ImageName.GameIcon,-2,2,32,32);

		// Draw credits
        context.save();
        context.fillStyle = "#FFFFFF";
        context.font = "8px HollowKnight";
        context.textAlign = "center";

        let y = this.scrollY;

        for (let line of this.credits) {
            if (line === "---") {
                // blank spacing line
                y += this.lineHeight;
                continue;
            }

            context.fillText(line, CANVAS_WIDTH / 2, y);
            y += this.lineHeight;
        }

        context.restore();
	}

	// Build the list of credit lines
    buildCredits() {
        return [
            "SongSilk Demo",
            "---",

            "Developer:",
            "Leon Mogilny",
            "---",

            "Artists:",
            "Leon Mogilny",
            "Team Cherry",
            "---",

            "SFX & Music:",
            "Leon Mogilny",
            "Christopher Larkin",
            "Viper Dragoon X",
            "pointypenny4744",
			"&",
			 "Sounds of Pharloom Repository",
            "---",

            "Game Director:",
            "Leon Mogilny",
            "---",

            "A Special Thanks To:",
            "Team Cherry - for inspiring this project",
            "Seth Goldman - may you fly high",
            "And You - thank you so much for playing!",
            "---",
            "---",
            "---",

            "Thank you for playing the SongSilk Demo.",
            "Press ENTER to return to the title screen.",
        ];
    }
}
