import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import pino, { Logger } from "pino";
import { DBClient, StorageService } from './types/card';
import * as swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { IStorageService } from './core/storage/IStorageService';
import { CardRouter } from "./routes/cardRouter";
import { FileRouter } from "./routes/fileRouter";
import { TagRouter } from "./routes/tagRouter";
import { ICardRepository } from "./core/repositories/ICardRepository";
import { IFileRepository } from "./core/repositories/IFileRepository";
import { ITagRepository } from "./core/repositories/ITagRepository";
import { FileController } from "./core/controllers/fileController";
import Tesseract from "tesseract.js";
import { ElasticSearchRepository } from "./core/repositories/elasticSearchRepository";

/**
 * Represents the whole Express Application
 */
class App {

    public expressApp: express.Application;
    private readonly storage: IStorageService;
    private readonly log: Logger;

    constructor() {
        this.expressApp = express();
        dotenv.config();
        // initialize storage service based on .env value
        this.storage = new (StorageService[process.env.STORAGE_SERVICE])();

        this.log = pino({
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            },
            level: process.env.LOG_LEVEL || 'info'
        });

        this.middleware();
        this.routes();
    }

    /**
     * Provides middlewares too express app
     * @private
     */
    private middleware(): void {
        this.expressApp.use(logger(process.env.ENVIRONMENT) as express.RequestHandler);
        this.expressApp.use(express.json({limit: '200mb'}) as express.RequestHandler);
        this.expressApp.use(express.urlencoded({limit: '200mb', extended: true}) as express.RequestHandler);
        this.expressApp.use(cors({exposedHeaders: ['X-Total-Count']}));

        // swagger openApi configuration
        const options: swaggerJSDoc.OAS3Options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Photo Library',
                    description: 'A library to store information related to photos',
                    version: '1.0.0',
                },
            },
            apis: ['./src/routes/*Router.ts'],
        };
        this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)))
    }

    /**
     * Entry point for routes, more routes in routes/* folder
     * @private
     */
    private async routes(): Promise<void> {
        this.expressApp.get('/', (_req, res) => res.redirect('/'));
        const tesseractWorker = Tesseract.createWorker({logger: m => this.log.debug(m)});
        //await tesseractWorker.loadLanguage('eng+fr');
        //await tesseractWorker.initialize('eng+fr');
        /*

       new (DBClient[process.env.DB_CLIENT][2])() is magic
         */
        const cardRepository: ICardRepository = new (DBClient[process.env.DB_CLIENT][0])();
        const fileRepository: IFileRepository = new (DBClient[process.env.DB_CLIENT][1])();
        const tagRepository: ITagRepository = new (DBClient[process.env.DB_CLIENT][2])();

        cardRepository.setFTSRepository(new ElasticSearchRepository());

        // TODO find a way to remove file controller
        const cardRouter = new CardRouter(this.log, new FileController(this.log, this.storage, fileRepository), tesseractWorker, cardRepository, tagRepository);
        const fileRouter = new FileRouter(this.log, this.storage, fileRepository);
        const tagRouter = new TagRouter(tagRepository);

        cardRouter.routes();
        fileRouter.routes();
        tagRouter.routes();

        this.expressApp.use('/cards', cardRouter.router);
        this.expressApp.use('/files', fileRouter.router);
        this.expressApp.use('/tags', tagRouter.router);
    }
}

const app = new App().expressApp;
export { app };
