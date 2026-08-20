import GameStateName from "./enums/GameStateName.js";
import Game from "./../lib/Game.js";
import {
    canvas,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    context,stateMachine
} from './globals.js'
import PlayState from "./states/PlayState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import TransitionState from "./states/TransitionState.js";
import VictoryState from "./states/VictoryState.js";
import InstructionScreenState from "./states/InstructionScreenState.js";

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1');

document.body.prepend(canvas);

// mapDefinitions initialized here:
const mapDefinition = await fetch('./config/tilemap.json').then((response) =>
    response.json()
);
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Transition, new TransitionState());
stateMachine.add(GameStateName.Play, new PlayState(mapDefinition));
stateMachine.add(GameStateName.Instruction, new InstructionScreenState());
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());

stateMachine.change(GameStateName.TitleScreen);

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

canvas.focus();