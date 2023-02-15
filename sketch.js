let particles = []
let attractionMatrix = []

let colors = []
let qTree
let boundry
let engine = new Physics


let particleDiameter
let colorsTotal
let particlesTotal

let particleSightMax //how far away doest another particle need to be to be outside the afftect of the attraction forces
let particleSightMin //how close do particles need to be before the afftect of the attraction forces are null, to avoid all particles clumping together


//UI elements
let UImatrix


function setup() {
  //set up canvas
  createCanvas(windowWidth, windowHeight);



  boundary = new Rectangle(width / 2, height / 2, width + 200, height + 200)
  let a = 255
  colors.push(color(235, 64, 52, a))
  colors.push(color(65, 71, 232, a))
  colors.push(color(212, 255, 0, a))
  colors.push(color(15, 140, 6, a))
  colors.push(color(209, 4, 185, a))
  colors.push(color(140, 234, 245, a))

  //Initial parameters 
  particleDiameter = 15
  colorsTotal = 2
  particlesTotal = 5
  particleSightMax = 500
  particleSightMin = 100

  simReset()
}


function simReset() {
  //create attraction matrix.
  attractionMatrix = []
  for (let i = 0; i < colorsTotal; i++) {
    let row = []
    for (let j = 0; j < colorsTotal; j++) {
      row.push(Math.round(random(-5, 5), 2))
    }
    attractionMatrix.push(row)
  }


  //create the particle entites
  for (let i = 0; i < particlesTotal; i++) {
    // particles.push(new Particle(createVector(random(width), random(height)), floor(random(colorsTotal))))
    particles.push(new Particle(createVector((width / 2) + random(-100, 100), (height / 2) + random(-100, 100)), floor(random(colorsTotal))))
  }



  // create the areas needed for the UI interactions for the matrix
  let scale = 45
  let offset = createVector(50, 50)

  UImatrix = []

  for (let i = 0; i < colorsTotal + 1; i++) {
    let row = []
    for (let j = 0; j < colorsTotal + 1; j++) {
      let r = new Rectangle(offset.x + (i * scale), offset.y + (j * scale), scale, scale)
      row.push(r)
    }
    UImatrix.push(row)
  }
}


//mouse wheel interactions
function mouseWheel(event) {

  let a = (event.delta > 0) ? 0.1 : -0.1;
  console.log(a)


  for (let i = 1; i < colorsTotal + 1; i++) {
    for (let j = 1; j < colorsTotal + 1; j++) {
      let r = UImatrix[i][j]
      if (r.contains(mouseX, mouseY)) {
        attractionMatrix[i - 1][j - 1] += a
        // attractionMatrix[i - 1][j - 1] = clamp(-1, 1, attractionMatrix[i - 1][j - 1])
      }

    }
  }
}

function mouseMoved() {
  for (let i = 1; i < colorsTotal + 1; i++) {
    //draw color rows in 
    for (let j = 1; j < colorsTotal + 1; j++) {
      let r = UImatrix[i][j]
      if (r.contains(mouseX, mouseY)) {
        console.log("mouse in", r)
      }

    }
  }
}


function clamp(min, max, v) {
  return Math.min(Math.max(v, min), max);
};

function lineColor(v) {
  let a = 50
  let rtn
  if (v < 0) {
    rtn = color(255, 0, 0, a)
  } else if (v > 0) {
    rtn = color(0, 0, 255, a)
  } else {
    rtn = color(180, 0)
  }
  return rtn
}

