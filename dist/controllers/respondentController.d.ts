import { Request, Response } from "express";
export declare const getAllRespondents: (req: Request, res: Response) => Promise<void>;
export declare const getRespondentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createRespondent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateRespondent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRespondent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getRespondentStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=respondentController.d.ts.map