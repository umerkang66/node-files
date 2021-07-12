import fs from 'fs';

/*
// BLOCKING, SYNCHROUNOUS WAY
const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
const textOutput = `This is what we know about the avacado: ${textInput}\nCreated on ${new Date().toLocaleString()}`;
fs.writeFileSync('./txt/output.txt', textOutput);
*/

// NON-BLOCKING, ASYNCHRONOUS WAY
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) throw new Error(err.message);
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    if (err) throw new Error(err.message);
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
      if (err) throw new Error(err.message);
      const newData = `${data2} ${data3}`;

      fs.writeFile('./txt/final.txt', newData, (err, data) => {});
    });
  });
});
