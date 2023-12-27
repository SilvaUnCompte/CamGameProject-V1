let capture; // our webcam
let captureEvent; // callback when webcam is ready

let markers = [];
let drops = []
const armSize = 1;
const upperArmSize = 1;
const lerpSpeed = .1

let skeleton = [new defaultSkeleton(), new defaultSkeleton(), new defaultSkeleton(), new defaultSkeleton()];

function defaultSkeleton() {
  return {
    armLeft: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    armRight: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    upperArmLeft: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    upperArmRight: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    shoulders: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    legLeft: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    legRight: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    upperLegLeft: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    upperLegRight: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    bodyLeft: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 },
    },
    bodyRight: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 },
    },
    pelvis: {
      p1: { x: 0, y: 0 },
      p2: { x: 0, y: 0 }
    },
    head: {
      pos: {
        x: 0,
        y: 0,
      },
      size: 0
    },
    data: {
      index: undefined,
      timeSinceLastHit: 0
    }
  }
}


function setup() {

  console.log(mediaPipe.conf)

  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam

  // styling
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  fill('white');
}

function draw() {

  //background(0);
  background(0, 0, 20)
  noStroke();


  /* WEBCAM */
  push();
  centerOurStuff(); // center the webcam
  scale(-1, 1); // mirror webcam
  image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight); // draw webcam
  scale(-1, 1); // unset mirror
  pop();


  for (let i = 0; i < 6; i++) {
    drops.push(new Drop(random(width), 0, 0))
  }

  for (let d of drops) {
    d.update()
    drops = drops.filter(d => !d.touched);
    d.show()
  }


  /* TRACKING */
  if (mediaPipe.landmarks.length > 0) {

    for (let i = mediaPipe.landmarks.length; i < 4; i++) {
      skeleton[i] = defaultSkeleton();
    }

    for (let i = 0; i < mediaPipe.landmarks.length; i++) {
      push();
      centerOurStuff();

      for (let j = 0; j < mediaPipe.landmarks[0].length; j++) {
        let x = map(mediaPipe.landmarks[i][j].x, 1, 0, 0, capture.scaledWidth);
        let y = map(mediaPipe.landmarks[i][j].y, 0, 1, 0, capture.scaledHeight);
        markers[j] = { x, y };
      }

      // See all the markers
      // for (let j = 0; j < markers.length; j++) {
      //   fill('red');
      //   ellipse(markers[j].x, markers[j].y, 20, 20);
      //   //console.log(markers[j].x)
      // }


      let middleShoulders = { x: markers[11].x + ((markers[12].x - markers[11].x) / 2), y: markers[11].y + ((markers[12].y - markers[11].y) / 2) };
      let middlePelvis = { x: markers[23].x + ((markers[24].x - markers[23].x) / 2), y: markers[23].y + ((markers[24].y - markers[23].y) / 2) };


      skeleton[i] = {
        armLeft: {
          p1: { x: lerp(skeleton[i].armLeft.p1.x, markers[13].x, lerpSpeed), y: lerp(skeleton[i].armLeft.p1.y, markers[13].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].armLeft.p2.x, markers[13].x + ((markers[19].x - markers[13].x) * armSize), lerpSpeed), y: lerp(skeleton[i].armLeft.p2.y, markers[13].y + ((markers[19].y - markers[13].y) * armSize), lerpSpeed) }
        },
        armRight: {
          p1: { x: lerp(skeleton[i].armRight.p1.x, markers[14].x, lerpSpeed), y: lerp(skeleton[i].armRight.p1.y, markers[14].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].armRight.p2.x, markers[14].x + ((markers[20].x - markers[14].x) * armSize), lerpSpeed), y: lerp(skeleton[i].armRight.p2.y, markers[14].y + ((markers[20].y - markers[14].y) * armSize), lerpSpeed) }
        },
        upperArmLeft: {
          p1: { x: lerp(skeleton[i].upperArmLeft.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton[i].upperArmLeft.p1.y, markers[11].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].upperArmLeft.p2.x, markers[11].x + ((markers[13].x - markers[11].x) * upperArmSize), lerpSpeed), y: lerp(skeleton[i].upperArmLeft.p2.y, markers[11].y + ((markers[13].y - markers[11].y) * upperArmSize), lerpSpeed) }
        },
        upperArmRight: {
          p1: { x: lerp(skeleton[i].upperArmRight.p1.x, markers[12].x, lerpSpeed), y: lerp(skeleton[i].upperArmRight.p1.y, markers[12].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].upperArmRight.p2.x, markers[12].x + ((markers[14].x - markers[12].x) * upperArmSize), lerpSpeed), y: lerp(skeleton[i].upperArmRight.p2.y, markers[12].y + ((markers[14].y - markers[12].y) * upperArmSize), lerpSpeed) }
        },
        legLeft: {
          p1: { x: lerp(skeleton[i].legLeft.p1.x, markers[25].x, lerpSpeed), y: lerp(skeleton[i].legLeft.p1.y, markers[25].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].legLeft.p2.x, markers[25].x + ((markers[27].x - markers[25].x)), lerpSpeed), y: lerp(skeleton[i].legLeft.p2.y, markers[25].y + ((markers[27].y - markers[25].y)), lerpSpeed) }
        },
        legRight: {
          p1: { x: lerp(skeleton[i].legRight.p1.x, markers[26].x, lerpSpeed), y: lerp(skeleton[i].legRight.p1.y, markers[26].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].legRight.p2.x, markers[26].x + ((markers[28].x - markers[26].x)), lerpSpeed), y: lerp(skeleton[i].legRight.p2.y, markers[26].y + ((markers[28].y - markers[26].y)), lerpSpeed) }
        },
        upperLegLeft: {
          p1: { x: lerp(skeleton[i].upperLegLeft.p1.x, markers[23].x, lerpSpeed), y: lerp(skeleton[i].upperLegLeft.p1.y, markers[23].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].upperLegLeft.p2.x, markers[23].x + ((markers[25].x - markers[23].x)), lerpSpeed), y: lerp(skeleton[i].upperLegLeft.p2.y, markers[23].y + ((markers[25].y - markers[23].y)), lerpSpeed) }
        },
        upperLegRight: {
          p1: { x: lerp(skeleton[i].upperLegRight.p1.x, markers[24].x, lerpSpeed), y: lerp(skeleton[i].upperLegRight.p1.y, markers[24].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].upperLegRight.p2.x, markers[24].x + ((markers[26].x - markers[24].x)), lerpSpeed), y: lerp(skeleton[i].upperLegRight.p2.y, markers[24].y + ((markers[26].y - markers[24].y)), lerpSpeed) }
        },
        shoulders: {
          p1: { x: lerp(skeleton[i].shoulders.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton[i].shoulders.p1.y, markers[11].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].shoulders.p2.x, markers[11].x + (markers[12].x - markers[11].x), lerpSpeed), y: lerp(skeleton[i].shoulders.p2.y, markers[11].y + (markers[12].y - markers[11].y), lerpSpeed) },
          middle: middleShoulders
        },
        head: {
          pos: {
            x: lerp(skeleton[i].head.pos.x, markers[0].x, lerpSpeed),
            y: lerp(skeleton[i].head.pos.y, markers[0].y, lerpSpeed)
          },
          size: lerp(skeleton[i].head.size, dist(markers[0].x, markers[0].y, middlePelvis.x, middlePelvis.y) * 0.4, lerpSpeed)
        },
        pelvis: {
          p1: { x: lerp(skeleton[i].pelvis.p1.x, markers[23].x, lerpSpeed), y: lerp(skeleton[i].pelvis.p1.y, markers[23].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].pelvis.p2.x, markers[24].x, lerpSpeed), y: lerp(skeleton[i].pelvis.p2.y, markers[24].y, lerpSpeed) },
          middle: middlePelvis
        },
        bodyLeft: {
          p1: { x: lerp(skeleton[i].bodyLeft.p1.x, markers[11].x, lerpSpeed), y: lerp(skeleton[i].bodyLeft.p1.y, markers[11].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].bodyLeft.p2.x, markers[23].x, lerpSpeed), y: lerp(skeleton[i].bodyLeft.p2.y, markers[23].y, lerpSpeed) },
        },
        bodyRight: {
          p1: { x: lerp(skeleton[i].bodyRight.p1.x, markers[12].x, lerpSpeed), y: lerp(skeleton[i].bodyRight.p1.y, markers[12].y, lerpSpeed) },
          p2: { x: lerp(skeleton[i].bodyRight.p2.x, markers[24].x, lerpSpeed), y: lerp(skeleton[i].bodyRight.p2.y, markers[24].y, lerpSpeed) },
        },
        data: {
          index: i,
          timeSinceLastHit: skeleton[i].data.timeSinceLastHit + 1
        }
      }


      fill(0, 0, 20);
      noFill();
      stroke('white');
      strokeWeight(12);
      circle(skeleton[i].head.pos.x, skeleton[i].head.pos.y, skeleton[i].head.size);
      drawAllSkeletonLines(i);

      textSize(skeleton[i].head.size / 4);
      fill('white');
      noStroke();

      if (skeleton[i].data.timeSinceLastHit < 30) text('0ᴗ0', skeleton[i].head.pos.x, skeleton[i].head.pos.y);
      else text('^o^', skeleton[i].head.pos.x, skeleton[i].head.pos.y);

      //text(skeleton[i].data.timeSinceLastHit, skeleton[i].head.pos.x + 150, skeleton[i].head.pos.y);

      pop();

    }

  } else skeleton = [defaultSkeleton(), defaultSkeleton(), defaultSkeleton(), defaultSkeleton()];

  /* console.log(frameRate())
  let fps = frameRate();
  text(fps, 50, 50); */
}

