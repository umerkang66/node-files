import http from 'http';
import {
  type Application,
  json,
  urlencoded,
  type Request,
  type Response,
  type NextFunction,
} from 'express';

export class ChattyServer {
  constructor(private app: Application) {}

  public start(): void {
    this.securityMiddlewares(this.app);
    this.standardMiddlewares(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddlewares(app: Application): void {}

  private standardMiddlewares(app: Application): void {}

  private routesMiddleware(app: Application) {}

  private globalErrorHandler(app: Application): void {}

  private startServer(app: Application): void {}

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {}
}
