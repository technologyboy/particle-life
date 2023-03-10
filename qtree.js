class Point {
    constructor(x, y, userData) {
        this.x = x
        this.y = y
        this.userData = userData
    }

    X() {
        //if userdata has an X value return that else return the originally given X
        if (this.userData.x) { return this.userData.x } else { return this.x }
    }
    Y() {
        //if userdata has an X value return that else return the originally given X
        if (this.userData.y) { return this.userData.y } else { return this.y }
    }

}

class Circle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
    }

    center() {
        return createVector(this.x, this.y)
    }

    contains(point) {
        let d = dist(this.x, this.y, point.x, point.y)
        return d <= this.r
    }

    intersects(circle) {
        let d = dist(this.x, this.y, circle.x, circle.y)
        return d <= (this.r + circle.r)
    }

}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    center() {
        return createVector(this.x + (this.w / 2), this.y + (this.h / 2))
    }
    contains(point) {
        return (point.x >= this.x &&
            point.x < this.x + this.w &&
            point.y >= this.y &&
            point.y < this.y + this.h);
    }

    intersects(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h);
    }

    render() {
        push()
        fill(51, 100)
        stroke(255)
        rect(this.x, this.y, this.w, this.h)
        pop()
    }


}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary
        this.capacity = n
        this.points = []
        this.divided = false
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w / 2;
        let h = this.boundary.h / 2;

        //create child nodes
        let ne = new Rectangle(x + w, y, w, h);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x, y, w, h);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x, y + h, w, h);
        this.southwest = new QuadTree(sw, this.capacity);

        //add all current points to the approiate subdivision
        for (let i = this.points; i <= this.points.length; i++) {
            const element = this.points[i];
            this.northeast.insert(p, UserData)
            this.northwest.insert(p, UserData)
            this.southeast.insert(p, UserData)
            this.southwest.insert(p, UserData)
        }
        this.points = [] //clear the existing points
        this.divided = true;
    }


    insert(p, UserData) {
        let point = new Point(p.x, p.y, UserData)

        if (!this.boundary.contains(point)) {
            return false; // point is not in the quadtree region
        }

        if (this.points.length < this.capacity && !this.divided) {
            this.points.push(point); // add point to this node
            return true;
        }

        if (!this.divided) {
            this.subdivide(); //create child nodes
        }

        // recursively insert point into child nodes
        if (this.northeast.insert(p, UserData)) return true;
        if (this.northwest.insert(p, UserData)) return true;
        if (this.southeast.insert(p, UserData)) return true;
        if (this.southwest.insert(p, UserData)) return true;

        return false;// point could not be inserted into any child nodes
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found;
    }

    show() {
        let ctr = this.boundary.center()

        push()
        for (let p of this.points) {
            strokeWeight(2);
            stroke(100, 150);
            line(p.x, p.y, ctr.x, ctr.y)
        }
        pop()

        if (this.points.length !== 0) {
            push()
            noStroke()
            fill(85)
            textSize(15)
            textAlign(CENTER, CENTER)
            ellipse(ctr.x, ctr.y, 25)
            fill(0)
            text(this.points.length, ctr.x, ctr.y)
            pop()
        }

        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        } else {
            push()
            noFill()
            stroke(100, 150);
            strokeWeight(1);
            rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
            pop()
        }
    }
}