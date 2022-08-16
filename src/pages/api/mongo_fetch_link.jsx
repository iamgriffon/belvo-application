import { mongoClient } from "../../services/mongodb";

export default async function (req, res) {
  try {
    const { institution } = req.body;

    const client = mongoClient.db('belvo_sandbox');
    const collection = client.collection('links');

    await collection.findOne({
      institution: institution,
    })
    .then(response => {
      res.status(200).send(response)
    })
  } catch (err) {
    res.send(err)
  }
}