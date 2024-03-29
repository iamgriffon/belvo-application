import { client } from '../../services/belvoClient'

export default function (req, res) {
  async function getBalances() {
    client.connect()
      .then(() => {
        client.balances.list({limit: 10})
          .then(data => {
            res.send(data)
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  getBalances();
}