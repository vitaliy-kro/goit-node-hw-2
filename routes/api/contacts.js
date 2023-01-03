const express = require('express');
const { nanoid } = require('nanoid');
const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');
const {
  addContactSchema,
  updadeContactSchema,
} = require('./contactsValidationSchemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await getContacts();
  res.json({ contacts });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).json({ message: 'Not found' });
  }
  res.json(contact);
});

router.post('/', async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error } = addContactSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  const id = nanoid();
  const newContact = { id, name, email, phone };

  await addContact(newContact);
  res.status(201).json(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  const result = await removeContact(contactId);

  if (!result) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json({ message: 'Contact deleted' });
});

router.put('/:contactId', async (req, res, next) => {
  const { body, params } = req;

  const { error } = updadeContactSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const result = await updateContact(params.contactId, body);
  res.json(result);
});

module.exports = router;
