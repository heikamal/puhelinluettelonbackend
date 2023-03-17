require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const mongoose = require ('mongoose')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
    let logged = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')

    if (req.method === 'POST'){
        logged = logged.concat(' ')
        logged = logged.concat(JSON.stringify(req.body))
    }
    return logged
  }))

// puhelinluettelon alustus
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"    
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"    
    }
]

// koko puhelinluettelon näyttäminen json-muodossa
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

// info-ruudun esittäminen
app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
})

// yksittäisen henkilön esittäminen
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

// yksittäisen henkilön poisto
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// henkilön lisääminen
app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

// henkilön numeron muokkaaminen
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    const person = {
        name: body.name,
        number: body.number,
    }
    
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(result => {
        res.json(person)
    }).catch(error => next(error))
})

// virheidenkäsittelijät
const uknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'uknown endpoint' })
}

app.use(uknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})