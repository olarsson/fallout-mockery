module.exports.mousePointer = (that) => {
  that.canvas.beginPath();
  that.canvas.arc(
    that.positions.mousePointer.PX.x,
    that.positions.mousePointer.PX.y,
    10,0,2*Math.PI
  );
  that.canvas.strokeStyle = "#000";
  that.canvas.stroke();
};
