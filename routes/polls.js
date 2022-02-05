const express = require('express');
const router = express.Router();
// const formData = require('form-data');
const Mailgun = require('mailgun.js');

require('dotenv').config();
const apiKey = process.env.MAILGUN_API;
const domain = process.env.MAILGUN_DOMAIN;
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({username: 'api', key: apiKey});


module.exports = (db) => {


  //GET: New Poll link
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  router.post("/new", (req, res) => {
    const formData = req.body.text;
  });

  // Result page
  router.get("/result", (req, res) => {
    res.render("poll_result");
  });

  /**
   * Add new poll
   */
  router.post("/new", (req, res) => { });

  //Browse all polls
  router.get("/", (req, res) => {
  /**
  * Get a total submission points.
  * @param {String}.
  * @return {Promise<{}>} JSON on /polls page.
  */
    const queryString = `SELECT polls.id, polls.description, choices.description AS choice, sum(point) AS total_points
    FROM polls JOIN choices ON polls.id = poll_id
    JOIN submissions ON choices.id = choice_id
    GROUP BY polls.id, choices.description;`;
    db.query(queryString)
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

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
