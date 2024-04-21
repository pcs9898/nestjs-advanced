export interface IMailServiceSendUserServiceAuthCode {
  email: string;
  authCode: number;
}

export interface IMailServiceSendUserServiceAuthCodeTemplate {
  username: string;
  authCode: number;
}

export interface IMailServiceSendAnalyticsServiceFindTop5downloadVideosTemplate {
  data: string[];
}
