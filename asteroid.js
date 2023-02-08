class Asteroid extends Mover {
    constructor(pos, rad) {
        let r = (rad) ? rad : 100;
        super(pos, r, random(TWO_PI), true)
        this.applyforce(random(TWO_PI), random(1, 2.5))
        this.color = floor(random(10, 20))
        this.vertDists = []
        
        for (let i = 0; i < random(8, 15); i++) {
            this.vertDists[i] = random(-this.r / 5, this.r / 5)
        }

        
        this.mass = map(r,0,100,10,1000)
    }

    update() {
        super.update() //update parent class
    }

    render() {
        push()

        noStroke()

        fill(this.color)

        translate(this.pos.x, this.pos.y)

        //draw boundry lines
        beginShape();
        for (let i = 0; i < this.vertDists.length; i++) {
            const vertDist = this.vertDists[i];
            let a = map(i, 0, this.vertDists.length, 0, TWO_PI)
            let r = vertDist + this.r
            let x = r * sin(a)
            let y = r * cos(a)
            vertex(x, y);
        };
        endShape(CLOSE);

        fill(51, 25)
        //draw boundry lines
        beginShape();
        for (let i = 0; i < this.vertDists.length; i++) {
            const vertDist = this.vertDists[i];
            let a = map(i, 0, this.vertDists.length, 0, TWO_PI)
            let r = vertDist + this.r
            let x = r * sin(a)
            let y = r * cos(a)
            if (x > 0) {vertex(x, y);}
        };
        endShape(CLOSE);
        pop()
    }


    getPoly() {
        let verts = []
        for (let i = 0; i < this.vertDists.length; i++) {
            const vertDist = this.vertDists[i];
            let a = map(i, 0, this.vertDists.length, 0, TWO_PI)
            let r = vertDist + this.r
            let x = this.pos.x + (r * sin(a))
            let y = this.pos.y + (r * cos(a))
            verts.push(createVector(x, y));
        };
        verts.push(verts[0]);
        return verts

    }


}