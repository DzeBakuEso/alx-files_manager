import dbClient from './utils/db';

const waitConnection = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    const repeatFct = async () => {
      await setTimeout(() => {
        i += 1;
        if (i >= 10) {
          reject();
        } else if (!dbClient.isAlive()) {
          repeatFct();
        } else {
          resolve();
        }
      }, 1000);
    };
    repeatFct();
  });
};

(async () => {
  console.log(dbClient.isAlive());          // false initially
  await waitConnection();                  // waits until connected or times out
  console.log(dbClient.isAlive());          // true
  console.log(await dbClient.nbUsers());    // e.g., 4
  console.log(await dbClient.nbFiles());    // e.g., 30
})();
