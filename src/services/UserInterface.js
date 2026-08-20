import { HealthbarMaskConfig, loadUISprites, UIspriteConfig } from "./../../config/SpriteConfig.js";
import Animation from "./../../lib/Animation.js";
import Easing from "./../../lib/Easing.js";
import ImageName from "./../enums/ImageName.js";
import { images, timer } from "./../globals.js";

export default class UserInterface {

    constructor(player) {
        this.player = player;

        this.Mask = loadUISprites(
            images.get(ImageName.FullMask),
            HealthbarMaskConfig
        );

        this.maskSprite = this.Mask.mask[0];
        this.maskOutline = this.Mask.maskoutline[0];
        this.maskBreakSprites = this.Mask.breakanimation;

        this.masks = [];
        for (let i = 0; i < player.totalHealth; i++) {
            this.masks.push({
                scale: 0,
                fillMask: this.maskSprite,
                emptyMask: this.maskOutline,
                breakAnim: null,
                isShattering: false,
                isEmpty: false,
            });
        }
        this.isInitialized = false;
        // Play intro stagger animation
        this.animateInitialMasks();

        this.UISprites = loadUISprites(
            images.get(ImageName.Healthbar),
            UIspriteConfig
        );

        this.initialAnimation = new Animation(
            this.UISprites.healthbarspawn,
            0.12,
            1
        );

        this.hasPlayedIntro = false;
    }

    update(dt) {
        if (!this.hasPlayedIntro) {
            this.initialAnimation.update(dt);
            if (this.initialAnimation.isDone()) {
                this.hasPlayedIntro = true;
            }
            return;
        }

        for (let mask of this.masks) {
            if(mask.breakAnim) mask.breakAnim.update(dt);
        }
        this.syncMasksToPlayerHealth();
    }

    async animateInitialMasks() {
        const stagger = 0.08;
        const growDuration = 0.25;

        for (let i = 0; i < this.masks.length; i++) {
            await timer.wait(stagger);

            let mask = this.masks[i];

            // Mask grows from scale 0 → 1
            await timer.tweenAsync(mask, { scale: 1 }, growDuration, Easing.outBack);
        }

        this.isInitialized = true;
    }

    syncMasksToPlayerHealth() {
    const hp = this.player.health;

    for (let i = 0; i < this.masks.length; i++) {
        const mask = this.masks[i];

        // -----------------------------------------
        // HEAL — Segment should be FULL again
        // -----------------------------------------
        if (i < hp) {

            // Reset empty/shattered state so it can break again later
            if (mask.isEmpty) {
                mask.isEmpty = false;
                mask.isShattering = false;
                mask.breakAnim = null;
            }

            // Tween in if not full
            if (mask.scale !== 1) {
                timer.tween(mask, { scale: 1 }, 0.2, Easing.outBack);
            }

            continue;
        }

        // -----------------------------------------
        // DAMAGE — segment should break
        // -----------------------------------------
        if (i >= hp && mask.scale !== 0) {

            // If already empty, skip shatter animation
            if (mask.isEmpty) {
                mask.scale = 0;
                continue;
            }

            // Trigger shatter only once
            if (!mask.isShattering) {
                mask.isShattering = true;
                mask.breakAnim = new Animation(
                    this.maskBreakSprites,
                    0.08,
                    1,
                    () => {
                        mask.breakAnim = null;
                        mask.isShattering = false;
                        mask.isEmpty = true;  // now it's officially empty
                    }
                );
            }

            timer.tween(mask, { scale: 0 }, 0.15, Easing.inBack);
        }
    }
}

    render(context) {
        context.save();

        

        const scale = 0.2;
        const x = 0;
        const y = 0;
        context.scale(scale,scale);
        if (!this.hasPlayedIntro) {
            this.renderInitialAnimation(x, y);
        } else {
            this.renderStatic(context, x, y);
        }

        context.restore();
    }

    renderInitialAnimation(x, y) {
        this.initialAnimation.getCurrentFrame().render(x, y);
    }

    renderStatic(context, x, y) {

        // Draw static bar background
        this.UISprites.healthbarspawn[5].render(x, y);

        // Draw mask segments
        const offsetX = 100; // distance per mask
        const UIOffsetX = 150; // x offset for full healthbar
        const UIOffsetY = -40; // y offset for full healthbar

        const scale = 0.7;
        context.scale(scale,scale);

        for (let i = 0; i < this.masks.length; i++) {
            const mask = this.masks[i];
            const mx = x + i * offsetX;

            // Draw outline first (always)
            mask.emptyMask.render(mx + UIOffsetX, y + UIOffsetY);


            // Draw shatter animation over mask
            if (mask.breakAnim && !mask.isEmpty) {
                if(mask.breakAnim.isDone()) {
                    mask.breakAnim = null;
                    mask.isShattering = false;
                    mask.isEmpty = true;
                } else {
                    mask.breakAnim.getCurrentFrame().render(mx + UIOffsetX, y + UIOffsetY);
                    continue;
                }
            } 
            // Draw filled mask (scaled)
            if (mask.scale > 0) {
                context.save();
                context.translate(mx + this.maskSprite.width / 2 + UIOffsetX, y + this.maskSprite.height / 2 + UIOffsetY);
                context.scale(mask.scale, mask.scale);
                context.translate(-this.maskSprite.width / 2, -this.maskSprite.height / 2);
                mask.fillMask.render(0, 0);
                context.restore();
            }

            
        }
    }
}