import { Request, Response } from 'express';

class TestController {
    getTest(req: Request, res: Response): void {
        res.status(200).send('Work!');
    }
}

export default new TestController();