import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function deleteAccount() {
    const { accountId } = req.body;
    console.log('Used account ID is: ',accountId);
    client.connect().then(() => {
      client.accounts.delete(accountId)
        .then(data => {
          console.log(data)
          res.status(200).send(data);
        }).catch(error => {
          res.send(error)
        })
    })
  }
  deleteAccount();
}