const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const http = require("http");
var bodyParser = require("body-parser");
const cors = require("cors");
const socketIO = require("socket.io");
app.set("view engine", "ejs");

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
// app.get('/', (req, res) => res.send('API Running'));

// Define Routes
// Relate the following routes to the following middleware
app.use("/api/users", require("./routes/api/users"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/tutorReg", require("./routes/api/tutorReg"));
app.use("/api/tutorData", require("./routes/api/tutorData"));
app.use("/api/tutorSettings", require("./routes/api/tutorSettings"));
app.use("/api/findTutor", require("./routes/api/findTutor"));
app.use("/api/fetchOneTutor", require("./routes/api/fetchOneTutor"));
app.use("/api/fetchTutee", require("./routes/api/fetchTutee"));
app.use("/api/rate-tutor", require("./routes/api/rate-tutor"));
app.use("/api/updatePair", require("./routes/api/updatePair"));
app.use("/api/linkingRoutes", require("./routes/api/linkingRoutes"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', async (message) => {
      const { chatId, sender, content, timestamp } = message;

      try {
        // Find the chat document by its ID
        const chat = await Chat.findById(chatId);

        if (chat) {
          // Append the new message to the messages array
          chat.messages.push({
            sender,
            content,
            timestamp,
          });

          // Save the updated chat document
          await chat.save();

          // Broadcast the message to all connected clients
          io.emit('receiveMessage', message);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('fetchChatHistory', async (pair) => {
      const { user1, user2 } = pair;

      try {
        // Retrieve the chat history from the database using the Chat model
        const chatHistory = await Chat.find({
          $or: [
            { tutor: user1, tutee: user2 },
            { tutor: user2, tutee: user1 },
          ],
        }).sort({ 'messages.timestamp': 1 });

        // Send the chat history to the client
        socket.emit('receiveChatHistory', chatHistory);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

// server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
