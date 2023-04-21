class Particle {
    constructor(position, color) {
        this.color = color
        this.fill = colors[color]

        this.sightRange = 200
        this.sightAngle = 60

        this.vehicle = new Vehicle(position.x, position.y)
    }

    update() {
        this.vehicle.update()
        this.vehicle.wander()
        this.vehicle.edges()
    };

    checkNeighbour(n) {
        if (this === n) { return false }//dont check if this is its self

        let p1 = this.vehicle.pos
        let p2 = n.vehicle.pos

        if (this.isInsideSector(p2, p1, this.vehicle.vel.heading(), this.vehicle.vel.heading() + TWO_PI + radians(this.sightAngle), this.sightRange)) {
            let a = attractionMatrix[this.color][n.color]

            if (a < 0) {//flee
                this.vehicle.evade(n.vehicle)
            } else if (a > 0) {//seek
                this.vehicle.pursue(n.vehicle)
            }
        }
    }

    render() {
        fill(this.fill)
        stroke(this.fill)
        this.vehicle.show()

        if (debug_vision) { this.drawVision() }

        if (this.canISeeThis(mouseX, mouseY)) {
            line(mouseX, mouseY, this.vehicle.pos.x, this.vehicle.pos.y)
        }
    }

    drawVision() {
        push()
        translate(this.vehicle.pos.x, this.vehicle.pos.y)
        rotate(this.vehicle.vel.heading())

        noFill()

        //draw the full sight range radius
        stroke(100, 50, 25)
        circle(0, 0, this.sightRange * 2)

        //draw the vision arc
        stroke(255, 50)
        strokeWeight(3)
        arc(0, 0, this.sightRange * 2, this.sightRange * 2, TWO_PI - radians(this.sightAngle), TWO_PI + radians(this.sightAngle), PIE);



        pop()
    }


    canISeeThis(x, y) {
        //first check if the device is within the max vision range
        if (dist(x, y, this.vehicle.pos.x, this.vehicle.pos.y) > this.sightRange) { return false }

        let pt1 = createVector(x, y)
        return this.isInsideSector(pt1, this.vehicle.pos, this.vehicle.vel.heading(), this.vehicle.vel.heading() + TWO_PI + radians(this.sightAngle), this.sightRange)
    }

    isInsideSector(point, center, sectorStart, sectorEnd, radiusSquared) {
        var relPoint = {
            x: point.x - center.x,
            y: point.y - center.y
        };

        push()
        noFill()
        stroke("green")
        strokeWeight(4)
        circle(point.x, point.y, 10, 10)

        stroke(200)
        arc(center.x, center.y, radiusSquared, sectorStart, sectorEnd, PIE);

        fill(255)
        noStroke()
        let s = 20
        let y = center.y + s
        text("Rad^2: " + radiusSquared, center.x, y)
        y += s
        text("S: " + sectorStart, center.x, y)
        y += s
        text("E: " + sectorEnd, center.x, y)
        y += s
        let h = this.vehicle.vel.heading()

        text("Heading: " + this.vehicle.vel.heading(), center.x, y)



        let facing = p5.Vector.fromAngle(this.vehicle.vel.heading(), radiusSquared * 2)
        let vS = p5.Vector.fromAngle(this.vehicle.vel.heading() + sectorStart, radiusSquared)
        let vE = p5.Vector.fromAngle(this.vehicle.vel.heading() + sectorEnd, radiusSquared)
        vS.add(this.vehicle.pos)
        vE.add(this.vehicle.pos)
        facing.add(this.vehicle.pos)



        noFill()
        stroke(150)
        line(center.x, center.y, vS.x, vS.y)
        line(center.x, center.y, vE.x, vE.y)
        line(center.x, center.y, facing.x, facing.y)

        pop()


        return !this.areClockwise(sectorStart, relPoint) &&
            this.areClockwise(sectorEnd, relPoint) &&
            this.isWithinRadius(relPoint, radiusSquared);
    }

    isWithinRadius(v, radiusSquared) {
        return v.x * v.x + v.y * v.y <= radiusSquared;
    }

    areClockwise(v1, v2) {
        return -v1.x * v2.y + v1.y * v2.x > 0;
    }
}
