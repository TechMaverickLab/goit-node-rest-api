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

- `/api/contacts`
  - GET `/` - Get all contacts
  - GET `/:id` - Get contact by ID
  - POST `/` - Create new contact
  - DELETE `/:id` - Delete contact by ID
  - PUT `/:id` - Update contact by ID
  - PATCH `/:id/favorite` - Update contact's favorite status

- `/api/users`
  - POST `/register` - Register a new user
  - POST `/login` - Login a user
  - GET `/current` - Get current user
  - POST `/logout` - Logout a user
  - PATCH `/subscription` - Update user subscription
