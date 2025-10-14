1. npm install first
2. make sure all dependency are installed.
3.  write all credintial in .env file
4. npx prisma migrate status // to check prisma migration done or not
5. first migrate the prisma
6. generate the client of prisma
7. do dev, buld, start enverment as you need

/* to check error and hint to fix error */
-> npm install -D nodemon ts-node concurrently 


**Running Server Startegy*
-> ESLint all thiings are written on eslint.config.mjs
1. to create this file you had to run 

-> touch nodemon.json /*create this file*/
{
"watch":["src"],
"ext": "ts",
"exec": "ts-node src/index.ts"
}

-> package.json /*change the script*/
"scripts": {
    "build": "tsc -b && cp -r ./src/generated ./dist/generated",
    "start": "node dist/index.js",
    "dev": "concurrently -k -n \"LINT,NODE\" -c \"yellow.bold,cyan.bold\" \"npm run lint:watch\" \"npm run serve\"",
    "lint:watch": "nodemon --watch src --ext ts --exec \"npm run lint:check\"",
    "lint:check": "eslint . --ext .ts",
    "serve": "nodemon --watch src --ext ts --exec ts-node src/index.ts"
  },

-> tsconfig.json /*write after compilerOptions*/
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],    // 👈 MUST be written
  "exclude": ["node_modules"] //this will also written
}
->{npm run dev /*Real-time run the code & relode development envirment*/}
->{npm run build /*One time compile and copy the file for production level*/}
->{npm start /*run Production version*/}



 ---before run your code---
 -> npx prisma migrated dev
 -> npx prisma generate
 -> npm run build
 -> node dist/index.js



/* env file configration of credintial*/
DATABASE_URL="POSTGRES-DATABASEurl"
JWT_SECRET=JWT-SECREAT
TWILIO_ACCOUNT_SID=TWILIO-ACCOUNT-SID
TWILIO_AUTH_TOKEN=TWILIO-AUTH-TOKEN
TWILIO_PHONE_NUMBER= +12705581431  # This is your Twilio verified sender number
REDIS_URL=redisLabURL


/*
this is for local redis befor this install on you machine
import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
    console.log("Redis Connected");
    })
*/
