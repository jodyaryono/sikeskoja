import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserStatistics: (req: Request, res: Response) => Promise<void>;
export declare const createAdmin: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=usersController.d.ts.map