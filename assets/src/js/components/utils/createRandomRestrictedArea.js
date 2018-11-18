module.exports.createRandomRestrictedArea = () => {

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  that.restricted.cords.length = 0;

  for (let i = 0; i < 100; i++) {
    that.restricted.cords.push({
      x: getRandomInt(0,13),
      y: getRandomInt(0,9)
    });
  }

};
