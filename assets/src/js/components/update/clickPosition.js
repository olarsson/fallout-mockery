module.exports.clickPosition = (that,e,x,y) => {

  let clickPos = that.positions.clickPos;

  let self = that.hexagon.grid;
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  var localX = mouseX - self.canvasOriginX;
  var localY = mouseY - self.canvasOriginY;

  console.log(
    mouseX,
    mouseY,
    self.canvasOriginX,
    self.canvasOriginY
  );

  var tile = self.getSelectedTile(localX, localY);
  //debugger
  if (tile.column >= 0 && tile.row >= 0) {
    var drawy = tile.column % 2 == 0 ? (tile.row * self.height) + self.canvasOriginY + 6 : (tile.row * self.height) + self.canvasOriginY + 6 + (self.height / 2);
    var drawx = (tile.column * self.side) + self.canvasOriginX;

    clickPos.HEX.PX.x = drawx;
    clickPos.HEX.PX.y = drawy;

    clickPos.HEX.CORD.x = tile.column;
    clickPos.HEX.CORD.y = tile.row;

  }

};
