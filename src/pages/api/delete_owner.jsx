import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function deleteOwner() {
    const { ownerId } = req.body;
    console.log('Used owner ID is: ',ownerId);
    client.connect().then(() => {
      client.owners.delete(ownerId)
        .then(data => {
          console.log(data)
          res.status(200).send(data);
        }).catch(error => {
          res.send(error)
        })
    })
  }
  deleteOwner();
}