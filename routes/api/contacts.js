const express = require('express');
const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require('../../models/contacts');
const {
  addContactSchema,
  updadeContactSchema,
  changeFavoriteSchema,
} = require('../../schemas/contactsJoiSchemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await getContacts();
  res.json({ contacts });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return res
      .status(404)
      .json({ message: `Contact with id:'${contactId}' not found` });
  }
  res.json(contact);
});

router.post('/', async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }

  const newContact = await addContact(req.body);
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
  if (!result) {
    return res
      .status(404)
      .json({ message: `Not found contact with id:'${params.contactId}' ` });
  }

  res.json(result);
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  const { body, params } = req;
  const { error } = changeFavoriteSchema.validate(body);
  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  const result = await updateStatusContact(params.contactId, body);

  if (!result) {
    return res
      .status(404)
      .json({ message: `Not found contact with id: ${params.contactId}` });
  }

  res.status(200).json(result);
});

module.exports = router;
