class Ship extends Mover {
    constructor() {
        super(createVector(width / 2, height / 2), 10, 0, true)
        this.turnSpeed = 0.05
        this.max_speed = 4
        this.boostingForce = 0.1
        this.isBoosting = false
        this.mass = 80
        this.health = 100
        this.max_health = 100
        this.isDammaged = false


        //set up fire cooldown
        this.fireRate = 10 //miliseconds between bullets 
        this.lastFired = null; //time a bullet was last fired  
    }

    update() {
        //if is boosting need to apply a force to the vel before the super.update
        if (this.isBoosting) {
            this.applyforce(this.facing, this.boostingForce)
        }


        super.update() //update parent class
    }

    fire() {//fire key is pressed
        if (this.lastFired) {
            if (Date.now() - this.lastFired > this.fireRate) {
                this.lastFired = Date.now()
                return true
            }
        } else {
            this.lastFired = Date.now()
            return true;
        }

        return false

    }


    turnLeft() {
        this.facing -= this.turnSpeed;
    }

    turnRight() {
        this.facing += this.turnSpeed;
    }

    damage(a) {

        this.health -= a
        if (this.health < 0) {
            this.health = 0; this.isBoosting = false;
        }
        this.isDammaged = true
    }

    heal(a) {
        this.health += a
        if (this.health > this.max_health) {
            this.health = this.max_health;
            this.isDammaged = false
        }
    }

    render() {
        push()
        stroke(64, 71, 82)
        fill(53, 60, 71)

        translate(this.pos.x, this.pos.y)
        rotate(this.facing - TWO_PI)


        if (this.isBoosting) { //draw booster flame
            push()
            fill(33, 139, 196)
            stroke(165, 214, 240)

            let b1 = createVector(-20, 0);
            let b2 = createVector(-8, -6);
            let b3 = createVector(-8, 6);
            triangle(b1.x, b1.y, b2.x, b2.y, b3.x, b3.y)
            pop()
        }



        let p1 = createVector(15, 0);
        let p2 = createVector(-10, -10);
        let p3 = createVector(-10, 10);

        triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)





        pop()



        //health bar
        if (this.health != this.max_health) {

            push()
            let w = this.r * 3
            translate(this.pos.x, this.pos.y)
            noFill()
            strokeWeight(0.2)
            stroke(255)
            rect(-w / 2, this.r * 2, w, 5)


            let c = 'green'
            fill(c)
            noStroke()
            let pw = map(this.health, 0, this.max_health, 0, w)
            rect(-w / 2, this.r * 2, pw, 5)
            pop()
        }
    }

    getPoly() {
        let a = []
        a.push(createVector(this.pos.x + 15, this.pos.y + 0));
        a.push(createVector(this.pos.x - 10, this.pos.y - 10));
        a.push(createVector(this.pos.x - 10, this.pos.y + 10));
        return a
    }

}