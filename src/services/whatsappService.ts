import axios from "axios";
import { config } from "../config";

interface WhatsAppResponse {
  status: boolean;
  message: string;
  data:
    | {
        id?: number;
      }
    | [];
}

class WhatsAppService {
  private deviceId: string;
  private apiUrl: string;

  constructor() {
    this.deviceId =
      config.WHATSAPP_DEVICE_ID || "59087f966f4f8cc3385569ef6481cc29";
    this.apiUrl = "https://app.whacenter.com/api/send";
  }

  /**
   * Send WhatsApp message
   * @param phone - Phone number (e.g., 085640206067)
   * @param message - Message to send
   * @returns Promise with API response
   */
  async sendMessage(phone: string, message: string): Promise<WhatsAppResponse> {
    try {
      // Remove leading zero and add 62 for Indonesian numbers
      const formattedPhone = phone.startsWith("0")
        ? "62" + phone.substring(1)
        : phone;

      const params = new URLSearchParams();
      params.append("device_id", this.deviceId);
      params.append("number", formattedPhone);
      params.append("message", message);

      const response = await axios.post<WhatsAppResponse>(this.apiUrl, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "WhatsApp API Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to send WhatsApp message");
    }
  }

  /**
   * Send OTP code via WhatsApp
   * @param phone - Phone number
   * @param otpCode - OTP code to send
   * @param userName - User name for personalization
   * @returns Promise with API response
   */
  async sendOTP(
    phone: string,
    otpCode: string,
    userName?: string
  ): Promise<WhatsAppResponse> {
    const greeting = userName ? `Halo ${userName},\n\n` : "Halo,\n\n";

    const message = `${greeting}Kode OTP untuk login ke SiKesKoja - Sistem Kesehatan Kota Jayapura:

*${otpCode}*

Kode ini berlaku selama 5 menit.
Jangan bagikan kode ini kepada siapapun.

Terima kasih,
Tim SiKesKoja`;

    return this.sendMessage(phone, message);
  }

  /**
   * Check if device is connected
   * @returns Device status
   */
  async checkDeviceStatus(): Promise<boolean> {
    try {
      const response = await this.sendMessage("0", "test");
      return response.status;
    } catch (error) {
      return false;
    }
  }
}

export default new WhatsAppService();
