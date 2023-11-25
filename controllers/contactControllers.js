const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");


//@desc get all contacts
//@route get /api/contacts
//@acess private

const getContacts =asyncHandler(async (req,res)=>{
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

//@desc get specific contact
//@route get /api/contacts/:id
//@acess private
const getContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id)
    {
        res.status(403);
        throw new Error("Contact not accessible !!")
    }
    res.status(200).json(contact);
});

//@desc Create new contact
//@route post /api/contacts
//@acess private
const createContact =asyncHandler(async (req,res)=>{
    console.log(req.body);
    const {name,email,phone} = req.body;
    if(!name || !email || !phone)
    {
        res.status(400);
        throw new Error("All fields required");
    }
    const contact = await Contact.create({
        // in ES6 if key and val are same then we can use just the key
        name,
        email,
        phone,
        user_id: req.user.id, // note that jwt middleware decoded the token and added req.user property
    })
    res.status(201).json(contact);
});

//@desc delete contact
//@route delete /api/contacts/:id
//@acess private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Contact not accessible !!");
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json({ "message": `Delete contact for ${req.params.id}` });
});



//@desc update contact
//@route put /api/contacts/:id
//@acess private
const updateContact =asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact not found");
    }
    if(contact.user_id.toString() !== req.user.id)
    {
        res.status(403);
        throw new Error("Contact not accessible !!")
    }
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(200).json(updatedContact);

});

module.exports = {getContacts,getContact,createContact,updateContact,deleteContact};