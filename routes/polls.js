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
    INSERT INTO polls (user_id, email, title, description, admin_link, submission_link)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;

    const queryValues = [
      userID, email, title, description, admin_link, submission_link
    ];

    db.query(queryString, queryValues)
      .then(data => {
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
          subject: '🗳 You just created a new poll!!! 🗳',
          html:  `
          Hey!! 👋
          <p>You just created a new poll called <strong>${title}</strong>...Now what? 🤗
          <br>
          Here is the submission link: ${submission_link} Share it with your group
          <br>
          Wanna check out the result and see how many people voted? Follow this link: ${admin_link}
          <br>
          Have fun voting!</p>
          iChoose Team with 🤍`
        };
        mg.messages.create(domain, emailMsg)
          .then(msg => console.log(msg))
          .catch(err => console.log(err));
      })
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
  router.get("/info", (req, res) => {
  /**
  * Get a total submission points.
  * @param {String}.
  * @return {Promise<{}>} JSON on /polls page.
  */
    const queryString = `SELECT polls.id, polls.description, choices.title AS choice, sum(point) AS total_points
    FROM polls JOIN choices ON polls.id = poll_id
    JOIN submissions ON choices.id = choice_id
    GROUP BY polls.id, choices.title
    ORDER by polls.id DESC
    LIMIT 12;`;
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
  router.get("/:id", (req, res) => {
    const id = req.params.id;

    const queryString = `SELECT polls.title AS poll_title, polls.description, choices.title AS choices, choices.id AS choice_id
    FROM polls
    JOIN choices on poll_id = polls.id
    WHERE polls.admin_link LIKE $1;`;
    const queryValues = [`%${id}%`];
    db.query(queryString, queryValues)
      .then(data => {
        const polls = data.rows;

        const templateVars = {
          title: polls[0].poll_title,
          description: (polls[0].description),
          choices: [polls[0].choices, polls[1].choices, polls[2].choices, polls[3].choices],
          choice_id: [polls[0].choice_id, polls[1].choice_id, polls[2].choice_id, polls[3].choice_id]
        };
        console.log(templateVars);
        res.render("poll_submission", templateVars);
      });
  });

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
        const total_points = [];
        data.forEach(obj => {
          total_points.push(obj.total_points);
        });

        data.forEach(obj => {
          pollOptions.push(obj.choice);
        });

        const templateVars = {
          pollTitle: title,
          pollDescription: description,
          pollChoices: pollOptions,
          responses: responses,
          admin_link: admin_link,
          submission_link: submission_link,
          pollKey: pollKey,
          total_points
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
   * Search polls
   */
  router.post("/search", (req, res) => {
    const search = req.body.search;
    console.log(search);
    const searchString = search.replace(search[0], "");
    console.log(searchString);
    const queryParams = [`%${searchString}%`]

    const queryString = `SELECT * FROM polls
    WHERE title LIKE $1
    OR description LIKE $1;`;

    db.query(queryString, queryParams)
      .then(data => {
        const templateVars = {polls: data.rows }
        for (const i of templateVars.polls) {
          let sub_link_id = i.submission_link.replace("http://localhost:8080/polls/", "");
          i.sub_link_id = sub_link_id;
        }
        console.log(templateVars);
        res.render( 'poll_search', templateVars );
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })

  /**
   * submit votes page
   */

  router.post("/:id", (req, res) => {
    const pollKey = req.params.id;
    const votes = req.body.ranking.split(',');
    const choicesID = [];
    const queryParams = [];
    const queryValues = [];
    let userVotes = votes.map(id => Number(id));
    let points = userVotes.length;
    let i = 1;

    const queryString = `
    SELECT polls.title AS poll_title, admin_link, submission_link, email, choices.id AS choice_id, choices.title AS choices
    FROM polls
    JOIN choices ON poll_id = polls.id
    WHERE polls.submission_link LIKE $1;`;

    const promises = db.query(queryString, [`%${pollKey}%`]);
    promises
      .then(result => {
        const data = result.rows;

        data.forEach(obj => {
          choicesID.push(obj.choice_id);
        });

        for (const id of userVotes) {
          queryValues.push(id, points);
          queryParams.push(`($${i}, $${i + 1})`);
          points--;
          i += 2;
        }

        let queryString2 = `
        INSERT INTO submissions (choice_id, point)
        VALUES `;

        queryString2 += queryParams.join(", ") + ";";

        db.query(queryString2, queryValues);
        return result;
      });
    promises.then((result) => {
      const data = result.rows;
      const title = data[0].poll_title;
      const admin_link = data[0].admin_link;
      const email = data[0].email;

      const emailMsg = {
        from: 'iChoose <yen.hnguyen17@outlook.com>',
        to: email,
        subject: '🌟 Someone just voted on your poll 🌟',
        html:  `
        Hey!! 👋
        <p>Someone voted on your <strong>${title}</strong> poll 🙌
        <br>
        Wanna check out the result and see how many people voted? Follow this link: ${admin_link}
        <br>
        Have fun!</p>
        iChoose Team with 🤍`
      };
      mg.messages.create(domain, emailMsg)
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
    })
      .then(() => {
        console.log("Yes!");
        res.redirect(`/polls/${pollKey}/result`);
      });
  });


  /**
   * Delete Poll
   */
   router.post("/:id/delete", (req, res) => {
    const id = req.params.id;
    const queryString = `DELETE FROM polls WHERE polls.id = ${id}`;

    db.query(queryString)
      .then(data => {
    res.redirect('/polls')
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });



  router.get("/", (req, res) => {
  /**
  * Get all polls.
  * @param {String}.
  * @return {Promise<{}>}
  */

    const queryString = `SELECT * FROM polls`;

    db.query(queryString)
      .then(data => {
        const templateVars = {polls: data.rows }
        for (const i of templateVars.polls) {
          let sub_link_id = i.submission_link.replace("http://localhost:8080/polls/", "");
          i.sub_link_id = sub_link_id;
        }
        console.log(templateVars);
        res.render( 'my_polls', templateVars );
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });


  return router;
};
