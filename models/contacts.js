const { Contact } = require('../schemas/contacts/contactsMongooseSchemas');

const getContacts = async (id, limit, skip, favorite) => {
  if (favorite === 'true' || favorite === 'false') {
    const userContacts = await Contact.find(
      {
        owner: id,
        favorite,
      },
      { owner: 0 }
    )
      .skip(skip)
      .limit(limit);

    return userContacts;
  }

  const userContacts = await Contact.find(
    {
      owner: id,
    },
    { owner: 0 }
  )
    .skip(skip)
    .limit(limit);
  return userContacts;
};

const getContactById = async (contactId, ownerId) => {
  const contact = await Contact.find(
    { _id: contactId, owner: ownerId },
    { owner: 0 }
  );

  return contact[0];
};
const addContact = async (body, owner) => {
  const newContact = await Contact.create({ ...body, owner });
  return newContact;
};

const removeContact = async (contactId, owner) => {
  const getContact = getContactById(contactId, owner);
  if (!getContact) {
    return getContact;
  }
  const result = await Contact.findByIdAndRemove(contactId);
  return result;
};

const updateContact = async (contactId, body, owner) => {
  const getContact = getContactById(contactId, owner);
  if (!getContact) {
    return getContact;
  }

  const result = await Contact.findByIdAndUpdate(
    contactId,
    { $set: body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const getContact = getContactById(contactId);
  if (!getContact) {
    return getContact;
  }
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
