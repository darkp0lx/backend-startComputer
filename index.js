require('./mongo')
const Product = require('./models/Product')
const cors = require('cors')
var express = require('express')
const { json } = require('express')
var app = express()
app.use(cors())
app.use(express.json())

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (e) {
    console.log(e)
  }
})

app.get('/api/products/:id', async (req, res, next) => {
  const id = req.params.id
  const productoEncontrado = await Product.findById(id)
  if (productoEncontrado) {
    return res.json(productoEncontrado)
  } else {
    res
      .status(404)
      .end()
      .catch(err => next(err))
  }
})

app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id
  const productoEncontrado = await Product.findByIdAndDelete(id)
  if (productoEncontrado) {
    res
      .status(202)
      .json({
        status: 'eliminado!!!!'
      })
      .end()
  } else {
    res.status(404).json({ status: 'ese producto no existe' })
  }
})

app.post('/api/products', async (req, res) => {
  const { nombre, image, precio } = req.query
  const newProduct = new Product({
    nombre: nombre,
    image: image,
    precio: precio
  })

  if (!nombre) {
    return res.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  try {
    const savedProduct = await newProduct.save()
    res.json(savedProduct)
  } catch (err) {
    console.log(err)
  }
})

app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id
  const { idBody, precio, nombre, image } = req.body

  const product = {
    id: idBody,
    nombre: nombre,
    image: image,
    precio: precio
  }
  Product.findByIdAndUpdate(id, product, { new: true }).then(response =>
    res.json(response)
  )
})

app.use((req, res) => {
  res.status(404).json({
    error: 'not found'
  })
})

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log('Server listening on')
})

module.exports = { server, app }
