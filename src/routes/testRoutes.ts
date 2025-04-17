import { Router } from 'express';
import testController from '../controllers/testController';

const router = Router();

export function setTestRoutes(app: Router): void {
    app.use('/api/test', router);
    router.get('/', testController.getTest.bind(testController));
}