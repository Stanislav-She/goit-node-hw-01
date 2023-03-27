const fsp = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");
const newID = require("bson-objectid");

async function listContacts() {
  try {
    const result = await fsp.readFile(contactsPath);
    return await JSON.parse(result);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = await contacts.find((item) => item.id === contactId);
  if (!result) return null;
  return result;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) return null;
  const [result] = contacts.splice(index, 1);
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: newID(),
  };
  contacts.push(newContact);
  await fsp.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
