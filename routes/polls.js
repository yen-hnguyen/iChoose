const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
// const { generateRandomString } = require('./public/scripts/helpers');

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

const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};


module.exports = (db) => {
  //GET: New Poll link
  // router.get("/polls/new", (req, res) => {
  //   res.render("new_poll");
  // });

  router.post("/new", (req, res) => {
    const data = req.body;

    const userID = 1; // use cookie session to retrieve this
    const title = data.poll_title;
    const description = data.description;
    const email = data.email;
    const pollOptions = data.poll_options;
    const pollKey = generateRandomString();
    const admin_link = `http://localhost:8080/polls/${pollKey}/result`;
    const submission_link = `http://localhost:8080/polls/${pollKey}`;

    const queryString = ` 
    INSERT INTO polls (user_id, title, description, admin_link, submission_link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  
    const queryValues = [
      userID, title, description, admin_link, submission_link
    ];
    
    db.query(queryString, queryValues)
      .then(data => {
        console.log(data.rows[0]);
        return data.rows[0];
      })
      .then(poll => {
        const poll_id = poll.id;
        const queryParams = [];
        const queryValues = [];
        let i = 1;

        for (const option of pollOptions) {
          queryValues.push(poll_id, option);
          queryParams.push(`($${i}, $${i + 1})`);
          i += 2;
        }

        let queryString = `
        INSERT INTO choices (poll_id, title)
        VALUES `;

        queryString += queryParams.join(", ") + ";";

        db.query(queryString, queryValues);
      })
      .then(() => {
        const emailMsg = {
          from: 'iChoose <yen.hnguyen17@outlook.com>',
          to: email,
          subject: 'Test',
          text: 'Testing mailgun feature',
          html: "<h1>Testing mailgun feature</h1>"
        };
        mg.messages.create(domain, emailMsg)
          .then(msg => console.log(msg))
          .catch(err => console.log(err));
      })
      .then(() => {
        console.log("Yay!!!");
        res.redirect('/');
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
