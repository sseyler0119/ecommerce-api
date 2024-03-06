const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provide product name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  image: {
    type: String,
    default: '/uploads/example.jpeg',
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['office', 'kitchen', 'bedroom'],
  },
  company: {
    type: String,
    required: [true, 'Please provide product company'],
    enum: {
      values: ['ikea', 'liddy', 'marcos'],
      message: '{VALUE} is not valid',
    },
  },
  colors: {
    type: [String],
    required: true,
    default: ['#222']
  },
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: true,
    default: 15,
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0 
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', // in Product model
  foreignField: 'product', // in Review model
  justOne: false,
});

ProductSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({product: this._id}); // delete all the reviews if a product is removed
})

module.exports = mongoose.model('Product', ProductSchema);
