import { Module } from '@nestjs/common';
import { EmailUseCase } from 'src/contexts/mailer/application/mailer/email.use-case';
import { IEmailUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/email.use-case.interface';
import { SharedModule } from 'src/contexts/shared/shared.module';
import { EmailController } from './controllers/email.controller';
import { IPhoneUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/phone.use-case.interface';
import { PhoneUseCase } from 'src/contexts/mailer/application/mailer/phone.use-case';
import { PhoneController } from './controllers/phone.controller';
import { ICodeUseCase } from 'src/contexts/mailer/domain/use-cases/mailer/code.use-case.interface';
import { CodeUseCase } from 'src/contexts/mailer/application/mailer/code.use-case';
import { CodeController } from './controllers/code.controller';

const providers = [
  {
    provide: IEmailUseCase,
    useClass: EmailUseCase,
  },
  {
    provide: IPhoneUseCase,
    useClass: PhoneUseCase,
  },
  {
    provide: ICodeUseCase,
    useClass: CodeUseCase,
  },
];

@Module({
  imports: [SharedModule],
  controllers: [EmailController, PhoneController, CodeController],
  providers: [...providers],
})
export class MailerModule {}
