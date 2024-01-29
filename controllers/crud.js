const emailValidator = require('email-validator');
const axios = require('axios');
const pool = require('../db.js');
require('dotenv').config();
const API_TOKEN = process.env.API_TOKEN;
const API_URL = process.env.API_URL;

module.exports.createContact = async function createContact(req, res){
    try {
        
        let {
            first_name, 
            last_name,
            email, 
            mobile_number,
            data_store
        } = req.body;

        // validate the email - using a NPM package named "email-validator".
        let validEmail = emailValidator.validate(email);
        if(!validEmail){
            return res.status(403).send("Please enter a valid email!");
        }

        // console.log(first_name, last_name, email, mobile_number, data_store);
        
        if(data_store === "CRM")
        {
            const apiUrl = API_URL;
            const apiToken = `Token token=${API_TOKEN}`; 
            let emails = email;
            const requestData = {
                contact : {
                    first_name,
                    last_name,
                    email,
                    mobile_number
                },
            };
            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Authorization' : apiToken,
                    'Content-Type' : 'application/json'
                },
            });
            
            const createdContact = response.data.contact;
            console.log(createdContact);

            return res.status(200).json({
                message : "Contact created successfully",
                contactDetails : createdContact
            })
        }
        else if(data_store === "DATABASE")
        {
            const query = "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES ($1, $2, $3, $4) RETURNING * ";
            await pool.query(
                    query, 
                    [first_name, last_name, email, mobile_number],
                    (err, results) => {
                        if(err){
                            console.log("Error creating contact in database " + err.message);
                            return res.status(500).send("Internal server error");
                        }
                        else{
                            console.log("Contact created successfully");
                            return res.status(200).json({
                                message : "Contact created successfully",
                                contactDetails : results.rows[0]
                            })
                        }
                    }
                );
        }
        else 
        {
            return res.status(400).send("Invalid data_store paramter");
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.getContact = async function getContact(req, res){
    try {
        
        let {
            contact_id,
            data_store
        } = req.body;

        if(data_store === "CRM")
        {
                const apiUrl = `${API_URL}/${contact_id}`;
                const apiToken = `Token token=${API_TOKEN}`;

                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': apiToken,
                        'Content-Type': 'application/json',
                      },    
                });
            
            const contact = response.data.contact;

            return res.status(200).json({
                message : "Contact fetched successfully",
                contactDetails : contact
            })
        }
        else if(data_store === "DATABASE")
        {
            let query = "SELECT * FROM contacts WHERE contact_id = $1";
            await pool.query(
                query,
                [contact_id],
                (err, results) => {
                    if(err){
                        console.log("Error fetching contact from database " + err.message);
                        return res.status(500).send("Internal server error");
                    }
                    else{
                        console.log("Contact fetched successfully");
                        return res.status(200).json({
                            message : "Contact fetched successfully",
                            contactDetails : results.rows
                        })
                    }
                }
            )
        }
        else 
        {
            return res.status(400).send("Invalid data_store paramter");
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports.updateContact = async function updateContact(req, res){
    try {
        
        let dataToBeUpdated = req.body;
        let {
            contact_id,
            email,
            mobile_number,
            data_store
        } = req.body;

        console.log(dataToBeUpdated);
        
        for(let key in dataToBeUpdated)
            console.log(key, dataToBeUpdated[key]);

        let validEmail = emailValidator.validate(email);
        if(!validEmail){
            return res.status(403).send("Please enter a valid email");
        }

        if(data_store === "CRM")
        {
            const apiUrl = `${API_URL}/${contact_id}`;
            const apiToken = `Token token=${API_TOKEN}`;

            const requestData = {
                contact : {
                    email : email,
                    mobile_number : mobile_number
                }
            };

            const response = await axios.put(apiUrl, requestData, {
                headers : {
                    'Authorization' : apiToken,
                    'Content-Type' : 'application/type'
                }
            });

            console.log(response.data.contact);
        }
        else if(data_store === "DATABASE")
        {
            console.log("Hello");
            let arrayQuery = [], arrayValues = [];
            arrayValues.push(contact_id);
            let count = 2;
            for(let key in dataToBeUpdated)
            {
                if(key === "data_store")
                    continue;
                arrayQuery.push(`${key} = $${count}`);
                arrayValues.push(dataToBeUpdated[key]);
                count++;
            }
            
            let query = `UPDATE contacts SET ${arrayQuery.join(", ")} WHERE contact_id = $1 RETURNING *`;
            await pool.query(
                query,
                arrayValues,
                (err, results) => {
                    if(err){
                        console.log("Error in updating the value of the contact " + err.message);
                        return res.status(500).send("Internal Server error");
                    }
                    else {
                        console.log("Contact updated successfully");
                        return res.status(200).json({
                            message : "Contact updated successfully",
                            contactDetails : results.rows
                        })
                    }
                }
            );

        }
        else
        {
            return res.status(400).send("Invalid data_store parameter");
        }

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.deleteContact = async function deleteContact(req, res){
    try {
        
        let {
            contact_id,
            data_store
        } = req.body;

        if(data_store === "CRM")
        {
            const apiUrl = `${API_URL}/${contact_id}`;
            const apiToken = `Token token=${API_TOKEN}`;

            const response = await axios.delete(apiUrl, {
                headers : {
                    "Authorization" : apiToken,
                    "Content-Type" : "application/json"
                }
            });

            return res.status(200).send("Contact deleted successfully");
        }
        else if(data_store === "DATABASE")
        {
            await pool.query(
                "DELETE FROM contacts WHERE contact_id = $1",
                [contact_id],
                (err, results) => {
                    if(err){
                        console.log("Error in deleting the contact");
                        return res.status(500).send("Internal server error");
                    }
                    else{
                        return res.status(200).send("Contact deleted successfully");
                    }
                }
            );
        }
        else
        {
            return res.status(400).send("Invalid data_store parameter");
        }

    } catch (error) {
        console.log(error);
    }
}

