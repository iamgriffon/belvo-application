import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function deleteTransaction() {
    const { transactionId } = req.body;
    console.log('Used owner ID is: ',transactionId);
    client.connect().then(() => {
      client.transactions.delete(transactionId)
        .then(data => {
          console.log(data)
          res.status(200).send(data);
        }).catch(error => {
          res.send(error)
        })
    })
  }
  deleteTransaction();
}