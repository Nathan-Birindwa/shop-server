import { Response, Request } from "express";
import signUp from "../services/auth.service";
export default function create_Account(req: Request, res: Response) {
  res.send(signUp );
}
