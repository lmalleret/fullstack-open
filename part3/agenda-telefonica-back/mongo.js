const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (process.argv.length > 3 && (!number || !name)) {
  console.log("name and number can't be null");
  process.exit(1);
}

const url = `mongodb+srv://lmalleret99:${password}@cluster0.woqbe4j.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length > 3) {
  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.map((p) => console.log(p.name, p.number));
    mongoose.connection.close();
  });
}
