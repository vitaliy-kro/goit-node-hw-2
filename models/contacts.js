const { Contact } = require('../schemas/contactsMongooseSchemas');

const getContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async contactId => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const addContact = async body => {
  const newContact = await Contact.create(body);
  return newContact;
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndRemove(contactId);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { $set: body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { $set: body },
    { new: true }
  );
  return result;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
