import { IMailServiceWelcomeTemplate } from '../interface/mail-service.interface';

export const welcome_send_mail_template = ({
  username,
  authCode,
}: IMailServiceWelcomeTemplate) => {
  return `    
    <!DOCTYPE html>
    <html>
        <head>
            <title>Welcome. ${username}</title>
        </head>

        <body>
            <div>your verification number is ${authCode}</div>
        </body>
    </html>
    `;
};
