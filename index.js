import 'dotenv/config'
import express from "express"
import prisma from "./PrismaClient.js";

const app = express();
app.use(express.json());

/* ================= USERS ================= */

//cadastro de pessoas que desejam oferecer conhecimentos
app.post("/users", async (request, response) => {
  const { name, email, phone, description } = request.body;

  try {
    const user = await prisma.user.create({
      data: { name, email, phone, description }
    });

    return response.status(201).json(user);
  } catch (error) {
    return response.status(500).send();
  }
});

//Listar Usuarios Cadastrados
app.get("/users", async (request, response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" }
    });

    return response.status(200).json(users);
  } catch (error) {
    return response.status(500).send();
  }
});

//Atualuizar os dados de um usuário específico
app.put("/users/:id", async (request, response) => {
  const { id } = request.params;
  const { name, email, phone, description } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const userUpdated = await prisma.user.update({
      where: { id },
      data: { name, email, phone, description }
    });

    return response.status(200).json(userUpdated);
  } catch (error) {
    return response.status(500).send();
  }
});


//Deletar um usuário específico
app.delete("/users/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id }
    });

    return response.status(204).send();
  } catch (error) {
    return response.status(500).send();
  }
});

/* ================= OFFERS ================= */

//Listar ofertas de conhecimento
app.get("/offers", async (request, response) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { title: "asc" }
    });

    return response.status(200).json(offers);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

//Criar uma nova oferta de conhecimento
app.post("/offers", async (request, response) => {
  const { title, description, category, level, userId } = request.body;

  try {
    const offer = await prisma.offer.create({
      data: { title, description, category, level, userId }
    });

    return response.status(201).json(offer);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

//Atualizar os dados de uma oferta específica
app.put("/offers/:id", async (request, response) => {
  const { id } = request.params;
  const { title, description, category, level, userId } = request.body;

  try {
    const offer = await prisma.offer.findUnique({
      where: { id }
    });

    if (!offer) {
      return response.status(404).json({ message: "Offer not found" });
    }

    const offerUpdated = await prisma.offer.update({
      where: { id },
      data: { title, description, category, level, userId }
    });

    return response.status(200).json(offerUpdated);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});


//Deletar uma oferta específica
app.delete("/offers/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const offer = await prisma.offer.findUnique({
      where: { id }
    });

    if (!offer) {
      return response.status(404).json({ message: "Offer not found" });
    }

    await prisma.offer.delete({
      where: { id }
    });

    return response.status(204).send();
  } catch (error) {
    return response.status(500).send();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
