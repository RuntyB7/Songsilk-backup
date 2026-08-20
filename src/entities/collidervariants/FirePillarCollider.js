import Particle from "./../../../lib/Particle.js";
import DamageCollider from "./DamageCollider.js";
import { getRandomNumber, getRandomPositiveInteger } from "./../../../lib/Random.js";
import Vector from "./../../../lib/Vector.js";
import { debugOptions } from "./../../globals.js";


export default class FirePillarCollider extends DamageCollider {
    constructor(x,y, width, height, lifetime = 0.1, source = null, particleCount = 3, particleLifetime = 1500) {
        super(x,y,width, height, null, lifetime, source);
        this.fireParticles = [];
        this.fire = new Vector(
            getRandomNumber(-40, 40),
            -120 - Math.random() * 80
        );

        // will be used to show the player where the attack will be 
        // gray particles spawning before the orange fire particles
        this.warningTime = this.lifetime * 0.2;
        this.isWarning = true;

        // the amount of particles to be generated per frame
        this.particleCount = particleCount;
        this.particleLifetime = particleLifetime;
    }
    

    update(dt) {
        super.update(dt);

        // this.isWarning = (this.age < this.warningTime);
        
        for (let i = 0; i < this.particleCount; i++) {
            const spawnX = this.position.x + getRandomPositiveInteger(0, this.dimensions.x);
            const spawnY = this.position.y + getRandomPositiveInteger(0, this.dimensions.y);

            this.fireParticles.push(new Particle(spawnX, spawnY, this.particleLifetime));
        }
        
        this.fireParticles.forEach(particle => {
            particle.applyForce(this.fire, dt);
            particle.update(dt);
        });
        this.fireParticles = this.fireParticles.filter(p => p.isAlive);
    }


    render(context) {
        const color = "#d05019ff";
        this.fireParticles.forEach(particle => {
            particle.render(context, color);
        });
        if (debugOptions.bossCollision && this.source?.isBoss) {
            this.renderDebug(context);
        }
    }
}