const express = require('express');
const router = express.Router();

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

  router.get("/new", (req, res) => {
    res.render("index_new");
  });

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
