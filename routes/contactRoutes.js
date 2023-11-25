const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
const {getContacts,getContact,createContact,updateContact,deleteContact} = require("../controllers/contactControllers")

// even router can use middleware...here we only want  validated users to access the routes so we can use middle ware for routes
router.use(validateToken);
router.route("/").get(getContacts);

// :id is a path parameter. NOTE that it is different from query parameter
router.route("/:id").get(getContact);

router.route("/").post(createContact);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);
module.exports = router;