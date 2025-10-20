export class Environment {
  constructor(frame = new Map(), parent = null) {
    this.frame = frame;
    this.parent = parent;
  }

  lookup(variable) {
    const id = variable.text;
    if (this.frame.has(id)) {
      return this.frame.get(id);
    } else if (this.parent) {
      return this.parent.lookup(variable);
    } else {
      throw Error(`Unbound variable ${JSON.stringify(variable)}`);
    }
  }

  set(variable, value) {
    const id = variable.id;
    if (this.frame.has(id)) {
      this.frame.set(id, value);
    } else if (this.parent) {
      this.parent.set(variable, value);
    } else {
      throw Error(`Unbound variable ${JSON.stringify(variable)}`);
    }
  }

  define(variable, value) {
    this.frame.set(variable.text, value);
  }
}
