import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function getAccountInfo() {
    const { link } = req.body;
    console.log('Used account ID is: ',link)
    client.connect().then(() => {
      client.accounts.list({limit: 10})
        .then(data => {
          res.status(200).send(data)
        }).catch(error => {
          res.send(error)
        })
    })
  }
  getAccountInfo();
}