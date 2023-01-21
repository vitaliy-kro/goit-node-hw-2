const express = require('express');
const { Unauthorized, NotFound, InternalServerError } = require('http-errors');
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
} = require('../../schemas/contacts/contactsJoiSchemas');
const { auth } = require('../../middlewares');

const contactsRouter = express.Router();

contactsRouter.get('/', async (req, res, next) => {
  const { limit = 20, page = 1, favorite = false } = req.query;
  const skip = (page - 1) * limit;
  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }
    const contacts = await getContacts(req.user.id, limit, skip, favorite);
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }
    const contact = await getContactById(contactId, req.user.id);
    if (!contact) {
      throw NotFound(`Contact with id:'${contactId}' not found`);
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post('/', async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);

  if (error?.message) {
    return res.status(400).json({ message: authCheck });
  }
  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }

    const { _id, name, email, phone, favorite } = await addContact(
      req.body,
      req.user._id
    );
    res.status(201).json({ id: _id, name, email, phone, favorite });
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }

    const remove = await removeContact(contactId);
    if (!remove) {
      throw NotFound(`Contact with id ${contactId} not found`);
    }

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

contactsRouter.put('/:contactId', async (req, res, next) => {
  const { body, params } = req;

  const { error } = updadeContactSchema.validate(body);

  if (error?.message) {
    return res.status(400).json({ message: authCheck });
  }
  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }
    const result = await updateContact(params.contactId, body, req.user._id);
    if (!result) {
      throw NotFound(`Contact with id:'${params.contactId}' not found`);
    }
    const { _id, name, email, phone, favorite } = result;
    res.json({ id: _id, name, email, phone, favorite });
  } catch (error) {
    next(error);
  }
});

contactsRouter.patch('/:contactId/favorite', async (req, res, next) => {
  const { body, params } = req;
  const { error } = changeFavoriteSchema.validate(body);
  if (error?.message) {
    return res.status(400).json({ message: authCheck });
  }
  try {
    const authCheck = await auth(req);
    req.user = authCheck;

    if (
      authCheck === 'token type is not valid' ||
      authCheck === 'no token provided' ||
      authCheck === 'jwt expired'
    ) {
      throw Unauthorized(authCheck);
    }
    const result = await updateStatusContact(params.contactId, body);
    if (!result) {
      throw NotFound(`Contact with id:'${params.contactId}' not found`);
    }
    const { _id, name, email, phone, favorite } = result;
    res.status(200).json({ id: _id, name, email, phone, favorite });
  } catch (error) {
    next(error);
  }
});

module.exports = { contactsRouter };
