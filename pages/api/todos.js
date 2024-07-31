import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch todos", details: error.message });
    }
  } else if (req.method === "POST") {
    const { title } = req.body;
    try {
      const newTodo = await prisma.todo.create({ data: { title } });
      res.status(201).json(newTodo);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create todo", details: error.message });
    }
  } else if (req.method === "PUT") {
    const { id, completed } = req.body;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
      const todo = await prisma.todo.findUnique({ where: { id: id } });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      const updatedTodo = await prisma.todo.update({
        where: { id: id },
        data: { completed },
      });
      res.status(200).json(updatedTodo);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update todo", details: error.message });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    try {
      const todo = await prisma.todo.findUnique({ where: { id: id } });
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      await prisma.todo.delete({ where: { id: id } });
      res.status(204).end();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete todo", details: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
