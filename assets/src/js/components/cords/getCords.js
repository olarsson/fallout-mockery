module.exports.getCords = (that) => {

  return {

    _small(x,y) {
/*      let smallX = Math.round(((x - that.CONSTANTS.mouseBox.halfWidth) / that.CONSTANTS.area.widthPX) * that.CONSTANTS.positionsXsmallTotal),
      smallY = Math.round(((y - that.CONSTANTS.mouseBox.halfHeight) / that.CONSTANTS.area.heightPX) *  that.CONSTANTS.positionsYsmallTotal);
      return {
        x: smallX,
        y: smallY
      }*/
      let tile = that.hexagon.grid.getSelectedTile(
        x - that.hexagon.grid.canvasOriginX + that.CONSTANTS.area.x,
        y - that.hexagon.grid.canvasOriginY + that.CONSTANTS.area.y
      );

      return {
        x: tile.column,
        y: tile.row
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
      //let smallCords = that.cords.getCords._small(x,y);
      //let smallCords = that.hexagon.grid.getPXAtColRow(x,y);
      let smallCords = that.hexagon.grid.getPXAtColRow(x,y);
      //px to cords
      //cord to px pos
      return {
        PX: {
          x: smallCords.x,
          y: smallCords.y
/*          x: smallCords.x * that.CONSTANTS.mouseBox.width,
          y: smallCords.y * that.CONSTANTS.mouseBox.height*/
        },
        CORD: {
          x: smallCords.x,
          y: smallCords.y
        }
      };
    }

  }

};
