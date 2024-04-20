export interface IMailServiceSend {
  email: string;
  authCode: number;
}

export interface IMailServiceWelcomeTemplate {
  username: string;
  authCode: number;
}

export interface IMailServiceGetEmailData {
  authCode: number;
  username: string;
}
