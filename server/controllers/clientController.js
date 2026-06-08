import prisma from "../utils/prisma.js";

export const createClient = async (req, res) => {
  try {
    const { name, email, company } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        userId: req.user.userId,
      },
    });

    res.status(201).json(client);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMyClients = async (req, res) => {
  try {

    const clients =
      await prisma.client.findMany({
        where: {
          userId: req.user.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json(clients);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};