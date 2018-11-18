module.exports.getCords = (that) => {

  return {

    _small(x,y) {
      let smallX = Math.round(((x - that.CONSTANTS.mouseBox.halfWidth) / that.CONSTANTS.area.widthPX) * that.CONSTANTS.positionsXsmallTotal),
      smallY = Math.round(((y - that.CONSTANTS.mouseBox.halfHeight) / that.CONSTANTS.area.heightPX) *  that.CONSTANTS.positionsYsmallTotal);
      return {
        x: smallX,
        y: smallY
      }
    },

    small(x,y) { //input in PX
      let smallCords = that.cords.getCords._small(x,y);
      return {
        CORD: {
          x: smallCords.x,
          y: smallCords.y
        }
      };
    },

    final(x,y) { //input in PX
      let smallCords = that.cords.getCords._small(x,y);
      return {
        PX: {
          x: smallCords.x * that.CONSTANTS.mouseBox.width,
          y: smallCords.y * that.CONSTANTS.mouseBox.height
        },
        CORD: {
          x: smallCords.x,
          y: smallCords.y
        }
      };
    }

  }

};
