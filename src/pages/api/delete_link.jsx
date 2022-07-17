import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function deleteLink() {
    const { link } = req.body;
    console.log('Used link is: ',link)
    client.connect().then(() => {
      client.links.delete(link)
        .then(data => {
          console.log(data)
          res.status(200).send({'Successfully Deleted': data});
        }).catch(error => {
          res.send(error)
        })
    })
  }
  deleteLink();
}