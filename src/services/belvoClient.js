import Client from 'belvo';

export const client = new Client(
  String(process.env.BELVO_SANDBOX_SECRET_ID),
  String(process.env.BELVO_SANDBOX_SECRET_PASSWORD),
  'sandbox'
);


