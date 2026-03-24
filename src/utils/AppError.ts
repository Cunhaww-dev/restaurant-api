export class AppError {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

// Precisamos capturar esse erro e enviar para algum lugar, o Controller utiliza o NextFunction para o próximo recurso da API, que pode ser essa função para tratar o erro