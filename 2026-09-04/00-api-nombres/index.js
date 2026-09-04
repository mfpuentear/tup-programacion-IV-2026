import express from "express";

const app = express();

// Para recibir formato json en el body
app.use(express.json());

const nombres = ["Juan", "Pepe", "Alfonso", "Adolfina"];

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

// Consulta de todos los nombre
app.get("/nombres", (req, res) => {
  res.send(nombres);
});

// Consulta de un nombre empleando parametro de ruta
app.get("/nombres/:index", (req, res) => {
  const index = parseInt(req.params.index);
  // Si index no es un numero o negativo avisar que es una mala peticion
  if (isNaN(index) || index < 0) {
    return res.status(400).send("");
  }
  // Si index trata de acceder a un elemento fuera del arreglo avisar que no se encuentra
  if (index >= nombres.length) {
    return res.status(404).send("");
  }
  res.send(nombres[index]);
});

// Agregar un nuevo nombre al arreglo
app.post("/nombres", (req, res) => {
  const nombre = req.body.nombre;
  // Validar campos
  nombres.push(nombre);
  res.status(201).send(nombre);
});

// Modificar un nombre del arreglo
app.put("/nombres/:index", (req, res) => {
  // Indice como parametro de ruta
  const index = parseInt(req.params.index);
  // Si index no es un numero o negativo avisar que es una mala peticion
  if (isNaN(index) || index < 0) {
    return res.status(400).send("");
  }
  // Si index trata de acceder a un elemento fuera del arreglo avisar que no se encuentra
  if (index >= nombres.length) {
    return res.status(404).send("");
  }

  // Nuevo nombre en el body
  const nombre = req.body.nombre;
  nombres[index] = nombre;
  res.send(nombre);
});

// Quitar nombre del arreglo
app.delete("/nombres/:index", (req, res) => {
  // Indice como parametro de ruta
  const index = parseInt(req.params.index);
  // Si index no es un numero o negativo avisar que es una mala peticion
  if (isNaN(index) || index < 0) {
    return res.status(400).send("");
  }
  // Si index trata de acceder a un elemento fuera del arreglo avisar que no se encuentra
  if (index >= nombres.length) {
    return res.status(404).send("");
  }

  nombres.splice(index, 1);

  res.send("");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
