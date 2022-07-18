import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function retrieveOwner() {
    const { link } = req.body;
    console.log('Used link is: ', link)
    client.connect()
      .then(() => {
        client.owners.retrieve(link)
          .then(response => {
            res.send(response)
          })
          .catch(error => {
            res.send(error);
          });
      });
  }
  retrieveOwner();
}
