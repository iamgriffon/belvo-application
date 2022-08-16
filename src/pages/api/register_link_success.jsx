import { client } from '../../services/belvoClient'

export default function (req, res) {
  async function registerLink() {
    const { institution, login, password, token, secret, access_mode } = req.body;

    console.log(req.body);
    await client.connect()
      .then(() => {
        client.links.register(institution, login, password, token, secret, access_mode)
          .then(async (response) => {
             res.status(200).send(response); 
          })
          .catch(err => {
            res.send(err)
          });
      });
  };
  registerLink();
}