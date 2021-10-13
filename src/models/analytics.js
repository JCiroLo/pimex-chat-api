
const {db} = require('../lib/db.js')

const addView = async (boardId, type) => {
    return await db.collection('views').add({
        boardId: boardId,
        date: new Date(),
        type: type
    })
}

module.exports = {
  addView
}

