//-------------------------------------------------------------------------------------------
//| GLOBAL VARIABLES
//-------------------------------------------------------------------------------------------
let debug_attraction = false
let debug_vision = false
let debug_qtree = false

// let selectedColors={A:null,B:null}

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
  particleDiameter = 10
  colorsTotal = 3
  particlesTotal = 100
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

function keyPressed() {
  console.log(keyCode)
  switch (keyCode) {
    case 49: case 97: //1
      debug_attraction = !debug_attraction
      break;
    case 50: case 98: //2
      debug_vision = !debug_vision
      break;
    case 51: case 99: //3
      debug_qtree = !debug_qtree
      break;
    case 82: //R
      restartSim()
      break;
    case 173: case 109: //-
      colorsTotal -= 1
      if (colorsTotal <= 0) colorsTotal = 1
      restartSim()
      break;
    case 61: case 107: //+
      colorsTotal += 1
      if (colorsTotal > colors.length) colorsTotal = colors.length
      restartSim()
      break;
    case 188://<
      removeParticles(particlesTotal / 2)
      break;
    case 190: //>
      addParticles(particlesTotal)
      break;
    default:
      break;
  }
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
    if (f.x === 0 && f.y === 0) { f.add(particle.wander(1, 50, 2)) }
    particle.applyForce(f)

    particle.update()
    particle.render()
  });
  pop()

  //DEBUG
  //--render the dispaly for the Qtree
  if (debug_qtree) qTree.show()

  //UI ELEMENTS
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

  //keybind text
  textAlign(LEFT, CENTER);
  textSize(15)
  fill(255)
  noStroke()
  text('FPS: ' + floor(frameRate()), 10, height - 60)
  text('DEBUG: [1] Attraction lines| [2] Sight| [3] Qtree|', 10, height - 45)
  text('SIM: [R] Restart Sim| [-] Less Colors| [+] More colors|', 10, height - 30)
  text('PARTICLES ' + particles.length + ': [<] half particles| [>] double particles|', 10, height - 15)

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