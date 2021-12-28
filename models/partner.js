const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const partnerSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamp: true
});

module.exports = mongoose.model('Partner', partnerSchema);