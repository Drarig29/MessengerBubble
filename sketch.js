var cnv, mousePos, bubble, remBubble, rad;

function vectorEquals(v1, v2) {
  return p5.Vector.sub(v2, v1).mag() < 0.001;
}

function centerCanvas() {
  cnv = createCanvas(0.8 * windowWidth, 0.8 * windowHeight);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

var last, remRad;

function setup() {
  centerCanvas();
  noStroke();
  ellipseMode(RADIUS);

  bubble = new Bubble(width / 2, height / 2, 0.5, 0.15, 50);

  mousePos = createVector(0, 0);
  rad = 44;

  remRad = {
    value: 40,
    drag: 0.5,
    strength: 0.15,
    target: 30
  };
}

var dragging = false;
var offset;

function mousePressed() {
  mousePos.set(mouseX, mouseY);
  offset = p5.Vector.sub(mousePos, bubble.pos);

  if (offset.mag() >= rad) return;

  last = millis();
  rad = 40;
  dragging = true;
}

function mouseReleased() {
  rad = 44;
  dragging = false;

  if (!remBubble) return;

  remBubble.setTarget(createVector(width / 2, height + 110));
  remBubble.onArrived = function() {
    if (remBubble.pos.y > height)
      remBubble = undefined;
  }
}

var remTargetBounds = {
  maxHorizontal: 30,
  maxVertical: 50
};

var inRem = false;

var radVel = 0;

function drawRemoveBubble() {
  var force = remRad.target - remRad.value;
  force *= remRad.strength;

  radVel *= remRad.drag;
  radVel += force;

  remRad.value += radVel;

  noFill();
  stroke(0);

  line(remBubble.pos.x - 10, remBubble.pos.y - 10, remBubble.pos.x + 10,
    remBubble.pos.y + 10);
  line(remBubble.pos.x - 10, remBubble.pos.y + 10, remBubble.pos.x + 10,
    remBubble.pos.y - 10);

  ellipse(remBubble.pos.x, remBubble.pos.y, remRad.value);

  noStroke();
}

function draw() {
  background(255);

  if (dragging) {
    if (!remBubble && millis() - last > 300) {
      remBubble = new Bubble(width / 2, height + 110, 0.7, 0.1, 10)
    }

    mousePos.set(mouseX, mouseY);
    bubble.setTarget(p5.Vector.sub(mousePos, offset));

    if (remBubble && !inRem) {
      var _x = width / 2;
      var targetX = map(mouseX, 0, width, _x - remTargetBounds.maxHorizontal,
        _x + remTargetBounds.maxHorizontal);

      var _y = height - 110;
      var targetY = map(constrain(mouseY, height / 2, height), 0, height,
        _y, _y + remTargetBounds.maxVertical);

      remBubble.setTarget(createVector(targetX, targetY));
    }
  }

  fill(255, 0, 0);
  ellipse(bubble.pos.x, bubble.pos.y, rad);

  if (remBubble) {
    fill(0, 255, 0);
    remBubble.move();

    if (remBubble) {
      if (p5.Vector.sub(mousePos, remBubble.pos).mag() < 100) {
        remRad.target = 40;
        inRem = true;

        bubble.drag = 0.6;
        bubble.strength = 0.15;
        bubble.setTarget(remBubble.pos);
      } else {
        remRad.target = 30;
        inRem = false;

        bubble.drag = 0.5;
        bubble.strength = 0.15;
      }

      drawRemoveBubble();
    }
  }

  bubble.move();
}
