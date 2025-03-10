const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    name: { type: String, required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    dateAdded: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('Collection', CollectionSchema);