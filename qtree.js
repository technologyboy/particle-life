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
        let w = this.boundary.w;
        let h = this.boundary.h;
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.southwest = new QuadTree(sw, this.capacity);
        this.divided = true;
    }


    insert(p, UserData) {
        let point = new Point(p.x, p.y, UserData)

        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.northeast.insert(p, UserData)) {
                return true;
            } else if (this.northwest.insert(p, UserData)) {
                return true;
            } else if (this.southeast.insert(p, UserData)) {
                return true;
            } else if (this.southwest.insert(p, UserData)) {
                return true;
            }
        }
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
        push()
        stroke(85);
        noFill();
        strokeWeight(1);
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        for (let p of this.points) {
            strokeWeight(8);
            point(p.x, p.y);
            strokeWeight(1);
            // line(p.x, p.y, this.boundary.x + (this.boundary.w / 2), this.boundary.y + (this.boundary.h / 2))
            line(p.x, p.y, this.boundary.x, this.boundary.y)
        }

        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        else {
            noStroke()
            textSize(15)
            textAlign(CENTER, CENTER)
            fill(85)
            text(this.points.length, this.boundary.x + this.boundary.w - 15, this.boundary.y + this.boundary.h - 15)
        }
        pop()
    }



}