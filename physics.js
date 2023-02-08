class Physics {
    //To Do
    //pull in teh circle rectangle etc classes





    constructor(world) {//world should be a rextange of some form. 
        this.entities = []

    }

    update() { //run update on each of the engine entities
        this.entities.forEach(entity => {
            entity.update()
        });
    }

    applyForce() {

    }

    applyForce(force, entity) {
        entity.applyForce(force)
    }







    //--------------------------------------------------------------------------------------------------------------
    //| Collision Systems                                                                                                  |
    //--------------------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------------------
    //------Detection
    //--------------------------------------------------------------------------------------------------------------


    doPolygonsIntersect(poly1, poly2) {
        // Get the edges of both polygons
        var edges1 = getEdges(poly1);
        var edges2 = getEdges(poly2);

        // For each edge in poly1
        for (var i = 0; i < edges1.length; i++) {
            var axis = edges1[i].normal;

            // Find the min/max points on each polygon along the current axis
            var minMax1 = getMinMax(poly1, axis);
            var minMax2 = getMinMax(poly2, axis);

            // If the poly1's min/max points are outside poly2's min/max points, there is no overlap
            if (minMax1.min > minMax2.max || minMax1.max < minMax2.min) {
                return false;
            }
        }

        // For each edge in poly2
        for (var i = 0; i < edges2.length; i++) {
            var axis = edges2[i].normal;

            // Find the min/max points on each polygon along the current axis
            var minMax1 = getMinMax(poly1, axis);
            var minMax2 = getMinMax(poly2, axis);

            // If the poly2's min/max points are outside poly1's min/max points, there is no overlap
            if (minMax1.min > minMax2.max || minMax1.max < minMax2.min) {
                return false;
            }
        }
        // If no separating axis was found, the polygons must be overlapping
        return true;
    }

    // Function to get the edges of a polygon
    getEdges(poly) {
        var edges = [];
        for (var i = 0; i < poly.length; i++) {
            var p1 = poly[i];
            var p2 = poly[(i + 1) % poly.length];
            var edge = { x: p2.x - p1.x, y: p2.y - p1.y };
            edge.normal = { x: -edge.y, y: edge.x };
            edges.push(edge);
        }
        return edges;
    }

    // Function to get the min and max points of a polygon along a particular axis
    getMinMax(poly, axis) {
        var min = Infinity;
        var max = -Infinity;
        for (var i = 0; i < poly.length; i++) {
            var dot = poly[i].x * axis.x + poly[i].y * axis.y;
            min = Math.min(min, dot);
            max = Math.max(max, dot);
        }
        return { min: min, max: max };
    }


    isPointInsidePolygon(poly, point) {
        var inside = false;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            if (poly[i].y > point.y !== poly[j].y > point.y &&
                point.x < (poly[j].x - poly[i].x) * (point.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) {
                inside = !inside;
            }
        }
        return inside;
    }


    //--------------------------------------------------------------------------------------------------------------
    //------Interactions
    //--------------------------------------------------------------------------------------------------------------

    calculateCollisionVelocities(obj1, obj2) {

        // Get the collision vector (the direction of the impact)
        var collisionVector = {
            x: obj2.pos.x - obj1.pos.x,
            y: obj2.pos.y - obj1.pos.y
        };

        // Get the collision vector's magnitude (the distance between the objects)
        var collisionVectorMag = Math.sqrt(collisionVector.x * collisionVector.x + collisionVector.y * collisionVector.y);
        // Normalize the collision vector (make it a unit vector)
        collisionVector.x /= collisionVectorMag;
        collisionVector.y /= collisionVectorMag;

        // Get the velocity of each object along the collision vector
        var v1 = obj1.vel.x * collisionVector.x + obj1.vel.y * collisionVector.y;
        var v2 = obj2.vel.x * collisionVector.x + obj2.vel.y * collisionVector.y;

        // Calculate the new velocities along the collision vector
        var newV1 = (2 * obj2.mass * v2 + (obj1.mass - obj2.mass) * v1) / (obj1.mass + obj2.mass);
        var newV2 = (2 * obj1.mass * v1 + (obj2.mass - obj1.mass) * v2) / (obj1.mass + obj2.mass);

        // Calculate the new velocities in the x and y directions
        var newVelocities = {
            obj1: {
                x: obj1.vel.x - v1 * collisionVector.x + newV1 * collisionVector.x,
                y: obj1.vel.y - v1 * collisionVector.y + newV1 * collisionVector.y
            },
            obj2: {
                x: obj2.vel.x - v2 * collisionVector.x + newV2 * collisionVector.x,
                y: obj2.vel.y - v2 * collisionVector.y + newV2 * collisionVector.y
            }
        };

        // console.log("new velocities", newVelocities)

        return newVelocities;
    }

}