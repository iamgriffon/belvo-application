import { client } from '../../services/belvoClient'

export default function (req, res) {
  var token = '000000'
  console.log('req body', req.body);
  var { institution, login, password } = req.body;

  async function patchRegisterLink() {
    await client.connect().then(() =>
      client.links.register(institution, login, password)
        .then(response => {
          console.log('1ST RESPONSE', response.data)
        })
        .then(data => {
          const { session, link } = data
          console.log('session', { session, link })
          res.send({ session, link })
          client.links.resume(session, token, link)
        })
        .then(final => {
          console.log('Second API Response', final)
          res.send(final)
        })
        .catch(err => {
          const { session, link } = err.detail[0];
          const token = '000000'
          client.links.resume(session, token, link)
            .then(data => {
              console.log(data);
              res.send(data)
            });
        })
    )
  };
  patchRegisterLink();
}

