import { client } from '../../services/belvoClient'

export default function (req, res) {
  const { link  } = req.body
  async function retrieveAccount() {
    client.connect()
      .then(() => {
        client.accounts.retrieve(link, {limit: 10})
          .then(data => {
            res.send(data)
          })
          .catch(error => {
            res.send(error)
          });
      });
  }
  retrieveAccount();
}