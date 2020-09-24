import { NextFunction, Request, Response } from 'express';

export class Auth {
  static requireAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.loggedIn) {
      next();
      return;
    }

    res.status(403);
    res.send('Not permitted!!!');
  }
}
