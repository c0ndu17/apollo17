const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/test',
  httpPort: process.env.PORT || 8000,
  wsPort: process.env.PORT || 8001,
};

export default config;
