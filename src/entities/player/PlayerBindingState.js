import PlayerStateName from "./../../enums/PlayerStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds } from "./../../globals.js";
import PlayerState from "./PlayerState.js";

export default class PlayerBindingState extends PlayerState {
    constructor(player) {
		super(player);
	}


    enter() {
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;

        this.player.currentAnimation = this.player.playerAnimations.bind;
        this.player.currentAnimation.refresh();
        sounds.play(SoundName.BindVoice);
        this.player.silkBindAnimation.refresh();
        sounds.play(SoundName.BindLoop);

    }

    update(dt) {
        // will not call super because we cannot update position or gravity by default

        this.player.currentAnimation.update(dt);
        this.player.silkBindAnimation.update(dt);
        this.handleDecision();
    }

    handleDecision() {
		if(this.player.silkBindAnimation.isDone()) {
            this.player.Heal();
            sounds.stop(SoundName.BindLoop);
            sounds.play(SoundName.BindEnd);
            this.player.stateMachine.change(PlayerStateName.Falling);
        }
	}

    render(context) {
        super.render(context);

        const frame = this.player.silkBindAnimation.getCurrentFrame();

        // Position where the PLAYER is rendered
        const px = Math.floor(this.player.position.x - this.player.renderOffset.x);
        const py = Math.floor(this.player.position.y - this.player.renderOffset.y);

        // Silk animation real frame size
        const fw = frame.width;
        const fh = frame.height;

        // --- SCALE SETUP ---
        // player is around ~60px tall, silk sprite is 155px tall
        // Best scale = player.height / 155
        const scale = this.player.dimensions.y / 155;

        const renderWidth = fw * scale;
        const renderHeight = fh * scale;

        // Center the silk animation around the player
        const offsetX = (this.player.dimensions.x - renderWidth) / 2 + 10;
        const offsetY = (this.player.dimensions.y - renderHeight) / 2;

        context.save();

        context.translate(px+offsetX,py+offsetY);
        context.scale(scale,scale);

        frame.render(0,0)

        context.restore();
    }
}