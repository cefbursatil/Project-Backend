import express from 'express';
export default express;

export const app = express();
const PORT = process.env.PORT || 8080;
export const server = app.listen(PORT, () => {
    console.log(`HTTP server listening port ${server.address().port}`);
  });

server.on("error", (error) => console.log(`Server Error: ${error}`));