import { mongoClient } from "../../services/mongodb";

export default async function (req, res) {
  try {
    const { institution, access_mode, created_at, status, id, created_by } = req.body;

    const client = mongoClient.db('belvo_sandbox');
    const collection = client.collection('links');

    const itsOnDB = async () => await collection.findOne({
      institution
    });

    itsOnDB();

    if (itsOnDB != null) {
      await collection.findOneAndUpdate(
        { institution: institution },
        { $set: { id, access_mode, created_at, external_id: `external_id_${id}`, status, created_by } }
      ).then(async () => {
        const query = await collection.findOne({ institution: institution });
        res.send(query);
      });
    }
  } catch (err) {
    console.log(err)
  }
}