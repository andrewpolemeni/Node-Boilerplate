const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle:{
        type: String,
        required: true,
        max: 40
    },
    company:{
        type: String
    },
    phone:{
        type: String
    },
    website:{
        type: String
    },
    location:{
        type: String
    },
    githubusername:{
        type: String
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);