const axios = require('axios')
const colors = require('../config/colors.json')
const icons = require('../config/icons.json')

const getIcon = () => {
  return icons[Math.floor(Math.random() * (icons.length - 1))]
}

const getColor = () => {
  return colors[Math.floor(Math.random() * (colors.length - 1))]
}
module.exports = {
  getIcon,
  getColor
}