function drawAllSkeletonLines(i) {
  for (const [key] of Object.entries(skeleton[i])) {
    if (key == 'head' || key == 'data') continue;
    drawSkeletonLine(key, i);
  }
}

function drawSkeletonLine(bodyPart, i) {
  line(skeleton[i][bodyPart].p1.x, skeleton[i][bodyPart].p1.y, skeleton[i][bodyPart].p2.x, skeleton[i][bodyPart].p2.y);
}



//https://editor.p5js.org/MindForCode/sketches/2XDXwZYIt
class Drop {
  constructor(x, y, wind) {
    const downVel = random(15, 20);
    // const angle = atan(wind/downVel);
    // const offset = tan(angle) * height / 2;

    // let newPos = -(width / 2 - x);
    // const newPosDistance = x - newPos;
    // newPos *= 2;
    //this.pos = createVector(newPos/*  + newPosDistance */, y)

    this.pos = createVector(x, y)
    this.vel = createVector(/* random(-2, 2) */wind, downVel)
    this.length = random(30, 50)
    this.strength = random(255)
    this.touched = false;
  }

  show() {
    push()
    centerOurStuff();
    strokeWeight(6);
    stroke(255, this.strength);
    //if(this.touched) stroke(0, 255, 0);
    line(this.pos.x, this.pos.y, this.pos.x + (-this.vel.x * 2), this.pos.y - this.length);
    pop()
  }

