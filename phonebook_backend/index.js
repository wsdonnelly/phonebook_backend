const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))
morgan.token('post', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(
        `<p>The Phonebook has info for ${persons.length} people </p>
        <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const makeId = () => Math.floor(Math.random() * 100000)

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
    }
    if ((persons.map(p => p.name)).some(n => n === body.name)) {
        return response.status(400).json({ 
            error: 'name exists already' 
        })
    }

    const person = {
        id: makeId(),
        name: body.name,
        number : body.number
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
