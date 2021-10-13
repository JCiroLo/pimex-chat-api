const path = require('path')
const fs = require('fs')

function findRcFile(directory = false) {
    if (!directory) {
        directory = path.dirname(require.main.filename)
    }

    const file = path.resolve(directory, '.pimexrc.json')
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return file
    }

    const parent = path.resolve(directory, '..')
    if (parent === directory) {
        return null
    }

    return findRcFile(parent)
}

const env = process.env.NODE_ENV || 'production'

try {
    const rcFilePath = findRcFile(process.env.PIMEX_CONFIG)

    if (!rcFilePath) throw new Error('Error getting the configuration file .pimexrc.json in message module')

    let configData = null

    configData = require(rcFilePath)
    configData.mainPath = path.dirname(rcFilePath)
    if (configData.keysFolder) {
        configData.keysFolder = `${configData.mainPath}/${configData.keysFolder}/`
    }

    module.exports = configData
} catch (e) {
    console.log(e)
    throw new Error(e.message)
}
