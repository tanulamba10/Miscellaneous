const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "tanu",
        content: "I love to dance and sing, music lifts my mood!"
    },
    {
        id: uuidv4(),
        username: "namrata",
        content: "I love to write and sketch, being creative is in my blood indeed!"
    },
    {
        id: uuidv4(),
        username: "kunal",
        content: "I love to play sports and football is my favorite one!"
    }
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.patch("/posts/:id", (req, res) => {
    let { id } = req.params;
    let newContent = req.body.content;
    console.log(newContent);
    let post = posts.find((post) => id === post.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let post = posts.find((post) => id === post.id);
    console.log(post);
    res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((post) => id === post.id);
    console.log(post);
    res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((post) => id !== post.id);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});