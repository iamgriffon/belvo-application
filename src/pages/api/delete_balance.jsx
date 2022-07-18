import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function deleteBalance() {
    const { balanceId } = req.body;
    console.log('Used owner ID is: ', balanceId);
    client.connect().then(() => {
      client.balances.delete(balanceId)
        .then(data => {
          console.log(data)
          res.status(200).send(data);
        }).catch(error => {
          res.send(error)
        })
    })
  }
  deleteBalance();
}