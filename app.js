const express = require("express");
const app = express();
let port = process.env.port || 3000;
const mysql = require("mysql2");

const urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "books", //your database
  password: "" // your password
});

app.post("/book", urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400).send("wrong action");
  let {
    id,
    title,
    pageCount,
    publishedDate,
    thumbnailUrl,
    shortDescription,
    longDescription,
    status,
    authors
  } = req.body;
  let inpPubDate = JSON.stringify(publishedDate);
  let inpAuthor = JSON.stringify(authors);
  //add your table into query
  pool.query(
    "INSERT INTO books(id, title, pageCount,publishedDate,thumbnailUrl,shortDescription, longDescription, status,authors) VALUES(?,?,?,?,?,?,?,?,?)",
    [
      id,
      title,
      pageCount,
      `${inpPubDate}`,
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      `${inpAuthor}`
    ],
    function(err, data) {
      if (err) return console.log(err);
      res.send("success added data");
    }
  );
});

app.get("/book/:id", function(req, res) {
  const id = req.params.id;
  //add your table into query
  pool.query("SELECT * FROM books WHERE id=?", [id], function(err, data) {
    if (err) return console.log(err);
    res.send(data);
  });
});

app.put("/book/:id", function(req, res) {
  if (!req.body) return res.sendStatus(400);
  let {
    id,
    title,
    pageCount,
    publishedDate,
    thumbnailUrl,
    shortDescription,
    longDescription,
    status,
    authors
  } = req.body;
  let inpPubDate = JSON.stringify(publishedDate);
  let inpAuthor = JSON.stringify(authors);

  pool.query(
    //add your table into query
    "UPDATE books SET title=?,pageCount=?,publishedDate=?,thumbnailUrl=?,shortDescription=?,longDescription=?,status=?, authors=? WHERE id=?",
    [
      title,
      pageCount,
      `${inpPubDate}`,
      thumbnailUrl,
      shortDescription,
      longDescription,
      status,
      `${inpAuthor}`,
      id
    ],
    function(err, data) {
      if (err) return console.log(err);
      res.send("success updated");
    }
  );
});
app.delete("/book/:id", function(req, res) {
  const id = req.params.id;
  //add your table into query
  pool.query("DELETE FROM books WHERE id=?", [id], function(err, data) {
    if (err) return console.log(err);
    res.send("success deleted");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
