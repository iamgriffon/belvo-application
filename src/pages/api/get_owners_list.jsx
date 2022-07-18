import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function listOwners() {
    client.connect()
      .then(() => {
        client.owners.list()
          .then(response => {
            res.send(response.slice(10,20))
          })
          .catch(error => {
            res.send(error);
          });
      });
  }
  listOwners();
}

