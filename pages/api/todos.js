import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } else if (req.method === "POST") {
      const { title } = req.body;
      const newTodo = await prisma.todo.create({ data: { title } });
      res.status(201).json(newTodo);
    } else if (req.method === "PUT") {
      const { id, completed } = req.body;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const todo = await prisma.todo.findUnique({ where: { id: id } });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      const updatedTodo = await prisma.todo.update({
        where: { id: id },
        data: { completed },
      });
      res.status(200).json(updatedTodo);
    } else if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid ID format" });
      }
      const todo = await prisma.todo.findUnique({ where: { id: id } });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      await prisma.todo.delete({ where: { id: id } });
      res.status(204).end();
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
}
