import { client } from '../../services/belvoClient'

export default function (req, res) {
  
  async function getToken() {
    try {
      const token = await client.connect()
        .then(function () {
          const data = client.widgetToken.create()
            .then((response) => {
             return response;
            })
          return data;
        });
      res.send(token)
    } catch (error) {
      res.status(400).send(error)
    }
  }
  getToken();
}
