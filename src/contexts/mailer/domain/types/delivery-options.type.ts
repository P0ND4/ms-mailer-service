export interface EmailDeliveryOptions {
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  headers?: Record<string, string>;
  html?: string;
  text?: string;
  sendAsBcc?: boolean;
}

export interface PhoneDeliveryOptions {
  from?: string;
  messagingServiceSid?: string;
  statusCallback?: string;
  voiceUrl?: string;
  twiml?: string;
}

export interface SendEmailJobData {
  to: string;
  subject: string;
  body: string;
  options?: EmailDeliveryOptions;
}

export interface SendBulkEmailJobData {
  recipients: string[];
  subject: string;
  body: string;
  options?: EmailDeliveryOptions;
}

export interface SendPhoneJobData {
  to: string;
  message: string;
  options?: PhoneDeliveryOptions;
}

export interface SendBulkPhoneJobData {
  recipients: string[];
  message: string;
  options?: PhoneDeliveryOptions;
}
