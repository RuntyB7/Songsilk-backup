import Input from "./../../lib/Input.js";
import State from "./../../lib/State.js";
import GameStateName from "./../enums/GameStateName.js";
import ImageName from "./../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, input, stateMachine, timer } from "./../globals.js";
import { FirstTime } from "./../services/FirstTime.js";

export default class InstructionScreenState extends State {
    constructor() {
        super();
    }

    enter() {

    }

    exit() {

    }

    update(dt) {
        timer.update(dt);

        if (input.isKeyPressed(Input.KEYS.ENTER)) {

            FirstTime.markAsPlayed();

			stateMachine.change(GameStateName.Transition, {
				fromState: this,
				toState: stateMachine.states[GameStateName.Play],
			});
		}
    }

    render(context) {
        images.render(ImageName.TitleScreen,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        images.render(ImageName.GameIcon,-2,2,32,32);

        // 'A' and 'D' for left and right movement
        // 'Spacebar' to jump
        // 'Q' to bind
        // 'L' to slash
        // Holding the 'S' key while in the air and pressing 'L' will perform a down slash

        // This game is meant to be difficult
        // Good luck and have fun

        context.save();
        context.fillStyle = "#FFF";
        context.textAlign - "center";
        context.font = "8px HollowKnight";

        const x = CANVAS_WIDTH/2 - 60
        let y = 20;

        context.fillText("Instructions", x, y);

        y += 20;

        context.fillText("A / D    — Move Left / Right", x, y);  y += 12;
        context.fillText("SPACE    — Jump", x, y);               y += 12;
        context.fillText("L        — Attack / Slash", x, y);     y += 12;
        context.fillText("Q        — Bind (Heal)", x, y);        y += 12;
        context.fillText("S + L    — Downward Slash", x, y);     y += 30;

        
        context.fillText("This game is meant to be difficult.", x, y); y += 16;
        context.fillText("Good luck, and have fun!", x, y);            y += 20;
        context.font = "12px HollowKnight";
        context.fillText("Press ENTER to begin!", x, y);

        context.restore();
    }
}