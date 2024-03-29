class Particle {
    constructor(position, color) {
        this.color = color
        this.fill = colors[color]

        this.sightRange = 300
        this.sightAngle = 120

        this.vehicle = new Vehicle(position.x, position.y)



    }

    update() {
        this.vehicle.update()
        // this.vehicle.wander()
        this.vehicle.edges()
    };


    checkNeighbours(n) {
        let acted = false
        n.forEach(element => {
            if (this.checkNeighbour(element)) acted = true
        });

        if (n.length === 0 || acted === false) {
            this.vehicle.wander()
        }
    }

    checkNeighbour(n) {
        if (this === n) { return false }//dont check if this is its self

        let p1 = this.vehicle.pos
        let p2 = n.vehicle.pos

        if (this.canISeeThis(p2.x, p2.y)) {
            let a = attractionMatrix[this.color][n.color]
            switch (a) {
                case -1:
                    // this.vehicle.evade(n.vehicle)
                    this.vehicle.applyForce(this.vehicle.flee(n.vehicle.pos))
                    stroke(255, 0, 0)
                    break;

                case 1:
                    // this.vehicle.pursue(n.vehicle)
                    this.vehicle.applyForce(this.vehicle.arrive(n.vehicle.pos))
                    stroke(0, 255, 0)
                    break;

                default:
                    stroke(0)
                    break;
            }

            // let mp = midPoint(p1, p2)
            // strokeWeight(4)
            // line(p1.x, p1.y, mp.x, mp.y)
        }
    }

    render() {
        if (debug_vision) { this.drawVision() }

        fill(this.fill)
        stroke(this.fill)
        this.vehicle.show()

    }

    drawVision() {
        push()
        translate(this.vehicle.pos.x, this.vehicle.pos.y)
        rotate(this.vehicle.vel.heading())


        //draw the vision arc
        // noFill()
        // stroke(255, 50)
        // strokeWeight(3)
        // arc(0, 0, this.sightRange * 2, this.sightRange * 2, -radians(this.sightAngle / 2), radians(this.sightAngle / 2), PIE);


        noFill()
        stroke(255, 50)

        circle(0, 0, this.sightRange)

        circle(0, 0, this.sightRange / 4)

        pop()
    }


    canISeeThis(x, y) {
        //check only for the whole area circle around them
        let c = this.vehicle.pos
        let r = dist(x, y, c.x, c.y)
        if (r < this.sightRange / 4) return false //if it is too close cant see it
        return r <= this.sightRange


        //check with in teh angle of vision range 
        let f = this.vehicle.vel.heading()
        let a = atan2(y - c.y, x - c.x)
        let s = f - radians(this.sightAngle / 2)
        let e = f + radians(this.sightAngle / 2)

        if (r <= this.sightRange) {//in sight range
            if (a >= s && a <= e) { return true }
        }

        return false
    }
}
