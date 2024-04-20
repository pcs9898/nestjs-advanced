import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('MailService', () => {
  let service: MailService;
  let mockMailerService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: jest.fn(),
    };
    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    const authCode = 123456;
    const email = 'test@example.com';
    const username = email.split('@')[0];

    mockMailerService.sendMail.mockResolvedValue(true);
    mockConfigService.get.mockReturnValue('sender@example.com');

    await service.send({ authCode, email });

    expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      to: email,
      from: 'sender@example.com',
      subject: `Hello ${username}`,
      html: expect.any(String),
    });
  });

  it('should throw an error when email sending fails', async () => {
    const authCode = 123456;
    const email = 'test@example.com';

    mockMailerService.sendMail.mockRejectedValue(
      new Error('Failed to send email'),
    );
    mockConfigService.get.mockReturnValue('sender@example.com');

    await expect(service.send({ authCode, email })).rejects.toThrow(
      'Failed to send email',
    );
  });
});
