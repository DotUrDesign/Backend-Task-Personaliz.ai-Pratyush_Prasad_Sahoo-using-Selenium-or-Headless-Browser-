const express = require('express');
const contactRoute = express.Router();
const {createContact, getContact, updateContact, deleteContact} = require('../controllers/crud.js');

contactRoute
.route('/createContact')
.post(createContact);

contactRoute
.route('/getContact')
.get(getContact);

contactRoute
.route('/updateContact')
.post(updateContact);

contactRoute
.route('/deleteContact')
.post(deleteContact);

module.exports = contactRoute;
