'use strict'

const request = require('axios')
const config = require('../../.pimexrc.json')

const apiURL = config.services.apps.facebook

const sendMessageToFacebook = async (data) => {
    try {
        const messageInfo = await request.post(`${apiURL}conversations/messages`, data)
        return Promise.resolve(messageInfo.data)
    } catch (error) {
        return Promise.reject(error)
    }

}
module.exports = {
    sendMessageToFacebook
}
