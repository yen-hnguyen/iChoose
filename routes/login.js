const express = require('express');
const router = express.Router();

const users = [{ id: 1, name: "Michael", email: "michael@gmail.com" },
{ id: 1, name: "Michael", email: "michael@gmail.com" },
{ id: 2, name: "Merwyn", email: "merwyn@gmail.com" },
{ id: 3, name: "Yen", email: "yen@gmail.com" },
{ id: 4, name: "Charlotte", email: "charlotte@gmail.com" },
{ id: 5, name: "Michelle", email: "michelle@gmail.com" },
{ id: 6, name: "Tony", email: "tony@gmail.com" },
{ id: 7, name: "Sandeep", email: "sandeep@gmail.com" },
{ id: 8, name: "Chetna", email: "chetna@gmail.com" },];

module.exports = () => {

  router.post("/", (req, res) => {
    console.log(req.body.email);
    const email = req.body.email;
    let id;
    for (const i of users) {
      if (i.email === email) {
        console.log(i.id);
        id = i.id;
        req.session.userId = id;
        console.log(req.session);
        return res.redirect("/");
      }
    }
    res.render("login");
  });


  return router;
};
