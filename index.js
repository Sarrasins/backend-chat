
require("dotenv").config(); // Charger les variables d'environnement
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint principal pour traiter les requêtes du chatbot
app.post("/api/chat", async (req, res) => {
  const userInput = req.body.userInput;

  if (!userInput) {
    return res.status(400).json({ error: "Le message utilisateur est requis." });
  }

  try {
    // Instructions pour que le bot adopte le ton de Monkey Island
    const systemMessage = {
      role: "system",
      content: "Tu es un personnage dans l'univers du jeu Monkey Island. Réponds en utilisant le vocabulaire et le theme du jeu Monkey Island",
    };

    // Appel à l'API Mistral
    const response = await axios.post(
      process.env.API_BASE_URL,
      {
        messages: [
          systemMessage,
          {
            role: "user",
            content: userInput,
          },
        ],
        model: process.env.API_MODEL,
        max_tokens: 500,
        temperature: 0.9, // Augmenter la créativité
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    // Extraire la réponse de l'assistant depuis l'API Mistral
    const assistantResponse = response.data.choices?.[0]?.message?.content;

    if (!assistantResponse) {
      return res.status(500).json({ error: "Aucune réponse générée par l'API Mistral." });
    }

    res.json({ response: assistantResponse });
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Mistral :", error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API Mistral." });
  }
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});

// require("dotenv").config(); // Charger les variables d'environnement
// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Endpoint principal pour traiter les requêtes du chatbot
// app.post("/api/chat", async (req, res) => {
//   const userInput = req.body.userInput;

//   if (!userInput) {
//     return res.status(400).json({ error: "Le message utilisateur est requis." });
//   }

//   try {
//     // Appel à l'API Mistral
//     const response = await axios.post(
//       process.env.API_BASE_URL,
//       {
//         messages: [
//           {
//             role: "user",
//             content: userInput,
//           },
//         ],
//         model: process.env.API_MODEL,
//         max_tokens: 150,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.API_KEY}`,
//         },
//       }
//     );

//     // Extraire la réponse de l'assistant depuis l'API Mistral
//     const assistantResponse = response.data.choices?.[0]?.message?.content;

//     if (!assistantResponse) {
//       return res.status(500).json({ error: "Aucune réponse générée par l'API Mistral." });
//     }

//     res.json({ response: assistantResponse });
//   } catch (error) {
//     console.error("Erreur lors de l'appel à l'API Mistral :", error.response?.data || error.message);
//     res.status(500).json({ error: "Erreur lors de l'appel à l'API Mistral." });
//   }
// });

// // Démarrer le serveur
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
// });
