# Product Microservices

## Dev

+ Clone the repository
+ Run `npm install`
+ Create a `.env` file in the root of the project and add the following:
  ``` dotenv
  PORT=3000
  DATABASE='./PRISMA/<file>.db'
  ```
+ Run execute migrate script PRISMA `npx prisma migrate dev --name <your name>`
+ Run `yarn run start:dev` or `npm run start:dev`