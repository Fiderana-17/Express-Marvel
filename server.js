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


app.post('/characters', (req, res) => {
  const { name, role } = req.body;
  const newCharacter = {
    id: nextId++,
    name,
    role
  };
  characters.push(newCharacter);
  res.status(201).json(newCharacter);
});

app.get('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const character = characters.find(c => c.id === id);
  if (!character) {
    return res.status(404).json({ message: 'Character not found' });
  }
  res.json(character);
});


app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, role } = req.body;
  const character = characters.find(c => c.id === id);
  if (!character) {
    return res.status(404).json({ message: 'Character not found' });
  }

  character.name = name ?? character.name;
  character.role = role ?? character.role;

  res.json(character);
});


app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = characters.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Character not found' });
  }

  characters.splice(index, 1);
  res.json({ message: 'Character deleted' });
});


// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
