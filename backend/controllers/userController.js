import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Obtenir le chemin du fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/user.json");

// Lire le fichier JSON
async function readData() {
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

// Sauvegarder les données modifiées
async function saveData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// 🔹 1. Obtenir tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data.characters);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 2. Obtenir un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id);
    const user = data.characters.find((u) => u.id === id);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 3. Ajouter un nouvel utilisateur
export const createUser = async (req, res) => {
  try {
    const data = await readData();
    const newUser = req.body;

    const newId = data.characters.length > 0
      ? data.characters[data.characters.length - 1].id + 1
      : 1;

    const character = { id: newId, ...newUser };
    data.characters.push(character);
    await saveData(data);

    res.status(201).json(character);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 4. Modifier un utilisateur
export const updateUser = async (req, res) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const index = data.characters.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ message: "Utilisateur non trouvé" });

    data.characters[index] = { ...data.characters[index], ...updateData };
    await saveData(data);

    res.status(200).json(data.characters[index]);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔹 5. Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const data = await readData();
    const id = parseInt(req.params.id);

    const newList = data.characters.filter((u) => u.id !== id);
    if (newList.length === data.characters.length) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    data.characters = newList;
    await saveData(data);

    res.status(200).json({ message: "Supprimé avec succès" });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
};