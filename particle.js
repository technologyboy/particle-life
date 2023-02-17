class Particle {
    constructor(position, color) {
        this.pos = (position) ? position : createVector(random(width), random(height));
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.maxForce = 0.6

        this.color = color
        this.fill = colors[color]
    }

    applyForce(force) {
        this.acc.add(force);
    };

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        //this.bounce() 
        //or 
        this.edges()
    };

    checkNeighbour(n) {
        if (this === n) { return createVector(0, 0) }//dont check if this is its self

        let p1 = this.pos
        let p2 = n.pos
        let d = dist(p1.x, p1.y, p2.x, p2.y)
        let a = attractionMatrix[this.color][n.color]

        if (d <= particleSightMax && d >= particleSightMin * 2) {//is this particle in range
            if (debug_attraction) { stroke(255, 5); strokeWeight(2); line(p1.x, p1.y, p2.x, p2.y) }
            let m = midPoint(p1, p2)
            if (a < 0) {
                if (debug_attraction) { stroke(255, 0, 0, 25); line(p1.x, p1.y, m.x, m.y) }
                return this.flee(p2)
            } else if (a > 0) {
                if (debug_attraction) { stroke(0, 0, 255, 25); line(p1.x, p1.y, m.x, m.y) }
                if (d > particleDiameter * 2) {
                    return this.seek(p2)
                }
            }
        }
    }

    render() {
        push()
        translate(this.pos.x, this.pos.y)
        noStroke()

        if (debug_vision) {//radar
            fill(255, 10)
            ellipse(0, 0, particleSightMax / 2)
            fill(0, 100)
            ellipse(0, 0, particleSightMin)
        }

        if (debug_velocities) {
            push()
            //render a line toward the current velocity
            let p2 = this.vel.copy()
            p2.mult(particleDiameter)
            p2.limit(particleDiameter)
            strokeWeight(particleDiameter / 1.5)
            stroke(this.fill)
            line(0, 0, p2.x, p2.y)
            pop()
        }

        //Particle body
        fill(this.fill)
        noStroke()
        ellipse(0, 0, particleDiameter)

        pop()
    }

    drawText(x, y, px, py) {
        let r = 2
        x = Math.round((x + Number.EPSILON) * 100) / 100
        y = Math.round((y + Number.EPSILON) * 100) / 100


        text(x + ' : ' + y, px, py)
    }


    edges() {
        //wrap the particle across the screen
        if (this.pos.x < -particleDiameter) { this.pos.x = width + particleDiameter }
        if (this.pos.x > width + particleDiameter) { this.pos.x = -particleDiameter }
        if (this.pos.y < -particleDiameter) { this.pos.y = height + particleDiameter }
        if (this.pos.y > height + particleDiameter) { this.pos.y = -particleDiameter }
    }

    bounce() {
        //wrap the particle across the screen
        if (this.pos.x - particleDiameter < 0 || this.pos.x + particleDiameter > width) { this.vel.x = this.vel.x * -1 }
        if (this.pos.y - particleDiameter < 0 || this.pos.y + particleDiameter > height) { this.vel.y = this.vel.y * -1 }

    }






    flee(target) {
        const desiredVelocity = { x: this.pos.x - target.x, y: this.pos.y - target.y };
        const distance = Math.sqrt(desiredVelocity.x ** 2 + desiredVelocity.y ** 2);

        if (distance < particleDiameter) {
            // If we're very close to the target, just move away as fast as possible
            desiredVelocity.x = -this.maxSpeed;
            desiredVelocity.y = -this.maxSpeed;
        } else {
            // Normalize the desired velocity to have a magnitude of 1, then scale it by the maximum speed
            const scaleFactor = this.maxSpeed / distance;
            desiredVelocity.x *= scaleFactor;
            desiredVelocity.y *= scaleFactor;
        }

        // Calculate the steering vector by subtracting the current velocity from the desired velocity
        const steeringVector = createVector(desiredVelocity.x - this.vel.x, desiredVelocity.y - this.vel.y);

        // Return the steering vector
        // steeringVector.limit(this.maxSpeed)
        steeringVector.limit(this.maxForce)
        return steeringVector;
    }


    seek(target) {
        const desiredVelocity = { x: target.x - this.pos.x, y: target.y - this.pos.y };
        const distance = Math.sqrt(desiredVelocity.x ** 2 + desiredVelocity.y ** 2);

        // Normalize the desired velocity to have a magnitude of 1, then scale it by the maximum speed
        const scaleFactor = this.maxSpeed / distance;
        desiredVelocity.x *= scaleFactor;
        desiredVelocity.y *= scaleFactor;

        // Calculate the steering vector by subtracting the current velocity from the desired velocity
        const steeringVector = createVector(desiredVelocity.x - this.vel.x, desiredVelocity.y - this.vel.y);


        // Return the steering vector
        // steeringVector.limit(this.maxSpeed)
        steeringVector.limit(this.maxForce)

        return steeringVector;
    }




    wander(wanderRadius, wanderDistance, wanderJitter) {
        let currentPosition = this.pos
        let currentVelocity = this.vel
        let maxSpeed = this.maxSpeed

        // Create a random vector to apply jitter to the wander target
        const randomVector = {
            x: Math.random() * 2 - 1, // generates a random value between -1 and 1
            y: Math.random() * 2 - 1
        };

        // Normalize the random vector and multiply by jitter to get the displacement of the wander target
        const wanderTargetDisplacement = {
            x: randomVector.x * wanderJitter,
            y: randomVector.y * wanderJitter
        };

        // Add the displacement to the current velocity to get the wander target
        const wanderTarget = {
            x: currentPosition.x + currentVelocity.x * wanderDistance + wanderTargetDisplacement.x,
            y: currentPosition.y + currentVelocity.y * wanderDistance + wanderTargetDisplacement.y
        };

        // Limit the wander target to the specified radius
        const wanderTargetDistance = Math.sqrt(
            (wanderTarget.x - currentPosition.x) ** 2 + (wanderTarget.y - currentPosition.y) ** 2
        );
        const wanderTargetNormalized = {
            x: (wanderTarget.x - currentPosition.x) / wanderTargetDistance,
            y: (wanderTarget.y - currentPosition.y) / wanderTargetDistance
        };
        const clampedRadius = Math.min(wanderRadius, wanderTargetDistance);
        const limitedWanderTarget = {
            x: currentPosition.x + wanderTargetNormalized.x * clampedRadius,
            y: currentPosition.y + wanderTargetNormalized.y * clampedRadius
        };

        // Calculate a desired velocity towards the wander target
        const desiredVelocity = {
            x: limitedWanderTarget.x - currentPosition.x,
            y: limitedWanderTarget.y - currentPosition.y
        };

        // Limit the desired velocity to the maximum speed
        const desiredVelocityMagnitude = Math.sqrt(desiredVelocity.x ** 2 + desiredVelocity.y ** 2);
        const limitedDesiredVelocityMagnitude = Math.min(desiredVelocityMagnitude, maxSpeed);
        const limitedDesiredVelocity = {
            x: desiredVelocity.x / desiredVelocityMagnitude * limitedDesiredVelocityMagnitude,
            y: desiredVelocity.y / desiredVelocityMagnitude * limitedDesiredVelocityMagnitude
        };

        // Apply steering force to the current velocity
        const steeringForce = {
            x: limitedDesiredVelocity.x - currentVelocity.x,
            y: limitedDesiredVelocity.y - currentVelocity.y
        };
        currentVelocity.x += steeringForce.x;
        currentVelocity.y += steeringForce.y;

        let force = createVector(steeringForce.x, steeringForce.y)
        force.limit(this.maxForce)
        return force

    }


}
