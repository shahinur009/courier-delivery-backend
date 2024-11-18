const { app, client } = require('./app');
const port = process.env.PORT || 5007;

async function startServer() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    app.listen(port, () => console.log(`Listening on port: ${port}`));
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

startServer();
