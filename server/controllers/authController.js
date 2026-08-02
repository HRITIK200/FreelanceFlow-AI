import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });

    res.status(201).json({
      message: "User registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Handle Recruiter Demo Mode login
    if (email === "demo@freelanceflow.ai") {
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log("Seeding recruiter demo account...");
        const hashedPassword = await bcrypt.hash("demopassword", 10);
        
        // 1. Create User
        user = await prisma.user.create({
          data: {
            name: "Recruiter Demo",
            email: "demo@freelanceflow.ai",
            password: hashedPassword,
            role: "USER",
          },
        });

        // 2. Create Clients
        const clientStark = await prisma.client.create({
          data: {
            name: "Tony Stark",
            email: "tony@stark.com",
            company: "Stark Industries",
            userId: user.id,
          },
        });

        const clientWayne = await prisma.client.create({
          data: {
            name: "Bruce Wayne",
            email: "bruce@wayne.com",
            company: "Wayne Enterprises",
            userId: user.id,
          },
        });

        const clientParker = await prisma.client.create({
          data: {
            name: "Peter Parker",
            email: "peter@dailybugle.com",
            company: "Daily Bugle",
            userId: user.id,
          },
        });

        // 3. Create Projects
        const projJarvis = await prisma.project.create({
          data: {
            title: "J.A.R.V.I.S. NLP Subsystem",
            description: "AI natural language parser for system integration.",
            budget: 180000,
            status: "COMPLETED",
            progress: 100,
            deadline: new Date(Date.now() + 10 * 86400000),
            clientId: clientStark.id,
          },
        });

        const projPlasma = await prisma.project.create({
          data: {
            title: "Arc Reactor Diagnostics Tool",
            description: "Mobile application to analyze reactor plasma flow.",
            budget: 140000,
            status: "IN_PROGRESS",
            progress: 60,
            deadline: new Date(Date.now() + 45 * 86400000),
            clientId: clientStark.id,
          },
        });

        const projBatcave = await prisma.project.create({
          data: {
            title: "Batcave Mainframe Dashboard",
            description: "Tactical multi-screen monitoring console built on React.",
            budget: 320000,
            status: "IN_PROGRESS",
            progress: 85,
            deadline: new Date(Date.now() + 30 * 86400000),
            clientId: clientWayne.id,
          },
        });

        const projSecurity = await prisma.project.create({
          data: {
            title: "Wayne Manor Security System",
            description: "IoT integration with visual alert layouts.",
            budget: 90000,
            status: "PENDING",
            progress: 0,
            deadline: new Date(Date.now() + 90 * 86400000),
            clientId: clientWayne.id,
          },
        });

        const projBugle = await prisma.project.create({
          data: {
            title: "Bugle News Feed Integration",
            description: "Real-time feed ingestion framework for media channels.",
            budget: 45000,
            status: "COMPLETED",
            progress: 100,
            deadline: new Date(Date.now() - 5 * 86400000),
            clientId: clientParker.id,
          },
        });

        // 4. Create Invoices
        await prisma.invoice.create({
          data: {
            invoiceNumber: "INV-2026-001",
            amount: 180000,
            status: "PAID",
            notes: "Milestone payment for Jarvis NLP.",
            dueDate: new Date(Date.now() - 15 * 86400000),
            projectId: projJarvis.id,
          },
        });

        await prisma.invoice.create({
          data: {
            invoiceNumber: "INV-2026-002",
            amount: 70000,
            status: "PENDING",
            notes: "Initial 50% deposit for Diagnostics UI.",
            dueDate: new Date(Date.now() - 2 * 86400000),
            projectId: projPlasma.id,
          },
        });

        await prisma.invoice.create({
          data: {
            invoiceNumber: "INV-2026-003",
            amount: 160000,
            status: "PAID",
            notes: "Design and wireframing phase.",
            dueDate: new Date(Date.now() - 20 * 86400000),
            projectId: projBatcave.id,
          },
        });

        await prisma.invoice.create({
          data: {
            invoiceNumber: "INV-2026-004",
            amount: 160000,
            status: "PENDING",
            notes: "Implementation phase milestones.",
            dueDate: new Date(Date.now() + 15 * 86400000),
            projectId: projBatcave.id,
          },
        });

        await prisma.invoice.create({
          data: {
            invoiceNumber: "INV-2026-005",
            amount: 45000,
            status: "PAID",
            notes: "Final payment news feed project.",
            dueDate: new Date(Date.now() - 10 * 86400000),
            projectId: projBugle.id,
          },
        });

        // 5. Create Activity Logs
        await prisma.activityLog.create({
          data: {
            action: "CREATE",
            entityType: "USER",
            details: "Demo database seeded successfully.",
            userId: user.id,
          },
        });
        
        await prisma.activityLog.create({
          data: {
            action: "CREATE",
            entityType: "CLIENT",
            details: "Added Tony Stark as client.",
            userId: user.id,
          },
        });

        await prisma.activityLog.create({
          data: {
            action: "CREATE",
            entityType: "PROJECT",
            details: "Created Batcave Mainframe Dashboard project.",
            userId: user.id,
          },
        });

        console.log("Recruiter demo seeding complete!");
      }

      // Bypass password check for demo user if they clicked Demo Access
      if (password !== "demopassword") {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCurrentUser =
  async (req, res) => {

    try {

      const user =
        await prisma.user.findUnique({
          where: {
            id: req.user.userId,
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }
};