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
  console.log(data1);
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    if (err) throw new Error(err.message);
    console.log(data2);
  });
});
