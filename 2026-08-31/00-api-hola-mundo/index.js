import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Ruta raiz");
});

app.get("/saludo", (req, res) => {
  res.send("Hola mundo (GET)");
});

app.post("/saludo", (req, res) => {
  res.status(403).send("Hola mundo (POST)");
});

app.get("/arreglo", (req, res) => {
  res.send(["hola", { message: "texto" }, 25]);
});

app.get("/objeto", (req, res) => {
  res.send({ nombre: "Pepe", apellido: "Sanchez", edad: 33 });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
