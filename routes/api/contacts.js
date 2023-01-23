const express = require('express');
const {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
} = require('../../controllers/contacts.controller');
const { auth } = require('../../middlewares');

const contactsRouter = express.Router();

contactsRouter.get('/', auth, getContacts);

contactsRouter.get('/:contactId', auth, getContactById);

contactsRouter.post('/', auth, addContact);

contactsRouter.delete('/:contactId', auth, deleteContact);

contactsRouter.put('/:contactId', auth, updateContact);

contactsRouter.patch('/:contactId/favorite', auth, updateFavorite);

module.exports = { contactsRouter };
