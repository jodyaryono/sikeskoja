interface WhatsAppResponse {
    status: boolean;
    message: string;
    data: {
        id?: number;
    } | [];
}
declare class WhatsAppService {
    private deviceId;
    private apiUrl;
    constructor();
    /**
     * Send WhatsApp message
     * @param phone - Phone number (e.g., 085640206067)
     * @param message - Message to send
     * @returns Promise with API response
     */
    sendMessage(phone: string, message: string): Promise<WhatsAppResponse>;
    /**
     * Send OTP code via WhatsApp
     * @param phone - Phone number
     * @param otpCode - OTP code to send
     * @param userName - User name for personalization
     * @returns Promise with API response
     */
    sendOTP(phone: string, otpCode: string, userName?: string): Promise<WhatsAppResponse>;
    /**
     * Check if device is connected
     * @returns Device status
     */
    checkDeviceStatus(): Promise<boolean>;
}
declare const _default: WhatsAppService;
export default _default;
//# sourceMappingURL=whatsappService.d.ts.map