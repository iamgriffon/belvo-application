import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function getTransactions() {
    const { date1, date2, link } = req.body;
    console.log(req.body);
    client.connect()
      .then(() => {
        client.transactions.retrieve(link, date1, { 'dateTo': date2 })
          .then(data => {
            console.log(data)
            res.send(data)
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  getTransactions();
}