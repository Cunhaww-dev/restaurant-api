import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { document } from './docs/openapi';
import { routes } from './routes';
import { errorHandlingMiddleware } from './middlewares/error-handling';

const PORT = 3333;
const app = express();
app.use(express.json());
app.use(routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(document));

// Usando o Middleware de tratamento de erros, ele deve ser o último a ser registrado, para que ele capture os erros de todas as rotas e middlewares anteriores
app.use(errorHandlingMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
