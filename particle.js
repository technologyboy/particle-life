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
            if(this.checkNeighbour(element))acted = true
        });

        if(n.length === 0 || acted === false){
            this.vehicle.wander()
        }
    }

    checkNeighbour(n) {
        if (this === n) { return false }//dont check if this is its self

        let p1 = this.vehicle.pos
        let p2 = n.vehicle.pos

        if (this.canISeeThis(p2.x, p2.y)) {
            line(p1.x,p1.y,p2.x,p2.y)
            let a = attractionMatrix[this.color][n.color]

            if (a < 0) {//flee
                // this.vehicle.evade(n.vehicle)
                this.vehicle.flee(n.vehicle.pos)
            } else if (a > 0) {//seek
                // this.vehicle.pursue(n.vehicle)
                this.vehicle.arrive(n.vehicle.pos)
            }
        }
    }

    render() {
        fill(this.fill)
        stroke(this.fill)
        this.vehicle.show()

        if (debug_vision) { this.drawVision() }
    }

    drawVision() {
        push()
        translate(this.vehicle.pos.x, this.vehicle.pos.y)
        rotate(this.vehicle.vel.heading())

        noFill()

        //draw the vision arc
        stroke(255, 50)
        strokeWeight(3)

        arc(0, 0, this.sightRange * 2, this.sightRange * 2, -radians(this.sightAngle / 2), radians(this.sightAngle / 2), PIE);

        pop()
    }


    canISeeThis(x, y) {
        let f = this.vehicle.vel.heading()
        let c = this.vehicle.pos
        let r = dist(x, y, c.x, c.y)
        let a = atan2(y - c.y, x - c.x)
        let s = f - radians(this.sightAngle / 2)
        let e = f + radians(this.sightAngle / 2)

        if (r <= this.sightRange) {//in sight range
            if (a >= s && a <= e) { return true }
        }

        return false
    }
}
