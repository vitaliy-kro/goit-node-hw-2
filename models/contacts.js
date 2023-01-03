const fs = require('fs/promises');
const path = require('path');

const contactsPath = path.resolve(__dirname, './contacts.json');

const getContacts = async () => {
  const read = await fs.readFile(contactsPath);
  const normalizedContacts = JSON.parse(read);
  return normalizedContacts;
};

const getContactById = async contactId => {
  const contacts = await getContacts();
  return contacts.find(({ id }) => id === contactId);
};

const addContact = async body => {
  const contacts = await getContacts();

  contacts.push(body);

  fs.writeFile(contactsPath, JSON.stringify(contacts));
};

const removeContact = async contactId => {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);

  if (contactIndex < 0) {
    return 'Not found';
  }
  contacts.splice(contactIndex, 1);
  fs.writeFile(contactsPath, JSON.stringify(contacts));

  return 'Contact deleted';
};

const updateContact = async (contactId, body) => {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);
  if (!contactIndex < 0) {
    return;
  }
  const contactToChange = contacts[contactIndex];
  Object.keys(body).forEach(key => (contactToChange[key] = body[key]));

  fs.writeFile(contactsPath, JSON.stringify(contacts));

  return contactToChange;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
