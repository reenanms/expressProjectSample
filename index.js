const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
var reqCounter = 0;

function checkProjectIdExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) return res.status(400).json({ error: "id is required" });
  return next();
}

function requisitionCounter(req, res, next) {
  reqCounter++;
  console.log("requisition counter: " + reqCounter);
  return next();
}

server.use(requisitionCounter);

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id: id, title: title, tasks: [] });
  return res.send();
});

server.post("/projects/:id/:tasks", checkProjectIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.send();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.send();
});

server.delete("/projects/:id", checkProjectIdExist, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  projects.splice(index, 1);
  return res.send();
});

server.listen(3000);
