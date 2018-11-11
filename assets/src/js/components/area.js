var that = {

  elem: {
    area: o('.area', 1),
    mouseBox: o('.area .mouseBox', 1)
  },

  mouseBox: {
    width: 45,
    height: 45,
    halfWidth: 22.5,
    halfHeight: 22.5
  },

  defaults: {

    positionsX: 600 / 45,
    positionsY: 450 / 45,

    area: {
      width: 600,
      height: 450,
      x: null,
      y: null
    },

    currentPos: {
      x: null,
      y: null
    },

  },

  defaultXY() {
    let XY = that.elem.area.getBoundingClientRect();
    that.defaults.area.x = XY.x;
    that.defaults.area.y = XY.y;
  },

  getStiffCords(x, y) {
    return {
      stiffX: Math.round(((x - that.mouseBox.halfWidth) / that.defaults.area.width) * that.defaults.positionsX) * 45,
      stiffY: Math.round(((y - that.mouseBox.halfHeight) / that.defaults.area.height) *  that.defaults.positionsY) * 45
    }
  },

  setMouseBoxPosition() {

    let stiffCords = that.getStiffCords(
      that.defaults.currentPos.x,
      that.defaults.currentPos.y
    );

    that.elem.mouseBox.style.cssText = `
      left: ${stiffCords.stiffX}px;
      top: ${stiffCords.stiffY}px;
    `;

  },

  events() {

    this.elem.area.addEventListener('mousemove', function(e) {
      requestAnimationFrame(() => {
        that.defaults.currentPos.x = e.clientX - that.defaults.area.x;
        that.defaults.currentPos.y = e.clientY - that.defaults.area.y;
        that.setMouseBoxPosition();
      });
    });

  },

  init() {
    this.events();
    this.defaultXY();
  }

};

module.exports.area = that;
