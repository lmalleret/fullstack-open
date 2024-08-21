import express from "express";
import qs from "qs";
import { calculateBmi } from "./bmiCalculator";
const app = express();
app.set("query parser", (str: string) =>
  qs.parse(str, {
    /* custom options */
  })
);

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  if (req.query.height && req.query.weight) {
    res.send({
      weight: req.query.weight,
      height: req.query.height,
      bmi: calculateBmi(
        Number(req.query.height) / 100,
        Number(req.query.weight)
      ),
    });
  } else {
    res.send({
      error: "malformatted parameters",
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
