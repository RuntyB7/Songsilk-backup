import { getRandomPositiveInteger } from "./../../../lib/Random.js";
import BossStateName from "./../../enums/BossStateName.js";
import SoundName from "./../../enums/SoundName.js";
import { sounds } from "./../../globals.js";
import FirePillarCollider from "./../collidervariants/FirePillarCollider.js";
import FinalJuryState from "./FinalJuryState.js";

export default class FinalJuryFireSpinningstate extends FinalJuryState {
    constructor(boss) {
        super(boss);

        this.elapsedTime = 0;
        this.spinDuration = 5;

        // Each ring contains:
        // radius, growthRate, angleOffset, colliders[]
        this.rings = [];

        this.ringSpawnCooldown = 2.5;
        this.ringSpawnTimer = 0;

        this.angleStep = Math.PI / 15;  // density
        this.maxRingRadius = 500;
    }

    enter() {
        this.boss.currentAnimation = this.boss.finalJuryAnimations.spin;
        this.boss.currentAnimation.refresh();
        sounds.play(SoundName.FireSpin);
        this.elapsedTime = 0;
        this.rings = [];
        this.ringSpawnTimer = 0;
        this.chant();
    }

    exit() {
        sounds.stop(SoundName.FireSpin);
    }

    update(dt) {
        super.update(dt);
        this.boss.currentAnimation.update(dt);

        this.elapsedTime += dt;
        this.ringSpawnTimer += dt;

        if (this.elapsedTime < this.spinDuration) {

            if (this.ringSpawnTimer >= this.ringSpawnCooldown) {
                this.spawnNewRings();
                this.ringSpawnTimer = 0;
            }

            this.updateRings(dt);

        } else {
            sounds.stop(SoundName.FireSpin);
            this.boss.stateMachine.change(BossStateName.Idling);
        }
    }

    spawnNewRings() {
        const cx = this.boss.position.x + this.boss.dimensions.x / 2;
        const cy = this.boss.position.y + this.boss.dimensions.y / 2;

        const radii = [50, 150, 250, 350];

        for (let baseRadius of radii) {

            const ring = {
                radius: baseRadius,
                growthRate: 40 + Math.random() * 40,
                angleOffset: Math.random() * Math.PI * 2,
                colliders: []   // <- colliders stored here
            };

            for (let angle = 0; angle < Math.PI * 2; angle += this.angleStep) {

                const finalAngle = angle + ring.angleOffset;
                const x = cx + Math.cos(finalAngle) * ring.radius;
                const y = cy + Math.sin(finalAngle) * ring.radius;

                const collider = new FirePillarCollider(
                    x,
                    y,
                    15,
                    15,
                    5,
                    this.boss,
                    3,
                    20
                );

                ring.colliders.push({
                    collider,
                    angle: finalAngle
                });

                this.boss.map.damageColliders.push(collider);
            }
            sounds.play(SoundName.FirePillarSummon1);

            this.rings.push(ring);
        }
    }

    updateRings(dt) {
        const cx = this.boss.position.x + this.boss.dimensions.x / 2;
        const cy = this.boss.position.y + this.boss.dimensions.y / 2;

        this.rings.forEach(ring => {

            // Increase ring radius
            ring.radius += ring.growthRate * dt;

            // Update every collider's position
            for (const entry of ring.colliders) {

                const a = entry.angle;
                const c = entry.collider;

                c.position.x = cx + Math.cos(a) * ring.radius;
                c.position.y = cy + Math.sin(a) * ring.radius;
            }
        });

        // Remove rings that are too large
        this.rings = this.rings.filter(r => r.radius < this.maxRingRadius);
    }

    chant() {
        const chantId = getRandomPositiveInteger(3,4);
        switch(chantId) {
            case 3:
                sounds.play(SoundName.Chant3);
                break;
            case 4:
                sounds.play(SoundName.Chant4);
                break;
        }
    }
}
