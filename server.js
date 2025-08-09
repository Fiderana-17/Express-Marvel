import express from 'express';
import fs from 'fs';
const app = express();
const port = 3000;

app.use(express.json());


let characters = [];
try {
  const data = fs.readFileSync('./user.json', 'utf-8');
  const json = JSON.parse(data);
  characters = json.characters || [];
} catch (e) {
  characters = [];
}
let nextId = characters.length > 0 ? Math.max(...characters.map(c => c.id)) + 1 : 1;


app.get('/characters', (req, res) => {
  res.json(characters);
});

