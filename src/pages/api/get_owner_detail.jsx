import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function getOwnerDetail() {
    const { ownerId } = req.body;
    console.log('Used link is: ', ownerId)
    client.connect()
      .then(() => {
        client.owners.detail(ownerId)
          .then(response => {
            res.send(response)
          })
          .catch(error => {
            res.send(error);
          });
      });
  }
  getOwnerDetail();
}