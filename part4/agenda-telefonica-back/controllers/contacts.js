const contactsRouter = require("express").Router();
const Contact = require("../models/contact");

contactsRouter.get("/", (request, response) => {
  Contact.find({}).then((contacts) => response.json(contacts));
});

contactsRouter.get("/:id", (request, response, next) => {
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

contactsRouter.get("/info", (request, response, next) => {
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

contactsRouter.delete("/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findByIdAndDelete(id)
    .then(() => response.status(204).send())
    .catch((error) => next(error));
});

contactsRouter.post("/", (request, response, next) => {
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

contactsRouter.put("/:id", (request, response, next) => {
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

module.exports = contactsRouter;
