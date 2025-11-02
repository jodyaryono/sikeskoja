import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const createQuestionnaireKS: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllQuestionnaireKS: (req: Request, res: Response) => Promise<void>;
export declare const getQuestionnaireKSById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateQuestionnaireKS: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteQuestionnaireKS: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getKSDashboardStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=questionnaireKSController.d.ts.map