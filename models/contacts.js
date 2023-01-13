const { Contact } = require('../schemas/contactsMongooseSchemas');

const getContacts = async () => {
  const contacts = await Contact.find({});
  return contacts;
};

const getContactById = async contactId => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    return null;
  }
};

const addContact = async body => {
  try {
    const newContact = await Contact.create(body);
    return newContact;
  } catch (error) {
    return null;
  }
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndRemove(contactId);
  return result;
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { $set: body },
      { new: true }
    );
    return result;
  } catch (error) {
    return null;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { $set: body },
      { new: true }
    );
    return result;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
