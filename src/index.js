const express = require("express");
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = 3000;

const swaggerDocument = require("./tasks/swagger.json");
const tasksRoute = require("./tasks/tasks.route.js");

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/tasks", tasksRoute.router);
app.use("/stats", tasksRoute.statsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
