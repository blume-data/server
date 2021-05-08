import {Response, Request} from 'express';
import {okayStatus} from "../../../util/common-module";

export async function SignUp(req: Request, res: Response) {

    const userName = req.params && req.params.userName;

    res.status(okayStatus).send('okay');

}