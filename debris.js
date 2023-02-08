class Debris extends Mover {
    constructor(pos) {
        super(pos, 1, 0, false)
        this.age = random(25, 100)
        this.max_age = this.age
    }

    update() {
        super.update() //update parent class
        this.age -= 1
    }

    render() {
        push()
        stroke(200)
        noFill()
        translate(this.pos.x, this.pos.y)
        point(0, 0)
        pop()
    }
}