  checkTouch(bodyPart, i) {
    if (bodyPart == 'head') {
      const colide = collideLineCircle(this.pos.x, this.pos.y, this.pos.x, this.pos.y - this.length, skeleton[i][bodyPart].pos.x, skeleton[i][bodyPart].pos.y, skeleton[i][bodyPart].size);
      if (colide) skeleton[i].data.timeSinceLastHit = 0;
      return colide;
    }
    return collideLineLine(this.pos.x, this.pos.y, this.pos.x, this.pos.y - this.length, skeleton[i][bodyPart].p1.x, skeleton[i][bodyPart].p1.y, skeleton[i][bodyPart].p2.x, skeleton[i][bodyPart].p2.y);
  }

  checkTouchSkeleton(body, i) {
    for (const [key] of Object.entries(body)) {
      let touched = key !== 'data' ? this.checkTouch(key, i) : false;
      if (touched) return true;
    }
  }

  checkTouchAnySkeleton() {
    for (let i = 0; i < skeleton.length; i++) {
      if (this.checkTouchSkeleton(skeleton[i], i)) return true;
    }
  }

  update() {
    this.pos.add(this.vel)
    if (this.pos.y > height + 100) this.touched = true; //detect if the drop is out of the screen
    if (skeleton !== undefined && this.checkTouchAnySkeleton()) this.touched = true; //detect if the drop has touched the skeleton
  }

}