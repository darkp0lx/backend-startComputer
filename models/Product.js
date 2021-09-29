const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  id: String,
  nombre: String,
  image: String,
  precio: Number
})

const Product = model('Product', productSchema)

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = Product
