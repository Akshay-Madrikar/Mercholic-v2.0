const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter proper email address!');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if(validator.contains(value.toLowerCase(),'password')){
                throw new Error('Your password must not contain password in it!');
            }
        }
    },
    about: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

// Remove specific field from response
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    delete userObject.password;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error({error: 'User with that email does not exists. Please signup!'});
    };

    const isMatch = await bcryptjs.compare(password, user.password);
    if(!isMatch) {
        throw new Error({error: 'Email or Password do not match'});
    };

    return user;
};


// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;