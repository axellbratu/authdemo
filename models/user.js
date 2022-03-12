const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type: 'string',
        required: [true,"Username cannot be blank",true]
    },
    hash:{
        type: 'string',
        required: [true,"Password cannot be blank",true]
    }
})

module.exports = mongoose.model('User',userSchema);