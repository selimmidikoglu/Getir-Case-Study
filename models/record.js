const mongoose = require('mongoose');

const recordSchema =mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    createdAt:{type:Date, required:true},
    count :[Number],
})

module.exports = mongoose.model('Record',recordSchema);