This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).




## How to Run through the project


After cloning the project, please install dependencies via

 ```bash
  npm install
  # or
  yarn
  ```

  Then, open the project via
  ```bash
  npm run dev
  # or
  yarn dev
  ```

  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


  1. Open Belvo Widget by clicking the "Open Widget "button.
  2. Click the "Register Link(Fail)" button to make the first API call -- that will fail, of course.
      1. Select "Solve MFA  (Success)" button to auccessfully finish the link registry process for institutions that require MFA.
      2. Select "Reset Link Register Request (no MFA)" button to successfully finish the link registry process for institutions that doesn't require MFA.
  4. Once the Link has been registered, the user will be able to navigate to the "Transactions/Owners/Balances/Accounts" endpoint pages.
  5. Every endpoint page has:
      1. Examples of Successful and Failed API Calls.
      2. API Call Data being shown on screen.

PS: The "CRUD API" buttons follow a pattern that you need to run certain API calls to unlock others.

## Deploy on Vercel

Tried to deploy on vercel, but for some reason it didn't work, sorry! :(

Check out their [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
