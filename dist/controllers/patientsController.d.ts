import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const getPatients: (req: Request, res: Response) => Promise<void>;
export declare const getPatientById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPatient: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePatient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePatient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchPatients: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPatientStatistics: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=patientsController.d.ts.map