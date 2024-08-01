require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const app = express();

app.use(express.static("build"));
app.use(express.json());

app.use(cors());

morgan.token("body", (req, res) => JSON.stringify(req.body));
morgan.token("response-body", (req, res) => res.locals.responseBody || "");

const responseLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.locals.responseBody = body;
    originalSend.apply(res, arguments);
  };

  next();
};

app.use(responseLogger);

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body :response-body"
  )
);

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => response.json(contacts));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (request, response, next) => {
  Contact.find({})
    .then((contacts) => {
      const content = `
      <p>Phonebook has info for ${contacts.length} people</p>
      <p>${new Date()}</p>
    `;
      response.send(content);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findByIdAndDelete(id)
    .then(() => response.status(204).send())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).send({
      error: "content missing",
    });
  }

  Contact.find({ name: body.name })
    .then((contact) => {
      if (contact.length !== 0) {
        return response.status(400).send({
          error: "name must be unique",
        });
      } else {
        const contact = new Contact({
          name: body.name,
          number: body.number,
        });

        contact
          .save()
          .then((savedContact) => response.json(savedContact))
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("entro");
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
