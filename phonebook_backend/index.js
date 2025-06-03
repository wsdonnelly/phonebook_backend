//dependancies
const express = require('express')
const app = express()

require('dotenv').config()

const morgan = require('morgan')

const Person = require('./models/person')

//utils
morgan.token('post', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

//middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))
app.use(express.static('dist'))
app.use(express.json())

//endpoints
app.get('/info', (request, response) => {
  response.send(
    `<p>The Phonebook has info for ${Person.length} people </p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(updatedPerson => {
      if (!updatedPerson)
        return response.status(404).end()

      updatedPerson.name = name
      updatedPerson.number = number

      return updatedPerson.save().then(res => response.json(res))
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(response => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number || false,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

//middleware
app.use(unknownEndpoint)
app.use(errorHandler)

//port listen
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
