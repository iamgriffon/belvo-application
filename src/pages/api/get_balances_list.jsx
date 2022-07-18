import { client } from '../../services/belvoClient'

export default function (req, res) {
  async function getBalances() {
    client.connect()
      .then(() => {
        client.balances.list()
          .then(data => {
            console.log(data)
            res.send(data.slice(10,20))
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  getBalances();
}