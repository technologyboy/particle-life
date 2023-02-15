class Particle {
    constructor(position, color) {
        this.pos = (position) ? position : createVector(random(width), random(height));
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0);
        this.maxSpeed = 0.5;
        this.maxForce = 0.5

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
        this.acc.set(0, 0)
        // this.edges()
        // this.wander(10,1000,100)
        this.bounce()
    };

    checkNeighbour(n) {
        let p1 = this.pos
        let p2 = n.pos
        // //check if this particle is going to make an affect on this particles velocity
        let d = dist(this.pos.x, this.pos.y, n.pos.x, n.pos.y)
        let m = 0 //multiplyer
        let a = attractionMatrix[this.color][n.color]
        // noStroke()
        // fill(255)
        // textSize(15)
        // textAlign(CENTER, CENTER)
        if (d <= particleSightMax) {

            stroke(255, 50)
            strokeWeight(2)
            line(p1.x, p1.y, p2.x, p2.y)
            let m = midPoint(p1, p2)
            let d = floor(dist(p1.x,p1.y, p2.x, p2.y))
            noStroke()
            fill(255,175)
            text(d, m.x, m.y)



            if (a > 0) {
                return this.fleeOrSeek(n.pos)
                // text('S' + a, this.pos.x, this.pos.y)
            } else if (a < 0) {
                return this.fleeOrSeek(n.pos, true)
                // text('F' + a, this.pos.x, this.pos.y)
            }

        } else {
            return createVector(-1, 0)
        }
        return createVector(0, 0)

        // if (d <= particleSightMin) {
        //     m = map(d, 0, particleSightMin, -1, 0) //set magitude -1 to 0 based on how close from min range the particle is 
        //     this.fleeOrSeek(n.pos)
        //     // this.seek(n.pos, m)
        // } else if (d <= particleSightMax / 2) {
        //     m = map(d, particleSightMin, particleSightMax / 2, 0, a) //set mag 0 to matrix mag based on distance between 
        //     this.fleeOrSeek(n.pos)
        //     // this.seek(n.pos, m)
        // } else if (d <= particleSightMax) {
        //     m = map(d, particleSightMax / 2, particleSightMax, a, 0)
        //     this.fleeOrSeek(n.pos)
        //     // this.seek(n.pos, m)
        // } else {
        //     this.vel = createVector(0, 0)
        //     this.acc = createVector(0, 0)
        // }
    }

    // seek(t, mag) {
    //     var desired = p5.Vector.sub(t, this.pos);
    //     desired.setMag(this.maxSpeed);
    //     var steering = p5.Vector.sub(desired, this.vel);
    //     steering.limit(this.maxForce);
    //     steering.mult(mag)
    //     this.applyForce(steering);
    // }



    render() {
        push()
        translate(this.pos.x, this.pos.y)
        noStroke()

        //DEBUG

        //vector arrow.
        // noFill()
        // strokeWeight(1)
        // stroke(200)

        // let p1 = this.vel.copy()
        // p1.setMag((particleDiameter / 3) + 10)
        // let p2 = this.vel.copy()
        // p2.setMag((particleDiameter / 2) + 2)
        // line(p1.x, p1.y, p2.x, p2.y)


        //radar
        fill(255,10)
        noStroke()
        ellipse(0, 0, particleSightMax)

        fill(0,100)
        noStroke()
        ellipse(0, 0, particleSightMin)


        //Particle body
        noStroke()
        fill(this.fill)
        ellipse(0, 0, particleDiameter)

                pop()

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



    fleeOrSeek(targetPoint, flee = false) {
        let currentPosition = this.pos
        let currentVelocity = this.vel
        let maxVelocity = this.maxSpeed
        let distanceThreshold = particleSightMax

        // Calculate distance between current position and target point
        const distanceToTarget = Math.sqrt(
            (targetPoint.x - currentPosition.x) ** 2 + (targetPoint.y - currentPosition.y) ** 2
        );

        // text(round(distanceToTarget,1), this.pos.x, this.pos.y)


        const steeringForce = { x: 0, y: 0 };

        // If distance is greater than threshold, apply seek behavior
        if (distanceToTarget > distanceThreshold) {
            if (!flee) {
                const desiredVelocity = {
                    x: (targetPoint.x - currentPosition.x) / distanceToTarget * maxVelocity,
                    y: (targetPoint.y - currentPosition.y) / distanceToTarget * maxVelocity
                };

                steeringForce.x = desiredVelocity.x - currentVelocity.x
                steeringForce.y = desiredVelocity.y - currentVelocity.y
            } else {
                // Apply flee behavior if distance is less than or equal to threshold
                const desiredVelocity = {
                    x: (currentPosition.x - targetPoint.x) / distanceToTarget * maxVelocity,
                    y: (currentPosition.y - targetPoint.y) / distanceToTarget * maxVelocity
                };

                steeringForce.x = desiredVelocity.x - currentVelocity.x
                steeringForce.y = desiredVelocity.y - currentVelocity.y
            }
        }

        let force = createVector(steeringForce.x, steeringForce.y)
        return force;
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

        this.applyForce(force)
    }


}
