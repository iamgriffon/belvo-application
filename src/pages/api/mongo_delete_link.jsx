import { mongoClient } from '../../services/mongodb';

export default function (req, res) {
  const mongo = mongoClient.db('belvo_sandbox');
  const collection = mongo.collection('links');

  async function deleteLink() {

    const { institution } = req.body;
    console.log('Used Institution is: ', institution)

    const itsOnDB = async () => await collection.findOne({
      institution
    });

    itsOnDB();

    if (itsOnDB != null) {
      await collection.deleteOne({ institution: institution },
      ).then(data => res.status(204).send({
        'User has also been deleted in MongoDB': true,
        'payload': data
      }))
    }
  }
  deleteLink();
}

