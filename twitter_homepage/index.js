const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let tweets = [
    {
        "id": uuidv4(),
        "username": "tanulamba",
        "myTweet": "Did anyone watch the kalki trailer? I bet it's another flop!!!"
    },
    {
        "id": uuidv4(),
        "username": "namrata_onlyone",
        "myTweet": "I sometimes get so angry when someone has their birthday on the same as mine. God it's supposed to be my day, only mine right?"
    },
    {
        "id": uuidv4(),
        "username": "kunigami",
        "myTweet": "Who's with me for a new anime edit collab, shall we do tanjiro one this time?"
    }
];

app.get("/tweets", (req, res) => {
    res.render("index.ejs", { tweets });
});

app.get("/tweets/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/tweets", (req, res) => {
    console.log(req.body);
    let { username, myTweet } = req.body;
    let id = uuidv4();
    tweets.push({ id, username, myTweet });
    res.redirect("/tweets");
});

app.get("/tweets/:id", (req, res) => {
    console.log(req.params);
    let { id } = req.params;
    console.log(id);
    let tweet = tweets.find((tweet) => tweet.id === id);
    console.log(tweet);
    res.render("retweet.ejs", { tweet });
});

app.get("/tweets/:id/edit", (req, res) => {
    let { id } = req.params;
    let tweet = tweets.find((tweet) => tweet.id === id);
    console.log(tweet);
    res.render("edit.ejs", { tweet });
});

app.patch("/tweets/:id", (req, res) => {
    let { id } = req.params;
    let newTweet = req.body.myTweet;
    let tweet = tweets.find((tweet) => tweet.id === id);
    tweet.myTweet = newTweet;
    console.log(tweet);
    res.redirect("/tweets");

});

app.delete("/tweets/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    tweets = tweets.filter((tweet) => id !== tweet.id);
    res.redirect("/tweets");
});

app.listen(port, (req, res) => {
    console.log(`listening to post ${port}`);
});