import Input from "./../../lib/Input.js";
import State from "./../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import MusicName from "../enums/MusicName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, input, sounds, stateMachine, timer } from "../globals.js";
import { FirstTime } from "../services/FirstTime.js";
import { Stats } from "../services/Stats.js";

export default class TitleScreenState extends State {

	static TITLECARD_WIDTH = 1606;
	static TITLECARD_HEIGHT = 561;

	constructor() {
		super();
	}

	enter() {
		sounds.play(MusicName.HallowedStepsOverworld);
	}

	exit() {
		sounds.stop(MusicName.HallowedStepsOverworld);
	}

	update(dt) {
		timer.update(dt);

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			if(FirstTime.isFirstTime()) {
				stateMachine.change(GameStateName.Instruction);
			} else {
				stateMachine.change(GameStateName.Transition, {
					fromState: this,
					toState: stateMachine.states[GameStateName.Play],
				});
			}
		}
	}

	render(context) {
		images.render(ImageName.TitleScreen,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		images.render(ImageName.GameIcon,-2,2,32,32);

		images.render(ImageName.TitleCard,0,20,CANVAS_WIDTH-5,100);

		const stats = Stats.load();

		context.save();
		context.fillStyle = "#FFF";
		context.font = "10px HollowKnight";

		context.fillText(`Victories: ${stats.victories}`,CANVAS_WIDTH - 80, CANVAS_HEIGHT - 40);
		context.fillText(`Deaths: ${stats.deaths}`,CANVAS_WIDTH - 80, CANVAS_HEIGHT - 25);

		context.restore();
	}
}
