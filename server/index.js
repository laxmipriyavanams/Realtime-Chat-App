require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const Message = require("./models/Message");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  "/uploads",
  express.static("uploads")
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    res.json({
      imageUrl:
        `http://localhost:3001/uploads/${req.file.filename}`,
    });
  }
);
let onlineUsers = 0;
const users = {};


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on(
  "register_user",
  (username) => {
    users[username] =
      socket.id;

    socket.username =
      username;

    console.log(
      username,
      "registered"
    );
  }
);

  onlineUsers++;

  io.emit("online_users", onlineUsers);

  socket.on("send_message", async (data) => {
  console.log("Message received:", data);
  console.log("Saving message:", data);
  console.log("DATA RECEIVED:", data);

  try {
    await Message.create({
  text: data.text,
  image: data.image,
  sender: data.sender,
  receiver: data.receiver,
  time: data.time,
});

    console.log("Message saved to MongoDB ✅");
  } catch (err) {
    console.log("Error saving message ❌", err);
  }

  const receiverSocketId =
  users[data.receiver];

if (receiverSocketId) {
  io.to(
    receiverSocketId
  ).emit(
    "receive_message",
    data
  );
}
});
  socket.on("typing", () => {
  socket.broadcast.emit("user_typing");
});
socket.on(
  "delete_message",
  (messageId) => {
    socket.broadcast.emit(
      "message_deleted",
      messageId
    );
  }
);
socket.on(
  "reaction_added",
  (data) => {
    socket.broadcast.emit(
      "reaction_updated",
      data
    );
  }
);
socket.on(
  "message_seen",
  (data) => {
    console.log(
      "MESSAGE SEEN RECEIVED",
      data
    );

    socket.broadcast.emit(
      "message_seen_update",
      data
    );
  }
);
  socket.on(
  "disconnect",
  async () => {
    console.log(
      "User disconnected"
    );

    if (
      socket.username
    ) {
      await User.findOneAndUpdate(
        {
          username:
            socket.username,
        },
        {
          lastSeen:
            new Date(),
        }
      );
    }

    onlineUsers--;

    io.emit(
      "online_users",
      onlineUsers
    );
  }
);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.log("MongoDB Error ❌", err);
  });
  app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();

    console.log(messages);

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      error: "Failed to load messages",
    });
  }
});
app.get(
  "/user/:username",
  async (req, res) => {
    try {
      const user =
        await User.findOne({
          username:
            req.params.username,
        });

      res.json(user);
    } catch (err) {
      res.status(500).json({
        error:
          "Failed to load user",
      });
    }
  }
);
app.get("/all-messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({
      error: "Failed to load messages",
    });
  }
});
app.get(
  "/messages/:user1/:user2",
  async (req, res) => {
    try {
      const { user1, user2 } =
        req.params;

      const messages =
        await Message.find({
          $or: [
            {
              sender: user1,
              receiver: user2,
            },
            {
              sender: user2,
              receiver: user1,
            },
          ],
        });

      res.json(messages);
    } catch (err) {
      res.status(500).json({
        error:
          "Failed to load conversation",
      });
    }
  }
);
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});
app.get("/users", async (req, res) => {
  console.log("Deleting:", req.params.id);
  try {
    const users = await User.find().select(
      "username email"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error loading users",
    });
  }
});
app.delete(
  "/delete-message/:id",
  async (req, res) => {
    try {
      await Message.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        error:
          "Failed to delete message",
      });
    }
  }
);
const PORT = process.env.PORT || 3001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});