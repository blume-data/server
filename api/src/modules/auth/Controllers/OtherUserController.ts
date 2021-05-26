import { Request, Response } from "express";
import { sendOkayResponse } from "../../../util/methods";

export async function CreateUpdateOtherUser(req: Request, res: Response) {

    sendOkayResponse(res, {okay: 'okay'});
}