const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
// const { generateRandomString } = require('/scripts/helpers.js');

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
  //GET: New Poll link
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  router.post("/new", (req, res) => {
    const data = req.body;

    const userID = 1; // use cookie session to retrieve this
    const title = data.poll_title;
    const description = data.description;
    const email = data.email;
    const pollOptions = data.poll_options;
    const admin_link = `http://localhost:8080/polls/result`; // should we add poll id here? random string
    const submission_link = `http://localhost:8080/polls`;

    const queryString = ` 
    INSERT INTO polls (user_id, title, description, admin_link, submission_link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  
    const queryParams = [
      userID, title, description, admin_link, submission_link
    ];
    
    db.query(queryString, queryParams)
      .then(data => {
        console.log(data.rows[0]);
        return data.rows[0];
      })
      .then(poll => {
        const poll_id = poll.id;
        const queryParams = [];
        const queryValues = [];
        const values = [];
        let i = 0;

        for (const option of pollOptions) {
          queryValues.push(option);
          values.push(`$${queryValues.length}`);
        }
        console.log(queryValues);
        console.log(values);
        const queryString = `
        INSERT INTO choices (poll_id, title)
        VALUES $1`;

        while (i < values.length) {
          db.query(queryString, [queryValues[i]]);
          console.log(queryString, [queryValues[i]]);
          i++;
        }
        console.log("I did it");
      })
      .then(() => {
        console.log("Yay");
        res.render("poll_result");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Result page
  // router.get("/result", (req, res) => {
  //   res.render("poll_result");
  // });

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
  // router.post("/:id", (req, res) => { });

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
