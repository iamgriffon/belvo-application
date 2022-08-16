import { client } from '../../services/belvoClient';
import { mongoClient } from '../../services/mongodb';

export default function (req, res) {
  const mongo = mongoClient.db('belvo_sandbox');
  const collection = mongo.collection('links');

  async function deleteLink() {

    const { link, institution } = req.body;
    console.log('Used link is: ', link)

    //Belvo API Part
    const belvoData = client.connect().then(async () => {
      const response = await client.links.delete(link)
        .then(data => {
          console.log(data)
          return data;
        }).catch(error => {
          res.send(error)
        })
      console.log('Delete Response', response)
      return response;
    });

    //MongoDB CRUD Part
    if (belvoData) {
      const itsOnDB = async () => await collection.findOne({
        institution
      });

      itsOnDB();
      if (itsOnDB != null) {
        await collection.deleteOne({ institution: institution },
        ).then(data => res.status(204).send({
          deleted_on_belvo: true,
          deleted_on_mongo: data
        }))
      }
    }
  }
  deleteLink();
}