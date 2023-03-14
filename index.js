const express = require('express')
const app = express()

app.use(express.json())

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
    res.json(persons)
})

// info-ruudun esittäminen
app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
})

// yksittäisen henkilön esittäminen
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// yksittäisen henkilön poisto
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})