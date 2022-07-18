import { client } from '../../services/belvoClient'

export default function (req, res) {
  const { link, date1, date2 } = req.body
  async function retrieveBalance() {
    client.connect(link)
      .then(() => {
        client.balances.retrieve(link, date1, { 'dateTo': date2 })
          .then(data => {
            console.log(data)
            res.send(data)
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  retrieveBalance();
}