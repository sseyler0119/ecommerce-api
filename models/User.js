const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength:50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        }
    }, 
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum:['admin', 'user'],
        default: 'user'
    }
})
/* using the function keyword will point to user, whereas () => do not */
// before we save the document
UserSchema.pre('save', async function() { 
   // console.log(this.modifiedPaths()); // testing to see what's being modified
    //console.log(this.isModified('name')); // check properties that are being modified
    if(!this.isModified('password')) return; // don't hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// compare the passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}
module.exports = mongoose.model('User', UserSchema);