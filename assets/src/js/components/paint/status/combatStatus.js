module.exports.combatStatus = (that) => {

  that.canvas.font="13px monospace";
  that.canvas.fillStyle = "#fff";
  that.canvas.fillText(
    'In combat: ' + that.combat.inCombat,
    20, 400
  );
  that.canvas.fillText(
    'actionPoints: ' + that.player.actionPoints + '/' + that.player.DEFAULTS.actionPoints,
    20, 415
  );

};
