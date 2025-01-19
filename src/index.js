import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/models/initMongoConnection.js";

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
