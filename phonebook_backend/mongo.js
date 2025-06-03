const mongoose = require('mongoose')

if (process.argv.length > 5 || process.argv.length < 3) {
  console.log('give password and/or data as argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://wsdonnelly:${password}@cluster0.vhlps0c.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })
const personSchema = new mongoose.Schema({
  name: String,
  nubmber: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        content: `${process.argv[3]} ${process.argv[4]}`,
        important: true,
    })
    person.save().then(result => {
        console.log(`added ${person.content} to the phonebook`)
        mongoose.connection.close()
    })
}
else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook")
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}