function draw() {
  background(0);

  //set up the new Qtree
  qTree = new QuadTree(boundary, 2)
  //insert all particles to teh new Qtree
  particles.forEach(particle => {
    qTree.insert(particle.pos, particle)
  });




  push()
  stroke(255)
  strokeWeight(particleDiameter / 2)
  particles.forEach(particle => {
    //get all local particles
    let range = new Circle(particle.pos.x, particle.pos.y, particleSightMax)
    let neighbours = qTree.query(range);
    neighbours.forEach(neighbour => {
      particle.checkNeighbour(neighbour.userData)
      let p1 = particle.pos
      let p2 = neighbour.userData.pos
      let attractionTypeAB = attractionMatrix[particle.color][neighbour.userData.color]
      let attractionTypeBA = attractionMatrix[neighbour.userData.color][particle.color]
      let col1 = lineColor(attractionTypeAB)
      let col2 = lineColor(attractionTypeBA)

      gradientLine(p1.x, p1.y, p2.x, p2.y, col1, col2)


    });
  });
  pop()


  // let count = 0
  particles.forEach(particle => {
    //draw the paticle on the screen
    particle.render()

    //update the particle position
    // if (count === 0) {
    //   // particle.pos = createVector(mouseX, mouseY)
    // } else {

    particle.update()
    // }
    // count++


    // DEBUG
    // render the vision range of the particles
    // push()
    // noFill()
    // stroke(100)
    // ellipse(particle.pos.x, particle.pos.y, particleSightMax)
    // ellipse(particle.pos.x, particle.pos.y, particleSightMin)


    pop()
  });


  //DEBUG
  //render the dispaly for teh Qtree
  // qTree.show()



  //DRAW ATTRACTION MARTIX
  push()

  for (let i = 0; i < colorsTotal; i++) {
    for (let j = 0; j < colorsTotal; j++) {
      let r = UImatrix[i][j]
      if (r.contains(createVector(mouseX, mouseY))) {
        stroke('yellow')
        strokeWeight(3)
      } else {
        stroke(255)
        strokeWeight(1)
      }

      r.render()

      push()

      fill(255)
      noStroke()
      textAlign(CENTER, CENTER)
      text(attractionMatrix[i][j], r.x, r.y, r.w, r.h)
      pop()
    }
  }

  let one = UImatrix[0][0]
  let tl = new Rectangle(one.x - one.w, one.y - one.h, one.w, one.h)


  for (let i = 0; i < colorsTotal; i++) {
    fill(colors[i])
    ellipse(tl.x + (tl.w / 2), tl.y + (tl.h / 2) + (tl.h * (i + 1)), tl.w - (tl.w / 3), tl.h - (tl.h / 3))
  }

  for (let i = 0; i < colorsTotal; i++) {
    fill(colors[i])
    ellipse(tl.x + (tl.w / 2) + tl.w * (i + 1), tl.y + (tl.h / 2), tl.w - (tl.w / 3), tl.h - (tl.h / 3))
  }

  pop()


  //text(round(frameRate(), 1) + "  -  " + mouseX + ":" + mouseY, 50, height - 15)
}


function gradientLine(x1, y1, x2, y2, color1, color2) {
  // linear gradient from start to end of line
  var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);

  this.drawingContext.strokeStyle = grad;

  line(x1, y1, x2, y2);
}


// function calculateAttractionForce(A, B) {



//   let desired = p5.Vector.sub(B.pos, A.pos)
//   let d = desired.mag()


//   let a = attractionMatrix[A.color][B.color]
//   let m = 0

//   //setting the magnitude of the force to be applied baded on the d(ist) and attraction mag
//   if (d <= particleSightMin) {
//     m = map(d, 0, particleSightMin, -1, 0) //set magitude -1 to 0 based on how close from min range the particle is 
//   } else if (d <= particleSightMax / 2) {
//     m = map(d, particleSightMin, particleSightMax / 2, 0, a) //set mag 0 to matrix mag based on distance between 
//   } else if (d <= particleSightMax) {
//     m = map(d, particleSightMax / 2, particleSightMax, a, 0)
//   } else {
//     m = 0
//   }



//   desired.setMag(desired.mag() * m)
//   let steer = p5.Vector.sub(desired, A.vel)
//   steer.limit(0.5)



//   fill(255)
//   if (steer.mag !== 0) {
//     if (steer.mag > 0) {
//       stroke('green')
//     } else if (steer.mag < 0) {
//       stroke('red')
//     } else {
//       stroke(50)
//     }
//     text(m, A.pos.x, A.pos.y)

//     // text(round(steer.mag(), 1), A.pos.x, A.pos.y)
//     line(A.pos.x, A.pos.y, B.pos.x, B.pos.y)

//   }




//   A.vel.add(steer)
// }

function calculateAttractionForce(A, B) {
  // let isFlee = false
  let force = new p5.Vector().sub(A.pos, B.pos)
  force.setMag(1)
  // if (isFlee) {
  let a = attractionMatrix[A.color][B.color]

  force.mult(a)
  // }

  force.sub(B.vel)
  force.limit(1)

  A.vel.add(force)


}
