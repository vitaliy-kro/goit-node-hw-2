# Contact-Book Project

This is a backend contact-book project built with Node.js, Express, and MongoDB. The application provides a RESTful API for managing contacts. You can create, read, update, and delete contacts.

## Getting Started

### Prerequisites
To run this project, you need to have Node.js and MongoDB installed on your computer.

### Installing
1. Clone this repository.

```bash
git clone https://github.com/vitaliy-kro/goit-node-hw.git
```

2. Install dependencies.

```bash 
cd contact-book
npm install
```

3. Create a .env file in the root directory of the project with the following content:

```makefile
HOST_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_key>
SENDGRID_API_KEY=<your_sendgrid_api_key>
SENDGRID_EMAIL=<your_sengrid_email>
```
Replace **<>** with your information.

### Running 

To start the server, run:

```bash
npm start
```
By default, the server listens on port **3000**. You can change the port by setting the PORT environment variable.

## API Reference

### 'POST /users/register'

Returns a profile that you create.

Example response:

```json
{
    "user": {
        "name": "John Doe",
        "email": "joedoe@mail.com",
        "subscription": "starter",
        "avatarURL": "http://www.gravatar.com/avatar/22fb64f3ed7d033a8344a7bc17c43e93?s=250"
    }
}
```
### 'POST /users/login'

Returns auth token and a profile information.

Example response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZGI2ZDhkMDQyODQ4MWI1MWI1OWM0MSIsImlhdCI6MTY4MDU0ODg1MCwiZXhwIjoxNjgwNTUyNDUwfQ.6QbglKU8rNFQ8zjVbqj1YBNBAyjz1ufh_yOYO8ppOv4",
  "user": {
    "email": "joedoe@mail.com",
    "subscription": "starter"
  }
}
```

### 'GET /contacts'
Returns a list of all user contacts.

Example response:

```json
{
  "contacts": [{
    "_id": "6118f6dbd3b61c00100d3a6a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 123-456-7890",
    "favorite": true
  },
    {
      "_id": "6118f6f6d3b61c00100d3a6b",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1 987-654-3210",
      "favorite": false
    }]
}
```

### 'GET /contacts/:id'
Returns a contact with the specified ID.

Example response:

```json
{
    "_id": "6118f6dbd3b61c00100d3a6a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 123-456-7890",
    "favorite": true
  }
```

### 'POST /contacts'
Creates a new contact.

Example request body:

```json
{
"name": "Bob Smith",
"email": "bob@example.com",
"phone": "2312345642"
}
```
Example response:

```json
{
  "_id": "6118f836d3b61c00100d3a6c",
  "name": "Bob Smith",
  "email": "bob@example.com",
  "phone": "2312345642"
}

```

### 'PUT /contacts/:id'
Updates a contact with the specified ID.

Example request body:

```json
{
  "phone": "111111111"
}
```
Example response:

```json
{
  "_id": "6118f6dbd3b61c00100d3a6a",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "111111111",
  "favorite": true
}
```

### 'DELETE /contacts/:id'
Deletes a contact with the specified ID.

Example response:
```json
{
    "message": "Contact deleted"
}
```

## Licence

This project is licensed under the MIT License. See the [LICENSE]((https://choosealicense.com/licenses/mit/)) file