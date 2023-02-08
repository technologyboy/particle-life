class Bullet extends Mover {
    constructor(pos) {
        super(pos, 10, 0, false)
        this.age = 200
    }

    update() {
        super.update() //update parent class
        this.age -= 1
    }

    render() {
        push()
        strokeWeight(3)
        stroke(80)
        noFill()

        translate(this.pos.x, this.pos.y)
        point(0, 0)

        pop()
    }


}