module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-pxtorem')({ propWhiteList: [] }),
    //require("stylelint"),
  ]
}
