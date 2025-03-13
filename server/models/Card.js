const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  set: { type: String, required: true },
  condition: { type: String, required: true },
  loosePrice: { type: Number, required: true },
  psa9Price: { type: Number, required: true },
  psa10Price: { type: Number, required: true },
  tcgplayerPrices: {
    low: { type: Number, default: 0 },
    mid: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    market: { type: Number, default: 0 },
    directLow: { type: Number, default: 0 },
  },
  cardId: { type: String, required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
});

module.exports = mongoose.model('Card', cardSchema);