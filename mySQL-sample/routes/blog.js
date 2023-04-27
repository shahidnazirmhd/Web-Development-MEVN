const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
    const query = `select posts.*, authors.name as authorname from posts 
    inner join authors on posts.authorid = authors.id`;
    const [result] = await db.query(query);
    res.render("posts-list", { posts: result });
});

router.get("/new-post", async function (req, res) {
    const [result] = await db.query("select * from authors");
    res.render("create-post", { authors: result });
});

router.post("/posts", async function (req, res) {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ];
    await db.query("insert into posts (title, summary, body, authorid) values (?)", [data]);
    res.redirect("/posts");
});

router.get("/posts/:postid", async function (req, res) {
    const query = `select posts.*, authors.name as authorname, authors.email from posts
    inner join authors on posts.authorid = authors.id
    where posts.id = ?`;
    const [result] = await db.query(query, [req.params.postid]);

    if (!result || result.length === 0) {
        return res.status(404).render("404");
    }

    const resultdata = {
        ...result[0],
        date: result[0].date.toISOString(),
        humanReadableDate: result[0].date.toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    };

    res.render("post-detail", { post: resultdata });
});

router.get("/posts/:postid/edit", async function (req, res) {
    const [result] = await db.query("select * from posts where id = ?", [req.params.postid]);

    if (!result || result.length === 0) {
        return res.status(404).render("404");
    }

    res.render("update-post", { post: result[0] });
});

router.post("/posts/:postid/edit", async function (req, res) {
    const query = `update posts set title = ?, summary = ?, body = ?
    where id = ?`;
    await db.query(query, [req.body.title, req.body.summary, req.body.content, req.params.postid]);
    res.redirect("/posts");
});

router.post("/posts/:postid/delete", async function (req, res) {
    await db.query("delete from posts where id = ?", [req.params.postid]);
    res.redirect("/posts");
});


module.exports = router;