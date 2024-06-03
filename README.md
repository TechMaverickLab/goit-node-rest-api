# GoIT Node.js REST API

This project is a REST API for managing contacts.

## Installation

Run `npm install` to install dependencies.

## Usage

Run `npm run start:dev` to start the server in development mode.

## Environment Variables

The project uses environment variables for configuration. Create a `.env` file in the root of your project and add the following variables:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET=your_jwt_secret

## Routes

Contacts
- `/api/contacts`
  - GET `/` - Get all contacts
  - GET `/:id` - Get contact by ID
  - POST `/` - Create new contact
  - DELETE `/:id` - Delete contact by ID
  - PUT `/:id` - Update contact by ID
  - PATCH `/:id/favorite` - Update contact's favorite status

Users
- `/api/users`
  - POST `/register` - Register a new user
  - POST `/login` - Login a user
  - GET `/current` - Get current user
  - POST `/logout` - Logout a user
  - PATCH `/subscription` - Update user subscription


## Avatar Upload

To update a user's avatar, use the following endpoint:

Request
- PATCH /api/users/avatars
- Content-Type: multipart/form-data
- Authorization: Bearer {{token}}
- RequestBody: Uploaded file

Successful Response
- Status: 200 OK
- Content-Type: application/json
- ResponseBody:`{ "avatarURL": "link_to_the_uploaded_avatar" }`

Error Response
- Status: 401 Unauthorized
- Content-Type: application/json
- ResponseBody: `{ "message": "Not authorized" }`
