import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import { authRouter, protectedRouter } from './auth/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const openapiSpec = JSON.parse(
  await readFile(new URL('./swagger/openapi.json', import.meta.url))
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Auth API server is running. Visit /api-docs for Swagger UI documentation.' });
});


app.use("/auth", authRouter);
app.get("/public/info", async (req, res) => {
  res.status(200).json({
    "message": "Welcome stranger! This info is public."
  })
})
app.use("/protected", protectedRouter)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} and connected to Supabase`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
