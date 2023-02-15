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

  boundary = new Rectangle(10, 10, width - 20, height - 20)

  addColor('#621448')
  addColor('#36a6fc')
  addColor('#80d65c')
  addColor('#e74a27')
  addColor('#a63a7b')


  //Initial parameters 
  particleDiameter = 20
  colorsTotal = 2
  particlesTotal = 25
  particleSightMax = 250
  particleSightMin = particleDiameter * 2

  simReset()
}

function addColor(hex) {
  let c = color(hex)
  c.setAlpha(255)
  colors.push(c)
}



function createAttractionValue() {
  let a = floor(random(3))
  // console.log(a)
  switch (a) {
    case 0:
      return -1
      break;
    case 1:
      return 0
      break;
    case 2:
      return 1
      break;

    default:
      break;
  }
}

function midPoint(p1, p2) {
  var midX = p1.x + (p2.x - p1.x) * 0.50;
  var midY = p1.y + (p2.y - p1.y) * 0.50;
  return createVector(midX, midY)
}

function draw_arrow(x1, x2, r) {
  let offset = particleDiameter
  let mid = midPoint(x1, x2)
  push() //start new drawing state
  fill(200)
  stroke(100)
  strokeWeight(1)
  var angle = atan2(x1.y - x2.y, x1.x - x2.x); //gets the angle of the line
  translate(mid.x, mid.y); //translates to the destination vertex
  rotate(angle - HALF_PI); //rotates the arrow point
  triangle(-offset * 0.5, offset, offset * 0.5, offset, 0, -offset / 2); //draws the arrow point as a triangle
  pop();
}

function simReset() {
  //create attraction matrix.
  attractionMatrix = []
  for (let i = 0; i < colorsTotal; i++) {
    let row = []
    for (let j = 0; j < colorsTotal; j++) {
      // row.push(Math.round(random(-5, 5), 2))
      row.push(createAttractionValue())
    }
    attractionMatrix.push(row)
  }
  // console.table(attractionMatrix)
  // noLoop()


  //create the particle entites
  let spread = (height/2) - particleDiameter
  for (let i = 0; i < particlesTotal; i++) {
    // particles.push(new Particle(createVector(random(width), random(height)), floor(random(colorsTotal))))
    particles.push(new Particle(createVector((width / 2) + random(-spread, spread), (height / 2) + random(-spread, spread)), floor(random(colorsTotal))))
  }



  // create the areas needed for the UI interactions for the matrix
  let scale = 25
  let offset = createVector(30, 30)

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
  let a = 10
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
  qTree = new QuadTree(boundary, 10)
  //insert all particles to the new Qtree
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

    // noFill()
    strokeWeight(1)
    // stroke(255)
    // text(neighbours.length, particle.pos.x,particle.pos.y)
    let f = createVector(0, 0)
    neighbours.forEach(neighbour => {
      f.add(particle.checkNeighbour(neighbour.userData))

      // let p1 = particle.pos
      // let p2 = neighbour.userData.pos
      // stroke(255, 50)
      // strokeWeight(2)
      // line(p1.x, p1.y, p2.x, p2.y)
      // let m = midPoint(p1, p2)
      // let d = floor(dist(p1.x,p1.y, p2.x, p2.y))
      // noStroke()
      // fill(255,175)
      // text(d, m.x, m.y)
      // let attractionType = attractionMatrix[particle.color][neighbour.userData.color]
      // if (attractionType < 0) {
      //   draw_arrow(p1, p2)
      // } else if (attractionType > 0) {
      //   draw_arrow(p2, p1)
      // }

      // let attractionTypeBA = attractionMatrix[neighbour.userData.color][particle.color]
      // let col1 = lineColor(attractionTypeAB)
      // let col2 = lineColor(attractionTypeBA)

      // gradientLine(p1.x, p1.y, p2.x, p2.y, col1, col2)


    });
    // text(f.x + " " + f.y, particle.pos.x,particle.pos.y+25)
    if (f.x == 0 && f.y == 0) {
      particle.wander()

    } else {
      particle.applyForce(f)

    }
  });
  pop()


  // let count = 0
  push()
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


  });
  pop()


  //DEBUG
  //render the dispaly for the Qtree
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
        stroke(255,150)
        strokeWeight(1)
      }

      r.render()

      push()

      fill(255,150)
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
