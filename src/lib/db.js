const admin = require('firebase-admin')
const config = require('../config')

const serviceAccount = require(`${config.keysFolder}/${config.db.keyFilename}`)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.db.databaseURL
})

const getAdmin = () => admin

const db = getAdmin().firestore()
const firestore = getAdmin().firestore

module.exports = {
  getAdmin,
  serviceAccount,
  db,
  firestore
}
