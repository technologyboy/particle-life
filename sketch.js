//-------------------------------------------------------------------------------------------
//| GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------
let debug_attraction = false
let debug_vision = false
let debug_qtree = false
let debug_velocities = false
let hide_UI = false


let particles = []
let attractionMatrix = []

let colors = []
let qTree
let boundry

let particleDiameter
let colorsTotal
let particlesTotal

let particleSightMax //how far away doest another particle need to be to be outside the afftect of the attraction forces
let particleSightMin //how close do particles need to be before the afftect of the attraction forces are null, to avoid all particles clumping together

//--UI elements
let UIObjects = []

// let keyBindings = []


//-------------------------------------------------------------------------------------------
//| INITIAL SET UP
//-------------------------------------------------------------------------------------------

function setup() {
  chkAttractionLines = select('#attraction-lines')
  chkAttractionLines.changed(function () { debug_attraction = chkAttractionLines.checked(); });

  chkVision = select('#particle-vision')
  chkVision.changed(function () { debug_vision = chkVision.checked() });

  chkVelocities = select('#particle-velocities')
  chkVelocities.changed(function () { debug_velocities = chkVelocities.checked() });

  chkQtree = select('#qtree-render')
  chkQtree.changed(function () { debug_qtree = chkQtree.checked() });


  btnRestart = select('#restart-sim');
  btnRestart.mousePressed(restartSim);




  //set up canvas
  // createCanvas(windowWidth, windowHeight);
  var canvas = createCanvas(windowWidth-200, windowHeight);
  canvas.parent('canvasWrapper');



  //game area
  let padding = 0
  boundary = new Rectangle(padding, padding, width - (padding * 2), height - (padding * 2))

  //particle colors
  let addColor = function (hex) { let c = color(hex); c.setAlpha(255); colors.push(c) }
  addColor('#621448')
  addColor('#36a6fc')
  addColor('#80d65c')
  addColor('#e74a27')
  addColor('#a63a7b')

  //set initial sim parameters 
  particleDiameter = 10
  colorsTotal = 3
  particlesTotal = 200
  particleSightMax = 300
  particleSightMin = particleDiameter * 2



  //start a new sim
  restartSim()
}

function restartSim() {
  UIObjects = []
  //set up the attraction matrix ui elements 
  let scale = 25
  let offset = createVector(30, 30)
  for (let i = 0; i < colorsTotal; i++) {
    for (let j = 0; j < colorsTotal; j++) {
      let r = new Rectangle(offset.x + (i * scale), offset.y + (j * scale), scale, scale)
      UIObjects.push(new UI_Object(0, r, "black", "white"))
    }
  }

  //create a 2d array of values to denote the attraction or repultion between each color
  attractionMatrix = []
  for (let i = 0; i < colorsTotal; i++) {
    let row = []
    for (let j = 0; j < colorsTotal; j++) {
      let v = createAttractionValue()
      v = (i == j) ? 1 : -1;
      row.push(v)
      UIObjects[index2DTo1D(i, j, colorsTotal)].text = v
    }
    attractionMatrix.push(row)
  }

  //clear the current array of particles 
  particles = []

  //create the particle entites
  addParticles(particlesTotal)
}



//-------------------------------------------------------------------------------------------
//| USER INTERACTION
//-------------------------------------------------------------------------------------------

//--mouse wheel interactions
function mouseWheel(event) {
  if (!hide_UI) {

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
}

// function mousePressed(){
//   console.log("clicked")
//   particles.push(new Particle(createVector(mouseX,mouseY),0))
// }


//--mouse moved
function mouseMoved() {
  if (!hide_UI) {

    UIObjects.forEach(obj => {
      obj.checkMouseIn(mouseX, mouseY)
    });
  }
}

// //keyboard interaction
// function keyPressed() {
//   const found = keyBindings.find(element => element.bindings.includes(keyCode));
//   if (found) {
//     found.func(eval(found.value))
//   } else {
//     console.log(keyCode)
//   }
// }



//-------------------------------------------------------------------------------------------
//| RENDERING
//-------------------------------------------------------------------------------------------
//--main draw loop
function draw() {
  background(0);

  //QTREE
  //-- create a new qtree
  qTree = new QuadTree(boundary, 3)
  //-- add all of the elements to the qtree
  particles.forEach(particle => { qTree.insert(particle.pos, particle) });

  //DEBUG
  //--render the dispaly for the Qtree
  if (debug_qtree) qTree.show()

  //PARTICLES
  //--render and update all particles
  push()
  particles.forEach(particle => {
    let range = new Circle(particle.pos.x, particle.pos.y, particleSightMax)
    let neighbours = qTree.query(range);
    let f = createVector()
    neighbours.forEach(neighbour => { f.add(particle.checkNeighbour(neighbour.userData)) });
    // if (f.x === 0 && f.y === 0) { f.add(particle.wander(1, 50, 2)) }
    particle.applyForce(f)
    particle.update()
    particle.render()
  });
  pop()

  //UI ELEMENTS
  if (!hide_UI) {
    //--attraction matrix
    //----color spaces
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

    // //keybind text
    // textAlign(LEFT, CENTER);
    // textSize(10)
    // fill(255)
    // noStroke()

    // let cat = ''
    // let colWidth = 110
    // let h = 400
    // let s = createVector(10, height - h - 10)
    // let step = 16

    // push()
    // fill(150, 100)
    // strokeWeight(5)
    // stroke(150)
    // rect(s.x, s.y, colWidth, h, 5)
    // pop()

    // s.x += 10

    // textAlign(LEFT, CENTER)
    // fill(255, 150)
    // noStroke()
    // // keyBindings.forEach(key => {
    // //   if (cat !== key.category) {
    // //     s.y += step
    // //     keyBindHeading(key.category, s.x, s.y, colWidth, step)
    // //     cat = key.category
    // //     s.y += step
    // //   }
    // //   text('[' + key.keyDisplay + '] ' + key.actionDisplay, s.x, s.y, colWidth, step)
    // //   s.y += step
    // // })

    // s.y += step
    // keyBindHeading("VALUES", s.x, s.y, colWidth, step)
    // s.y += step
    // text('paticles: ' + particles.length, s.x, s.y, colWidth, step)
    // s.y += step
    // text('FPS: ' + floor(frameRate()), s.x, s.y, colWidth, step)
  }
}

function keyBindHeading(t, x, y, w, h) {
  push()
  textStyle(BOLD)
  textSize(12)
  text(t, x, y, w, h)
  pop()
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

function addParticles(amount) {
  let spread = createVector((width / 2) - particleDiameter, (height / 2) - particleDiameter)
  for (let i = 0; i < amount; i++) {
    particles.push(new Particle(createVector((width / 2) + random(-spread.x, spread.x), (height / 2) + random(-spread.y, spread.y)), floor(random(colorsTotal))))
  }
  particlesTotal = particles.length
}

function removeParticles(amount) {
  let targetAmount = particles.length - amount
  while (particles.length > targetAmount) {
    const random = Math.floor(Math.random() * particles.length);
    particles.splice(random, 1)[0];
  }
  particlesTotal = particles.length
}

function toggleBool(b) {
  b = !b
}