class RepairKit extends Mover {
    constructor(pos) {
        super(pos, 25, random(TWO_PI), true)
        this.applyforce(random(TWO_PI), random(1, 2.5))
        this.mass = 150
        this.value = 10
        this.r = 30





    }

    update() {
        this.vel.limit(0.9)
        super.update() //update parent class

    }

    render() {
        push()
        translate(this.pos.x, this.pos.y)

        //back ground
        noStroke()
        fill(31, 112, 53)
        ellipse(0, 0, this.r)

        //highlight
        fill(50, 168, 82, 150)
        ellipse(1, -1, this.r - 5)

        let ix = -(this.r / 4)
        let iy = -3
        let iw = abs(ix) * 2
        let ih = abs(iy) * 2
        //cross
        fill(50, 56, 5)
        rect(ix, iy, iw, ih)
        rect(iy, ix, ih, iw)


        fill(100, 36, 17)
        rect(ix + 1, iy + 1, iw - 2, ih - 1)
        rect(iy + 1, ix + 1, ih - 2, iw - 1)
        pop()
    }
}