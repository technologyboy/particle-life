class Mover {
    constructor(position, radius, orientation, screenWrap = true) {
        this.screeWrap = screenWrap
        this.r = radius

        this.mass = 0
        this.pos = (position) ? position : createVector(random(width), random(height));
        this.vel = p5.Vector.fromAngle(this.orientation, 100)
        this.max_force = 10
        this.max_speed = 100
        this.facing = orientation //angle of facing

        this.lastAppliedForce = null
    }

    allStop() {
        this.vel = createVector(0, 0)
    }

    applyforce(direction, strength) {
        let acc = p5.Vector.fromAngle(direction, strength)
        this.lastAppliedForce = acc
        if(this.vel){
            this.vel.add(acc)
        }else{
            this.vel = acc.copy()
        }
        this.vel.limit(this.max_speed)
    }

    debugRender() {
        if (this.lastAppliedForce) {
            let l = this.lastAppliedForce.copy()
            l.mult(10)
            //drawing the last applied force
            push()
            stroke('blue')
            strokeWeight(3)
            translate(this.pos.x, this.pos.y)
            line(0, 0, l.x, l.y)
            pop()


        }

        //velocity
        push()
        stroke('green')
        strokeWeight(3)
        let v = this.vel.copy()
        v.mult(10)
        translate(this.pos.x, this.pos.y)
        line(0, 0, v.x, v.y)
        pop()

        //facing
        push()
        stroke('blue')
        strokeWeight(3)
        v = p5.Vector.fromAngle(this.facing, 10)
        v.mult(10)
        translate(this.pos.x, this.pos.y)
        line(0, 0, v.x, v.y)
        pop()
    }


    update() {
        this.pos.add(this.vel)
        this.edges()

        // this.debugRender()
    }

    edges() {
        //if this object is to wrap around from side to side of the screen
        if (this.screeWrap) {
            if (this.pos.x < -this.r) { this.pos.x = width + this.r }
            if (this.pos.x > width + this.r) { this.pos.x = -this.r }
            if (this.pos.y < -this.r) { this.pos.y = height + this.r }
            if (this.pos.y > height + this.r) { this.pos.y = -this.r }
        }
    }


    bounce(other) {
        let A = this
        let B = other

        let xDist = A.pos.x - B.pos.x;
        let yDist = A.pos.y - B.pos.y;
        let distSquared = xDist * xDist + yDist * yDist;

        //checks the squared distance for collision
        // if (distSquared <= (A.ballSize / 2 + B.ballSize / 2) * (A.ballSize / 2 + B.ballSize / 2)) {
        let xVelocity = B.vel.x - A.vel.x;
        let yVelocity = B.vel.y - A.vel.y;
        let dotProduct = xDist * xVelocity + yDist * yVelocity;

        //checks if the objects moves towards one another
        if (dotProduct > 0) {
            let collisionScale = dotProduct / distSquared;
            let xCollision = xDist * collisionScale;
            let yCollision = yDist * collisionScale;

            let combindedMass = A.mass + B.mass;
            let collisionWeightA = 2 * B.mass / combindedMass;
            let collisionWeightB = 2 * A.mass / combindedMass;

            //The Collision vector is the speed difference projected on the Dist vector
            A.vel.x += collisionWeightA * xCollision;
            A.vel.y += collisionWeightA * yCollision;
            B.vel.x -= collisionWeightB * xCollision;
            B.vel.y -= collisionWeightB * yCollision;

            // A.update()
            // B.update()

        }
        // }
    }


}