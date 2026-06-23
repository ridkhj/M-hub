import express from 'express';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

import musicaRoutes from './routes/musicaRoutes.js';
import cantorRoutes from './routes/cantorRoutes.js';
import repertorioRoutes from './routes/repertorioRoutes.js';
import itemRepertorioRoutes from './routes/itemRepertorioRoutes.js';
import cors from 'cors';

const app = express();
app.use(express.json()); 
app.use(logger);
app.use(cors())
// Declaração das rotas das classes
app.use('/api/musicas', musicaRoutes);
app.use('/api/cantores', cantorRoutes);
app.use('/api/repertorios', repertorioRoutes);
app.use('/api/itens-repertorio', itemRepertorioRoutes);

app.get('/', (req, res) => {
    res.json({
      api: 'Banco API',
      versao: '1.0.0',
      rotas: ['/musicas', '/cantores', '/repertorios', '/itens-repertorio'],
    });
});

app.use(errorHandler);

export default app;