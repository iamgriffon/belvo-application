import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function listOwners() {
    await client.connect()
      .then(() => {
        client.owners.list({limit: 10})
          .then(data => {
            res.send(data);
          })
          .catch(error => {
            res.status(400).send(error);
          });
      });
  }
  listOwners();
}

