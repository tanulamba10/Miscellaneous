const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');


app.set("view engine", "views");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sigma_app',
    password: "Bangtan@07"
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password()
    ];
};

//Home Route
app.get("/", (req, res) => {
    let q = `SELECT count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

//Users Route
app.get("/users", (req, res) => {

    let q = `SELECT * FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.render("allUsers.ejs", { result });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }

});


//Edit Route
app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

//Update Route
app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUserName } = req.body;
    let q = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("WRONG PASSWORD! COULD NOT UPDATE CHANGES");
            } else {
                let q2 = `UPDATE user SET username="${newUserName}" WHERE id="${id}"`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

app.get("/users/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/users", (req, res) => {
    let { username, email, password } = req.body;
    let id = uuidv4();
    console.log(id, username, email, password);
    let q3 = `INSERT INTO user (id, username, email, password) VALUES ("${id}", "${username}", "${email}", "${password}")`;
    try {
        connection.query(q3, (err, result) => {
            if (err) throw err;
            res.redirect("/users");
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

app.get("/users/:id/delete", (req, res) => {
    let { id } = req.params;
    let q5 = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q5, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("delete.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

app.delete("/users/:id/", (req, res) => {
    let { id } = req.params;
    let { email, password } = req.body;
    console.log(email, password);
    let q6 = `SELECT * FROM user WHERE id="${id}"`;
    try {
        connection.query(q6, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            console.log(user);
            if (password != user.password || email != user.email) {
                res.send("WRONG EMAIL & PASSWORD! COULD NOT DELETE USER");
            } else {
                let query = `DELETE FROM user WHERE id="${id}"`;
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error occured in DB");
    }
});

app.listen("8080", () => {
    console.log("Server listening on port 8080");
});



