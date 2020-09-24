import { Request, Response } from 'express';

import { controller, get, use } from '../decorators';
import { Auth } from '../middlewares';

@controller('')
export class RootController {
  @get('/')
  getRoot(req: Request, res: Response) {
    if (req.session && req.session.loggedIn) {
      res.send(`
        <div> 
          <div> You are logged in </div>
          <a href="/logout">Logout</a>
        </div>
      `);
    } else {
      res.send(`
        <div> 
          <div> You are not logged in </div>
          <a href="/auth/login">Login</a>
        </div>
      `);
    }
  }

  @get('/logout')
  postLogout(req: Request, res: Response) {
    req.session = null;
    res.redirect('/');
  }

  @get('/protected')
  @use(Auth.requireAuth)
  getProtected(req: Request, res: Response) {
    res.send('Welcome to protected route');
  }
}
