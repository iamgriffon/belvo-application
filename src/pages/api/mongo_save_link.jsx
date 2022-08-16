import { mongoClient } from "../../services/mongodb";

export default async function (req, res) {
  try {
    const { link, institution } = req.body;

    const client = mongoClient.db('belvo_sandbox');
    const collection = client.collection('links');

    const itsOnDB = async () => await collection.findOne({
      institution
    });

    itsOnDB();

    if (itsOnDB != null) {
      await collection.updateOne(
        { institution: institution },
        { $setOnInsert: { institution, link } },
        { upsert: true }
      ).then(async () => {
        const query = await collection.findOne({ institution: institution });
        res.send(query);
      });
    }
  } catch (err) {
    console.log(err)
  }
}