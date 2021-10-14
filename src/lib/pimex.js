const request = require('axios')
const config = require('../config')

const token = config.services.pimex.token
const apiURL = config.services.pimex.api

const getBoard = async boardId => {
  const { data } = await request.get(`${apiURL}/boards/${boardId}`, {
    headers: {
      Authorization: token
    }
  })
  return data.data
}

const addLead = async leadData => {
  const { data } = await request.post(`${apiURL}/conversions/`, leadData)
  return data.data
}

const getUsersFromBoard = async boardId => {
  const { data } = await request.get(`${apiURL}/boards/${boardId}/users`, {
    headers: {
      Authorization: token
    }
  })
  return data
}

const addNotification = async (idUser, data) => {
  const alert = await request.post(`${apiURL}/users/${idUser}/alerts`, data)
  return alert.data
}

module.exports = {
  getBoard,
  addLead,
  addNotification,
  getUsersFromBoard
}
