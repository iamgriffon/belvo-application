import { client } from '../../services/belvoClient'

export default function (req, res) {

  async function retrieveTransactions() {
    const { date1, date2, link } = req.body;
    console.log(req.body);
    client.connect()
      .then(() => {
        client.transactions.retrieve(link, date1, { 'dateTo': date2 })
          .then(data => {
            console.log(data)
            res.send(data.slice(0,10))
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  retrieveTransactions();
}