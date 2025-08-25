const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  };
  
  module.exports = corsOptions;
  