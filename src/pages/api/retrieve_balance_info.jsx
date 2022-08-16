import { client } from '../../services/belvoClient'

export default function (req, res) {
  const { link, date1, date2 } = req.body
  async function retrieveBalance() {
    client.connect(link)
      .then(() => {
        client.balances.retrieve(link, date1, { 'dateTo': date2 })
          .then(data => {
            const newData = data.splice(10, 20)
            console.log(data)
            res.send(newData)
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  retrieveBalance();
}