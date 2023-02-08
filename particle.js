class Particle {
    constructor(position, color) {
        this.pos = (position) ? position : createVector(random(width), random(height));
        this.vel = createVector(0, 0)
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.maxForce = 0.5

        this.color = color


        this.fill = colors[color]
    }

    // update() {
    //     this.pos.add(this.vel)
    //     this.edges()
    //     this.vel = createVector(0, 0)
    // }

    applyForce(force) {
        this.acc.add(force);
    };

    checkNeighbour(n) {
        //check if this particle is going to make an affect on this particles velocity
        let d = dist(this.pos.x, this.pos.y, n.pos.x, n.pos.y)
        let m = 0 //multiplyer
        if (d <= particleSightMin) {
            m = map(d, 0, particleSightMin, -1, 0) //set magitude -1 to 0 based on how close from min range the particle is 
            this.seek(n,true)
        } else if (d <= particleSightMax / 2) {
            m = map(d, particleSightMin, particleSightMax / 2, 0, a) //set mag 0 to matrix mag based on distance between 
            this.seek(n)
        } else if (d <= particleSightMax) {
            m = map(d, particleSightMax / 2, particleSightMax, a, 0)
            this.seek(n)
        }
    }



    seek(t, isFlee = false) {
        var desired = p5.Vector.sub(t, this.pos);
        desired.setMag(this.maxSpeed);
        var steering = p5.Vector.sub(desired, this.vel);
        steering.limit(this.maxForce);
        if (isFlee) {
            steering.mult(-1)
        }
        this.applyForce(steering);
    }


    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0)
    };



    render() {
        push()
        fill(this.fill)
        noStroke()
        translate(this.pos.x, this.pos.y)
        ellipse(0, 0, particleDiameter)




        //DEBUG
        //draw the vector arrow.
        noFill()
        strokeWeight(1)
        stroke(255)
        let p1 = this.vel.copy()
        p1.setMag(particleDiameter / 3)
        let p2 = this.vel.copy()
        p2.setMag((particleDiameter / 2) + 2)
        line(p1.x, p1.y, p2.x, p2.y)
        pop()

    }

    edges() {
        //wrap the particle across the screen
        if (this.pos.x < -particleDiameter) { this.pos.x = width + particleDiameter }
        if (this.pos.x > width + particleDiameter) { this.pos.x = -particleDiameter }
        if (this.pos.y < -particleDiameter) { this.pos.y = height + particleDiameter }
        if (this.pos.y > height + particleDiameter) { this.pos.y = -particleDiameter }
    }
}