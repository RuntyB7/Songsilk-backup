import { loadPlayerSprites, playerSpriteConfig, silkAnimConfig } from "./../../../config/SpriteConfig.js";
import Vector from "./../../../lib/Vector.js";
import Animation from './../../../lib/Animation.js';
import ImageName from "./../../enums/ImageName.js";
import Entity from "./../Entity.js";
import { debugOptions, images, sounds, timer } from './../../globals.js';
import StateMachine from "./../../../lib/StateMachine.js";
import PlayerStateName from "./../../enums/PlayerStateName.js";
import PlayerIdlingState from "./PlayerIdlingState.js";
import PlayerRunningState from "./PlayerRunningState.js";
import PlayerJumpingState from "./PlayerJumpingState.js";
import PlayerFallingState from "./PlayerFallingState.js";
import PlayerSlashingState from "./PlayerSlashingState.js";
import PlayerDownSlashingState from "./PlayerDownSlashingState.js";
import { oneInXChance } from "./../../../lib/Random.js";
import { PlayerConfig } from "./../../../config/PlayerConfig.js";
import { getKnockbackDirection } from "./../../../lib/Collision.js";
import PlayerBindingState from "./PlayerBindingState.js";
import SoundName from "./../../enums/SoundName.js";
import PlayerDyingState from "./PlayerDyingState.js";

export default class Player extends Entity {
    constructor(x, y, width, height, map, boss) {
        super(x, y, width, height);
        this.initialPosition = new Vector(x, y);
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.renderOffset = {
            x: 10,
            y: 8,
        }
        this.velocity = new Vector(0, 0);
        this.map = map;
        this.boss = boss;
        this.facingRight = true;
        if(debugOptions.easyMode) {
            this.totalHealth = 12;
        } else {
            this.totalHealth = 5;
        }
        this.health = this.totalHealth;
        // grace flag for when the player gets hit while big to void double tap
		this.isGraced = false;
        // player visibility for flashing implementation
		this.isVisible = true;

        this.isDead = false;
        this.isDying = false;

        this.playerSprites = loadPlayerSprites(
            images.get(ImageName.HornetFull),
            playerSpriteConfig
        );

        this.playerAnimations = {
            idle: new Animation(this.playerSprites.idle),
            run: new Animation(this.playerSprites.run, 0.1),
            jump: new Animation(this.playerSprites.jump),
            fall: new Animation(this.playerSprites.fall),
            slash: new Animation(this.playerSprites.slash, 0.1, 1),
            down: new Animation(this.playerSprites.downslash, 0.1, 1),
            bind: new Animation(this.playerSprites.bind),
            death: new Animation(this.playerSprites.death),
        };
        this.slashEffects = {
            baseL: this.playerSprites.slasheffectL,
            baseR: this.playerSprites.slasheffectR,
            downL: this.playerSprites.downeffectL,
            downR: this.playerSprites.downeffectR
        }
        if(debugOptions.easyMode) {
            this.damageValue = 50;
        } else {
            this.damageValue = 9;
        }

        this.bindEffectSprites = loadPlayerSprites(images.get(ImageName.BindsSilkAnim), silkAnimConfig);

        this.silkBindAnimation = new Animation(
            this.bindEffectSprites.animation,
            0.05,
            1
        );

        this.currentAnimation = this.playerAnimations.idle;

        this.activeHitboxes = [];

        this.stateMachine = new StateMachine();

        this.stateMachine.add(
            PlayerStateName.Dying,
            new PlayerDyingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Binding,
            new PlayerBindingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Slashing,
            new PlayerSlashingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Downslashing,
            new PlayerDownSlashingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Running,
            new PlayerRunningState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Jumping,
            new PlayerJumpingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Falling,
            new PlayerFallingState(this)
        );
        this.stateMachine.add(
            PlayerStateName.Idling,
            new PlayerIdlingState(this)
        );
    }

    /**
     * Updates the player's state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        if (this.isDying || this.isDead) return
        this.checkBossCollison();
        this.checkDamageColliderCollisions();
        this.stateMachine.update(dt);

    }

    checkBossCollison() {
        if(this.collidesWith(this.boss) && !this.isGraced) {
            this.getHurt();
            this.damageKnockBack(getKnockbackDirection(this.boss, this));
        }
    }
    checkDamageColliderCollisions() {
        this.map.damageColliders.forEach(collider => {
            collider.checkHit(this);
        })
    }

    getHurt(source) {
        this.isGraced = true;
        this.health -= 2;
        this.grunt();
        timer.addTask(
            () => {this.isVisible = !this.isVisible},
            0.1,
            1.5,
            () => {
                this.isGraced = false;
                this.isVisible = true;
            }
        )

        if (this.health <= 0) {
            this.stateMachine.change(PlayerStateName.Dying);
        }
    }

    grunt() {
        if(this.health < 2){
            sounds.play(SoundName.WeakVoice);
        } else if(oneInXChance(2)) {
            sounds.play(SoundName.GruntHurtUgh);
        } else {
            sounds.play(SoundName.GruntHurtHah);
        }
    }

    pogoBounce() {
        this.velocity.y = PlayerConfig.bounceVelocity
        sounds.play(SoundName.HaHaVoice);
        this.isOnGround = false;
    }

    damageKnockBack(direction) {
        if(direction == 0){
            if(oneInXChance(2)) {
                direction = -1
            } else {
                direction = 1;
            }
        }
        this.velocity.y = PlayerConfig.bounceVelocity;
        this.velocity.x = 150 * direction;
    }

    Heal() {
        this.health = Math.min(this.health + 3, this.totalHealth);
    }

    /**
     * Renders the player.
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context) {
        if (this.isVisible){
            this.activeHitboxes.forEach(hitbox => {
                hitbox.render(context);
            });
            this.stateMachine.render(context);
        }

    }

    die() {
        this.isDead = true;
    }

    reset() {
        this.position.x = this.initialPosition.x;
        this.position.y = this.initialPosition.y;
        this.facingRight = true;

        this.health = this.totalHealth;

        this.isDead = false;
        this.isDying = false;
        this.isGraced = false;
        this.isVisible = true;

        this.stateMachine.change(PlayerStateName.Idling);
    }
}