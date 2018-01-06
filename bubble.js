class Bubble {
  constructor(x, y, drag, strength, maxVel = 1000) {
    this.pos = createVector(x, y);
    this.drag = drag;
    this.strength = strength;
    this.maxVel = maxVel;
    this.target = this.pos;
    this.vel = createVector(0, 0);
    this.force = createVector(0, 0);
    this.arrived = false;
  }

  onArrived() {}

  setTarget(target) {
    this.target = target;
    this.arrived = false;
  }

  move() {
    this.force = p5.Vector.sub(this.target, this.pos).mult(this.strength);
    this.vel = this.vel.mult(this.drag).add(this.force);

    this.vel.setMag(constrain(this.vel.mag(), 0, this.maxVel));

    this.pos = this.pos.add(this.vel);

    if (vectorEquals(this.pos, this.target) && vectorEquals(this.vel,
        createVector(0, 0)) && !this.arrived) {
      this.arrived = true;
      this.onArrived();
    }
  }
}
