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
const { HttpError } = require('../../helpers/HttpError');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await getContacts();
  res.json({ contacts });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    console.log('contact', contact);
    res.json(contact);
  } catch (error) {
    const httpError = new HttpError(
      404,
      `Contact with id:'${contactId}' not found`
    );

    next(httpError);
  }
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

  try {
    await removeContact(contactId);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    const httpError = new HttpError(
      404,
      `Contact with id:'${contactId}' not found`
    );
    next(httpError);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { body, params } = req;

  const { error } = updadeContactSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const result = await updateContact(params.contactId, body);
    res.json(result);
  } catch (error) {
    const httpError = new HttpError(
      404,
      `Contact with id:'${params.contactId}' not found`
    );

    next(httpError);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  const { body, params } = req;
  const { error } = changeFavoriteSchema.validate(body);
  if (error?.message) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const result = await updateStatusContact(params.contactId, body);
    res.status(200).json(result);
  } catch (error) {
    const httpError = new HttpError(
      404,
      `Contact with id:'${params.contactId}' not found`
    );

    next(httpError);
  }
});

module.exports = router;
