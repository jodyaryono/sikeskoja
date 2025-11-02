import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: any;
}
export declare const getHealthRecords: (req: Request, res: Response) => Promise<void>;
export declare const getHealthRecordById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createHealthRecord: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateHealthRecord: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteHealthRecord: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getHealthRecordsByPatient: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchHealthRecords: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=healthRecordsController.d.ts.map