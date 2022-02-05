const express = require('express');
const router = express.Router();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

require('dotenv').config();
const apiKey = process.env.MAILGUN_API;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: apiKey});


const polls = [{
  id: 1,
  user_id: 2,
  title: "A",
  description: "B",
},
{
  id: 2,
  user_id: 1,
  title: "X",
  description: "Y",
}];

module.exports = (db) => {
  router.get('/login', (req, res) => {
    // req.session.user_id = req.params.id;
    res.redirect('/');
  });

  //GET: New Poll link
  router.get("/create", (req, res) => {
    res.render("new_poll");
  });

  router.post("/create", (req, res) => {
    const formData = req.body.text;
  });

  // Result page
  router.get("/result", (req, res) => {
    res.render("poll_result");
  });

  /**
   * Add new poll
   */
  router.post("/new", (req, res) => {});

  /**
   * Browse all polls
   */
  router.get("/", (req, res) => {
    res.json(polls);
    /*
    //After attaching database:
    db.query(`SELECT * FROM polls;`)
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    */
  });

  /**
   * Read poll with id
   */
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.json(polls[id - 1]);
    /*
    db.query(`SELECT * FROM polls WHERE id = $1;`, [id])
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    */
  });

  /**
   * Edit: User submits poll
   */
  router.post("/:id", (req, res) => { });

  /**
   * Add: User creates a poll
   */


  /**
   * Delete Poll
   */
  router.post("/:id/delete", (req, res) => {
    const id = req.params.id;
  });
  return router;
};
