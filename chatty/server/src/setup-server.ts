import http from 'http';
import {
  type Application,
  json,
  urlencoded,
  type Request,
  type Response,
  type NextFunction,
} from 'express';

import cors from 'cors';
import hpp from 'hpp';
import compression from 'compression';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const SERVER_PORT = 5000;

export class ChattyServer {
  constructor(private app: Application) {}

  public start(): void {
    this.securityMiddlewares(this.app);
    this.standardMiddlewares(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddlewares(app: Application): void {
    app.use(
      cookieSession({
        // when we are gonna setup the load balancer in aws, we are gonna have to use this name
        name: 'session',
        keys: ['test1', 'test2'],
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // TODO: we are gonna change this to true in production
        secure: false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        // TODO: change to the actual production url as env variable
        origin: '*',
        // Because we are gonna use the cookies a lot
        // So the cors will not block cookies
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    );
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
  }

  private routesMiddleware(app: Application) {}

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app);
      await this.startHttpServer(httpServer);
    } catch (err) {
      console.log(err);
    }
  }

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): Promise<void> {
    return new Promise(resolve => {
      httpServer.listen(SERVER_PORT, () => {
        console.log(`Server running on port: ${SERVER_PORT}`);
        resolve();
      });
    });
  }
}
