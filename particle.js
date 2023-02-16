class Particle {
    constructor(position, color) {
        this.pos = (position) ? position : createVector(random(width), random(height));
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0);
        this.maxSpeed = 1;
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

        this.bounce() //or this.edges()
    };

    checkNeighbour(n) {
        if(this === n){return createVector(0, 0)}//dont check if this is its self


        noStroke()
        fill(255)
        textSize(16)
        textAlign(CENTER, CENTER)


        let p1 = this.pos
        let p2 = n.pos
        let d = dist(p1.x, p1.y, p2.x, p2.y)
        let a = attractionMatrix[this.color][n.color]




        if (d <= particleSightMax / 2) {//is this particle in range
            stroke(255, 50)
            strokeWeight(2)
            line(p1.x, p1.y, p2.x, p2.y)


            stroke(0)
            strokeWeight(2)
            fill(255)
            //text displays
            let m = midPoint(p1, p2)
            // text(floor(d), m.x, m.y)

        
            let mm = distAlongLine(p1, p2, 0.2)
            
            let offset = 12
            
            push()
            fill(this.fill)
            stroke(0)
            var angle = atan2(p1.y - p2.y, p1.x - p2.x); //gets the angle of the line
            translate(mm.x, mm.y); //translates to the destination vertex
            rotate(angle - HALF_PI); //rotates the arrow point
            // if(a>0)rotate(HALF_PI);
            // if(a<0)rotate(-HALF_PI);
            triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); //draws the arrow point as a triangle
            pop();



            // draw_arrow(p1,mm,10,this.fill)
            if (a > 0) {
                // text('S', mm.x, mm.y)
                return this.fleeOrSeek(n.pos)
            } else if (a < 0) {
                // text('F', mm.x, mm.y)
                return this.fleeOrSeek(n.pos, true)
            } else {
                // text('W', p1.x, p1.y)
                return this.wander()
            }

        }
        return createVector(0, 0)
    }

    render() {
        push()
        translate(this.pos.x, this.pos.y)
        noStroke()

        // //radar
        // fill(255, 10)
        // ellipse(0, 0, particleSightMax)

        // fill(0, 100)
        // ellipse(0, 0, particleSightMin)

        //Particle body
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
        return force

    }


}
