const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (fileName, standard) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, standard, (err, data) => {
      if (err) reject({ message: 'I could not find that file 😐' });
      resolve(data);
    });
  });
};

const writeFilePromise = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, err => {
      if (err) reject({ message: 'The file was not written 😐' });
      resolve('Success');
    });
  });
};

const readFile = async function () {
  try {
    const dataFile = await readFilePromise(`${__dirname}/dog.txt`, 'utf-8');

    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${dataFile}/images/random`
    );
    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${dataFile}/images/random`
    );
    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${dataFile}/images/random`
    );

    const allRes = await Promise.all([res1Promise, res2Promise, res3Promise]);

    const allImgs = allRes.map(res => res.body.message);

    writeFilePromise(`${__dirname}/outputDog.txt`, allImgs.join('\n'));
  } catch (err) {
    console.log(err.message);
    throw err;
  }

  return 'SAVED THE FILE';
};

(async () => {
  try {
    const umerData = await readFile();
    console.log(umerData);
  } catch (err) {
    console.log(err);
  }
})();
