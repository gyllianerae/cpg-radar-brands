import dotenv from 'dotenv';
import Fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import fs from 'fs';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';

import Brand from './models/brand.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, 'normalization_map.json');
let baseIngredients = [];

try {
  const data = fs.readFileSync(jsonFilePath, 'utf8');
  const jsonData = JSON.parse(data);

  // Extract only the base ingredient names
  baseIngredients = Object.keys(jsonData);
  console.log('Loaded ingredients:', baseIngredients.length);
} catch (err) {
  console.error('Error reading JSON file:', err);
}

const app = Fastify({ logger: true });

await app.register(cors, {
    origin: '*'
});

// Serve static files from the frontend dist folder
app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'frontend', 'dist'),
    prefix: '/',
});

// Fallback for SPA (serve index.html for unmatched routes)
app.setNotFoundHandler((req, reply) => {
    reply.sendFile('index.html');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

app.get('/brands', async (req, reply) => {
    try {
      const brands = await Brand.find();
      reply.send(brands);
    } catch (err) {
      reply.status(500).send(err);
    }
});

app.get('/brands/:id', async (request, reply) => {
    try {
        const brand = await Brand.findById(request.params.id);
        if (!brand) {
            return reply.status(404).send({ message: 'Brand not found' });
        }
        return brand;
    } catch (err) {
        reply.status(500).send(err);
    }
});

app.get('/ingredients/search', async (request, reply) => {
    try {
        const { q } = request.query;
        if (!q || typeof q !== 'string') {
            return reply.send([]);
        }

        const lowerCaseQuery = q.toLowerCase();
        const filteredIngredients = baseIngredients
            .filter(ingredient => 
                ingredient.toLowerCase().startsWith(lowerCaseQuery)
            )
            .sort((a, b) => {
                // Sort exact matches first
                const aLower = a.toLowerCase();
                const bLower = b.toLowerCase();
                if (aLower === lowerCaseQuery) return -1;
                if (bLower === lowerCaseQuery) return 1;
                // Then sort by length (shorter first)
                if (a.length !== b.length) return a.length - b.length;
                // Finally sort alphabetically
                return a.localeCompare(b);
            })
            .slice(0, 10); // Limit results to 10 suggestions

        reply.send(filteredIngredients);
    } catch (err) {
        console.error('Error searching ingredients:', err);
        reply.status(500).send({ message: 'Error searching ingredients', error: err.message });
    }
});

app.post('/brands', async (request, reply) => {
    try {
        const newBrand = new Brand(request.body);
        await newBrand.save();
        return reply.status(201).send(newBrand);
    } catch (err) {
        reply.status(500).send(err);
    }
});

app.put('/brands/:id', async (request, reply) => {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!updatedBrand) {
            return reply.status(404).send({ message: 'Brand not found' });
        }
        return updatedBrand;
    } catch (err) {
        reply.status(500).send(err);
    }
});

app.delete('/brands/:id', async (request, reply) => {
    try {
        const deletedBrand = await Brand.findByIdAndDelete(request.params.id);
        if (!deletedBrand) {
            return reply.status(404).send({ message: 'Brand not found' });
        }
        return { message: 'Brand deleted' };
    } catch (err) {
        reply.status(500).send(err);
    }
});

// Start the server
try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server running at ${app.server.address().port}`);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}