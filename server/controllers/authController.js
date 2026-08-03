import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    });

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ─── Demo Mode ───────────────────────────────────────────────────────────
    if (email === "demo@freelanceflow.ai") {
      // FIX: Check password BEFORE seeding anything
      if (password !== "demopassword") {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        console.log("Seeding demo account...");

        // Wrap entire seed in a transaction — all-or-nothing
        user = await prisma.$transaction(async (tx) => {
          const hashedPassword = await bcrypt.hash("demopassword", 10);

          const newUser = await tx.user.create({
            data: {
              name: "Demo User",
              email: "demo@freelanceflow.ai",
              password: hashedPassword,
              role: "DEMO",
              title: "Full-Stack Freelancer",
              company: "FreelanceFlow Studio",
              bio: "Demo freelancer account showcasing all FreelanceFlow AI features.",
              hourlyRate: 85,
            },
          });

          const clientStark = await tx.client.create({
            data: { name: "Tony Stark", email: "tony@stark.com", company: "Stark Industries", userId: newUser.id },
          });
          const clientWayne = await tx.client.create({
            data: { name: "Bruce Wayne", email: "bruce@wayne.com", company: "Wayne Enterprises", userId: newUser.id },
          });
          const clientParker = await tx.client.create({
            data: { name: "Peter Parker", email: "peter@dailybugle.com", company: "Daily Bugle", userId: newUser.id },
          });

          const projJarvis = await tx.project.create({
            data: {
              title: "J.A.R.V.I.S. NLP Subsystem", description: "AI natural language parser for system integration.",
              budget: 180000, status: "COMPLETED", progress: 100,
              deadline: new Date(Date.now() + 10 * 86400000), clientId: clientStark.id,
            },
          });
          const projPlasma = await tx.project.create({
            data: {
              title: "Arc Reactor Diagnostics Tool", description: "Mobile application to analyze reactor plasma flow.",
              budget: 140000, status: "IN_PROGRESS", progress: 60,
              deadline: new Date(Date.now() + 45 * 86400000), clientId: clientStark.id,
            },
          });
          const projBatcave = await tx.project.create({
            data: {
              title: "Batcave Mainframe Dashboard", description: "Tactical multi-screen monitoring console built on React.",
              budget: 320000, status: "IN_PROGRESS", progress: 85,
              deadline: new Date(Date.now() + 30 * 86400000), clientId: clientWayne.id,
            },
          });
          const projSecurity = await tx.project.create({
            data: {
              title: "Wayne Manor Security System", description: "IoT integration with visual alert layouts.",
              budget: 90000, status: "PENDING", progress: 0,
              deadline: new Date(Date.now() + 90 * 86400000), clientId: clientWayne.id,
            },
          });
          const projBugle = await tx.project.create({
            data: {
              title: "Bugle News Feed Integration", description: "Real-time feed ingestion framework for media channels.",
              budget: 45000, status: "COMPLETED", progress: 100,
              deadline: new Date(Date.now() - 5 * 86400000), clientId: clientParker.id,
            },
          });

          await tx.invoice.create({ data: { invoiceNumber: "INV-2026-001", amount: 180000, status: "PAID", notes: "Milestone payment for Jarvis NLP.", dueDate: new Date(Date.now() - 15 * 86400000), projectId: projJarvis.id } });
          await tx.invoice.create({ data: { invoiceNumber: "INV-2026-002", amount: 70000, status: "PENDING", notes: "Initial 50% deposit for Diagnostics UI.", dueDate: new Date(Date.now() - 2 * 86400000), projectId: projPlasma.id } });
          await tx.invoice.create({ data: { invoiceNumber: "INV-2026-003", amount: 160000, status: "PAID", notes: "Design and wireframing phase.", dueDate: new Date(Date.now() - 20 * 86400000), projectId: projBatcave.id } });
          await tx.invoice.create({ data: { invoiceNumber: "INV-2026-004", amount: 160000, status: "PENDING", notes: "Implementation phase milestones.", dueDate: new Date(Date.now() + 15 * 86400000), projectId: projBatcave.id } });
          await tx.invoice.create({ data: { invoiceNumber: "INV-2026-005", amount: 45000, status: "PAID", notes: "Final payment news feed project.", dueDate: new Date(Date.now() - 10 * 86400000), projectId: projBugle.id } });

          await tx.activityLog.createMany({
            data: [
              { action: "CREATE", entityType: "USER", details: "Demo database seeded successfully.", userId: newUser.id },
              { action: "CREATE", entityType: "CLIENT", details: "Added Tony Stark as client.", userId: newUser.id },
              { action: "CREATE", entityType: "CLIENT", details: "Added Bruce Wayne as client.", userId: newUser.id },
              { action: "CREATE", entityType: "PROJECT", details: "Created Batcave Mainframe Dashboard project.", userId: newUser.id },
              { action: "CREATE", entityType: "INVOICE", details: "Created invoice INV-2026-001 for Stark Industries.", userId: newUser.id },
            ],
          });

          console.log("Demo seeding complete!");
          return newUser;
        });
      } else {
        // Sync role/name for existing demo user if needed
        if (user.name !== "Demo User" || user.role !== "DEMO") {
          user = await prisma.user.update({
            where: { email },
            data: { name: "Demo User", role: "DEMO" },
          });
        }
      }

      const token = jwt.sign({ userId: user.id, role: "DEMO" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({
        message: "Demo login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    // ─── Regular Login ────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, name: true, email: true, role: true,
        title: true, company: true, bio: true, phone: true,
        website: true, hourlyRate: true, createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, title, company, bio, phone, website, hourlyRate } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(title !== undefined && { title }),
        ...(company !== undefined && { company }),
        ...(bio !== undefined && { bio }),
        ...(phone !== undefined && { phone }),
        ...(website !== undefined && { website }),
        ...(hourlyRate !== undefined && { hourlyRate }),
      },
      select: {
        id: true, name: true, email: true, role: true,
        title: true, company: true, bio: true, phone: true,
        website: true, hourlyRate: true, createdAt: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};