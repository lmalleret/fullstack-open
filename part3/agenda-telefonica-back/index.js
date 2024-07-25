const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
morgan.token('response-body', (req, res) => res.locals.responseBody || '');

const responseLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.locals.responseBody = body;
    originalSend.apply(res, arguments);
  };

  next();
};

app.use(responseLogger);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :response-body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send();
  }
});

app.get("/info", (request, response) => {
  const personsCount = persons.length;
  const content = `
      <p>Phonebook has info for ${personsCount} people</p>
      <p>${new Date()}</p>
    `;
  response.send(content);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).send();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const existPerson = persons.find((p) => p.name === String(body.name));

  if (existPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 9999),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
