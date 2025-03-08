const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  name: { type: String, required: true },
  set: { type: String, required: true },
  condition: { type: String, required: true },
  price: { type: Number, default: 0 },
  loosePrice: { type: Number, default: 0 },
  psa9Price: { type: Number, default: 0 },
  psa10Price: { type: Number, default: 0 },
  cardId: { type: String, required: true }, // Add cardId field
  collection: { type: Schema.Types.ObjectId, ref: 'Collection' }, // Reference to Collection
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema);