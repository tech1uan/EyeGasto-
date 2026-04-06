import express from 'express';
import cors from 'cors';



const PORT = process.env.PORT || 8000;

const server = express();
server.use(express.json())

server.use(express.static('../frontend'));



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})