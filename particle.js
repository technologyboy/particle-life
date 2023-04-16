class Particle {
    constructor(position, color) {
        this.color = color
        this.fill = colors[color]

        this.sightRange = 100
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


        // if (this.canSeeThis(p2)) {//isthis other particle in my sight range
        if (this.isInsideSector(p2, p1, this.vehicle.vel.heading(), this.vehicle.vel.heading() + radians(this.sightAngle), this.sightRange)) {
            let a = attractionMatrix[this.color][n.color]

            if (a < 0) {//flee
                this.vehicle.evade(n.vehicle)
                // stroke(255, 0, 0, 100);
                // strokeWeight(2);
                // action = "flee"



            } else if (a > 0) {//seek
                this.vehicle.pursue(n.vehicle)
                // stroke(0, 255, 0, 100);
                // strokeWeight(5);
                // action = "seek"

            } else {
                // stroke(255, 255, 255, 100);
                // strokeWeight(8);

            }


            // push()

            // strokeWeight(3);
            // let mp = midPoint(p1,p2)
            // let qp = midPoint(p1,mp)
            // line(p1.x, p1.y, mp.x, mp.y)
            // noStroke()
            // fill(255)
            // text(action, qp.x,qp.y)
            // pop()
            // return true

        } else {
            // return false
        }




    }

    render() {
        fill(this.fill)
        stroke(this.fill)
        this.vehicle.show()


        if (debug_vision) {//radar
            push()
            translate(this.vehicle.pos.x, this.vehicle.pos.y)
            rotate(this.vehicle.vel.heading())
            noFill()
            stroke(255, 50)
            strokeWeight(3)
            arc(0, 0, this.sightRange * 2, this.sightRange * 2, TWO_PI - radians(this.sightAngle), TWO_PI + radians(this.sightAngle), PIE);
            pop()
        }

    }

    canSeeThis(pt) {
        let angleOfVision = this.sightAngle
        let rangeOfVision = this.sightRange
        let center = this.vehicle.pos
        let point = pt

        // Convert angle of vision to radians
        const theta = this.vehicle.vel.heading() + radians(angleOfVision)


        // Calculate distance between point and center
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        push()
        fill(255, 100)
        noStroke()
        arc(center.x, center.y, rangeOfVision, rangeOfVision, theta, theta + 1)
        pop()


        // Check if point is within range of vision
        if (distance > rangeOfVision) {
            return false;
        }

        // Calculate angle between point and x-axis
        const phi = Math.atan2(dy, dx);

        // Normalize angle between -pi and pi
        const normalizedPhi = (phi + Math.PI) % (2 * Math.PI) - Math.PI;

        // Check if angle between point and x-axis is within angle of vision
        return Math.abs(normalizedPhi) <= theta / 2;
    }


    isInsideSector(point, center, sectorStart, sectorEnd, radiusSquared) {
        var relPoint = {
            x: point.x - center.x,
            y: point.y - center.y
        };

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
