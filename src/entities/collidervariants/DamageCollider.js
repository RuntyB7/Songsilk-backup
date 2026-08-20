import { didCollide, getKnockbackDirection } from "./../../../lib/Collision.js";
import { debugOptions, timer } from "./../../globals.js";
import Entity from "./../Entity.js";
import Player from "./../player/Player.js";

export default class DamageCollider extends Entity {
    constructor(x, y, width, height, sprite = null, lifetime = 0.1, source = null, type = "horizontal") {
        super(x,y,width,height);
        this.sprite = sprite;
        this.lifetime = lifetime;
        this.age = 0;
        this.isActive = true;
        this.source = source;
        this.type = type;
    }

    update(dt) {
        this.age += dt;
        if (this.age >= this.lifetime) {
            this.isActive = false;
        }
    }

    checkHit(target) {
        if (target instanceof Player && this.source?.isBoss) {
            if(didCollide(this, target) && !target.isGraced) {
                target.getHurt();
                target.damageKnockBack(getKnockbackDirection(this, target));
            }
        }
        if (target?.isBoss && this.source instanceof Player) {
            // check if player slash hit the boss
            if(didCollide(this, target) && !target.isGraced) {
                target.getHurt();

                // Apply vertical knockback on the player if downslash was performed
                // offers a grace period to make it easier to
                
                if (this.type === "down") {
                    this.isGraced = true;
                    this.source.pogoBounce();
                    timer.addTask(
                    () => {},
                    0.1,
                    0.2,
                    () => {
                        this.isGraced = false;
                    }
                )
                    
                }
            }
        }
    }

    render(context) {
        if (this.sprite) {
            this.sprite.render(this.position.x, this.position.y);
            // If debug mode is enabled, render additional debug information
            if (debugOptions.playerCollision && this.source instanceof Player) {
                this.renderDebug(context);
            }
            if (debugOptions.bossCollision && this.source?.isBoss) {
                this.renderDebug(context);
            }
        }
    }

    /**
     * Renders debug information for the player and surrounding tiles.
     * This method visualizes the player's bounding box and nearby tiles,
     * highlighting potential collision areas.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    renderDebug(context) {

        // Render a blue outline around the player's bounding box
        context.strokeStyle = 'red';
        context.strokeRect(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );
    }
}