module.exports.getCords = (that) => {

  return {

    _small(x,y) {
      let smallX = Math.round(((x - that.mouseBox.halfWidth) / that.defaults.area.width) * that.defaults.positionsX),
      smallY = Math.round(((y - that.mouseBox.halfHeight) / that.defaults.area.height) *  that.defaults.positionsY);
      return {
        smallX: smallX,
        smallY: smallY
      }
    },

    small(x,y) {
      let smallCords = that.getCords._small(x,y);
      return {
        smallX: smallCords.smallX,
        smallY: smallCords.smallY
      };
    },

    final(x,y) {
      let smallCords = that.getCords._small(x,y);
      return {
        smallX: smallCords.smallX,
        smallY: smallCords.smallY,
        stiffX: smallCords.smallX * that.mouseBox.width,
        stiffY: smallCords.smallY * that.mouseBox.height
      };
    }

  }

};
