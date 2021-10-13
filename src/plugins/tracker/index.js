const mixpanel = require('mixpanel-browser')
const MIXPANEL_TOKEN = '4eb2ba43842cf4f6f3d91af158012213'

mixpanel.init(MIXPANEL_TOKEN)

module.exports = mixpanel
