import { Request, Response } from "express";
export declare const getAllQuestionnaires: (req: Request, res: Response) => Promise<void>;
export declare const getQuestionnaireById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createQuestionnaire: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateQuestionnaire: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteQuestionnaire: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getQuestionnaireStats: (req: Request, res: Response) => Promise<void>;
export declare const updateAnggotaKeluarga: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAnggotaKeluarga: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=questionnaireController.d.ts.map