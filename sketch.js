//-------------------------------------------------------------------------------------------
//| GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------

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

//--UI elements
let UIObjects = []

//-------------------------------------------------------------------------------------------
//| INITIAL SET UP
//-------------------------------------------------------------------------------------------

function setup() {
  //set up canvas
  createCanvas(windowWidth, windowHeight);

  //game area
  boundary = new Rectangle(10, 10, width - 20, height - 20)

  //particle colors
  let addColor = function (hex) { let c = color(hex); c.setAlpha(255); colors.push(c) }
  addColor('#621448')
  addColor('#36a6fc')
  addColor('#80d65c')
  addColor('#e74a27')
  addColor('#a63a7b')


  //set initial sim parameters 
  particleDiameter = 20
  colorsTotal = 3
  particlesTotal = 100
  particleSightMax = 250
  particleSightMin = particleDiameter * 2

  //set up the attraction matrix ui elements 
  let scale = 25
  let offset = createVector(30, 30)
  for (let i = 0; i < colorsTotal; i++) {
    for (let j = 0; j < colorsTotal; j++) {
      let r = new Rectangle(offset.x + (i * scale), offset.y + (j * scale), scale, scale)
      UIObjects.push(new UI_Object(0, r, "black", "white"))
    }
  }

  //start a new sim
  simReset()
}


function simReset() {
  //create a 2d array of values to denote the attraction or repultion between each color
  attractionMatrix = []
  for (let i = 0; i < colorsTotal; i++) {
    let row = []
    for (let j = 0; j < colorsTotal; j++) {
      let v = createAttractionValue()
      row.push(v)
      UIObjects[index2DTo1D(i, j, colorsTotal)].text = v
    }
    attractionMatrix.push(row)
  }

  //create the particle entites
  let spread = createVector((width / 2) - particleDiameter, (height / 2) - particleDiameter)
  for (let i = 0; i < particlesTotal; i++) {
    particles.push(new Particle(createVector((width / 2) + random(-spread.x, spread.x), (height / 2) + random(-spread.y, spread.y)), floor(random(colorsTotal))))
  }
}


//-------------------------------------------------------------------------------------------
//| USER INTERACTION
//-------------------------------------------------------------------------------------------
//--mouse wheel interactions
function mouseWheel(event) {
  let a = (event.delta > 0) ? -1 : 1;

  //get all UI objects that have the mouse in value
  let index = 0
  UIObjects.forEach(obj => {
    if (obj.mouseIn === true) {
      let am = index1DTo2D(index, colorsTotal)
      attractionMatrix[am.x][am.y] += a
      attractionMatrix[am.x][am.y] = clamp(-1, 1, attractionMatrix[am.x][am.y])
      obj.text = attractionMatrix[am.x][am.y]
    }
    index++
  });

}

//--mouse moved
function mouseMoved() {
  UIObjects.forEach(obj => {
    obj.checkMouseIn(mouseX, mouseY)
  });
}



//-------------------------------------------------------------------------------------------
//| RENDERING
//-------------------------------------------------------------------------------------------
//--main draw loop
function draw() {
  background(0);

  //QTREE
  //-- create a new qtree
  qTree = new QuadTree(boundary, 10)
  //-- add all of the elements to the qtree
  particles.forEach(particle => { qTree.insert(particle.pos, particle) });


  //PARTICLES

  //--render and update all particles
  push()
  particles.forEach(particle => {
    let range = new Circle(particle.pos.x, particle.pos.y, particleSightMax)
    let neighbours = qTree.query(range);
    let f = createVector()
    neighbours.forEach(neighbour => {
      f.add(particle.checkNeighbour(neighbour.userData))
    });
    particle.applyForce(f)

    
    particle.render()
    particle.update()
  });
  pop()






  //DEBUG
  //--render the dispaly for the Qtree
  // qTree.show()


  //UI ELEMENTS
  //--attraction matrix

  //----color spaces
  // let one = UImatrix[0][0]
  let fst = UIObjects[0].screenArea
  let tl = new Rectangle(fst.x - fst.w, fst.y - fst.h, fst.w, fst.h)


  for (let i = 0; i < colorsTotal; i++) {
    fill(colors[i])
    stroke(255)
    strokeWeight(1)
    ellipse(tl.x + (tl.w / 2), tl.y + (tl.h / 2) + (tl.h * (i + 1)), tl.w - (tl.w / 3), tl.h - (tl.h / 3))
    ellipse(tl.x + (tl.w / 2) + tl.w * (i + 1), tl.y + (tl.h / 2), tl.w - (tl.w / 3), tl.h - (tl.h / 3))
  }

  //----render the value squares
  UIObjects.forEach(obj => { obj.render() });
}

//-------------------------------------------------------------------------------------------
//| SUPPORT FUNCTIONS 
//-------------------------------------------------------------------------------------------
function clamp(min, max, v) {
  return Math.min(Math.max(v, min), max);
};

function index1DTo2D(i, width) {
  let p = createVector(0, 0)
  p.x = floor(i / width);
  p.y = i % width;
  return p
}

function index2DTo1D(i, j, width) {
  return (i * width) + j;
}

function midPoint(p1, p2) {
  return distAlongLine(p1, p2, 0.50)
}

function distAlongLine(p1, p2, pos) {
  var midX = p1.x + (p2.x - p1.x) * pos;
  var midY = p1.y + (p2.y - p1.y) * pos;
  return createVector(midX, midY)
}


function createAttractionValue() {
  let a = floor(random(3))
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








//-------------------------------------------------------------------------------------------
//| ARCHIVE
//-------------------------------------------------------------------------------------------

// function gradientLine(x1, y1, x2, y2, color1, color2) {
//   // linear gradient from start to end of line
//   var grad = this.drawingContext.createLinearGradient(x1, y1, x2, y2);
//   grad.addColorStop(0, color1);
//   grad.addColorStop(1, color2);

//   this.drawingContext.strokeStyle = grad;

//   line(x1, y1, x2, y2);
// }

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

// function calculateAttractionForce(A, B) {
//   // let isFlee = false
//   let force = new p5.Vector().sub(A.pos, B.pos)
//   force.setMag(1)
//   // if (isFlee) {
//   let a = attractionMatrix[A.color][B.color]

//   force.mult(a)
//   // }

//   force.sub(B.vel)
//   force.limit(1)

//   A.vel.add(force)


// }



// function lineColor(v) {
//   let a = 10
//   let rtn
//   if (v < 0) {
//     rtn = color(255, 0, 0, a)
//   } else if (v > 0) {
//     rtn = color(0, 0, 255, a)
//   } else {
//     rtn = color(180, 0)
//   }
//   return rtn
// }