import express from "express";
const router = express.Router();
import { SomethingModel } from "../models/Something";

router.get("/", async (req, res) => {
  try {
    const somethings = await SomethingModel.find().sort({ date: -1 }).limit(20);
    res.json(somethings);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const something = new SomethingModel(req.body);
  something.date = Date.now();

  something
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

module.exports = router;
