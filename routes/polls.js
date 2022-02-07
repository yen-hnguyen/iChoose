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

  /**
   * Add new poll
   */
  router.post("/new", (req, res) => {
    const data = req.body;
    const userID = req.session.userId;
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
      // .then(() => {
      //   const emailMsg = {
      //     from: 'iChoose <yen.hnguyen17@outlook.com>',
      //     to: email,
      //     subject: 'Test',
      //     text: 'Testing mailgun feature',
      //     html: "<h1>Testing mailgun feature</h1>"
      //   };
      //   mg.messages.create(domain, emailMsg)
      //     .then(msg => console.log(msg))
      //     .catch(err => console.log(err));
      // })
      .then(() => {
        console.log("Yay!!!");
        res.redirect(`/polls/${pollKey}/result`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //Browse all polls
  router.get("/", (req, res) => {
  /**
  * Get a total submission points.
  * @param {String}.
  * @return {Promise<{}>} JSON on /polls page.
  */
    const queryString = `SELECT polls.id, polls.description, choices.title AS choice, sum(point) AS total_points
    FROM polls JOIN choices ON polls.id = poll_id
    JOIN submissions ON choices.id = choice_id
    GROUP BY polls.id, choices.title
    ORDER by polls.id DESC;`;
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
   * Poll submission page
   */

  /**
   * Poll result / admin page
   */
  router.get("/:id/result", (req, res) => {
    const pollKey = req.params.id;

    const queryString = `
    SELECT polls.id, polls.title, polls.description, choices.title AS choice, sum(point) AS total_points, count(choice_id) AS num_of_submission,
    polls.admin_link, polls.submission_link
    FROM polls
    JOIN choices ON polls.id = poll_id
    LEFT JOIN submissions ON choices.id = choice_id
    WHERE polls.admin_link LIKE '%${pollKey}%'
    GROUP BY polls.id, choices.title;`;

    db.query(queryString)
      .then(result => {
        const data = result.rows;
        const title = data[0].title;
        const description = data[0].description;
        const pollOptions = [];
        const responses = data[0].num_of_submission;
        const admin_link = data[0].admin_link;
        const submission_link = data[0].submission_link;

        data.forEach(obj => {
          pollOptions.push(obj.choice);
        });
        
        const templateVars = {
          pollTitle: title,
          pollDescription: description,
          pollChoices: pollOptions,
          responses: responses,
          admin_link: admin_link,
          submission_link: submission_link
        };

        res.render("poll_result", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  /**
   * Delete Poll
   */
  router.post("/:id/delete", (req, res) => {
    const pollKey = req.params.id;
  });
  return router;
};
