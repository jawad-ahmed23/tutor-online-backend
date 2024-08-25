import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.schema';
import { SALT_ROUNDS, FROM_VERIFY_EMAIL } from '../../constants';
import { RegisterDto, LoginDto, VerifyEmailDto } from './dto/index.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async getMe(uid: string, res: Res): Promise<Res> {
    try {
      const user = await this.userModel.findOne({ _id: uid });

      if (!user) {
        throw new BadRequestException("User doesn't exist!");
      }

      return res.json({ user });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  async register(body: RegisterDto, res: Res): Promise<Res> {
    try {
      const { name, email, password, phoneNumber, role } = body;

      const user = await this.userModel.findOne({ email: email });

      if (user) {
        throw new BadRequestException('User already exists!');
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const resp = await this.userModel.create({
        name,
        role,
        email,
        password: hashedPassword,
        phoneNumber,
      });

      const authToken = this.jwtService.sign({ _id: resp._id });
      return res
        .set({ 'x-a': authToken })
        .json({ message: 'User registered successfully!' });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async login(body: LoginDto, res: Res): Promise<Res> {
    try {
      const { username, email, password } = body;
      const data = username ? { email } : { username };

      const user = await this.userModel.findOne({ ...data });
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        throw new UnauthorizedException('Password is incorrect!');
      }

      if (!user.verified) {
        const code = await this._generateUniqueVerificationCode();

        const message = `your verification code ${code}`;

        this._sendMail(FROM_VERIFY_EMAIL, user.email, 'Verify Email', message);

        await this.userModel.findOneAndUpdate(
          { _id: user._id },
          { verificationCode: code },
        );
      }

      const authToken = this.jwtService.sign({ _id: user._id });

      return res
        .set({
          'x-a': authToken,
        })
        .json({ _id: user._id, success: true });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  async sendVerificationCode(uid: string, res: Res): Promise<Res> {
    try {
      const user = await this.userModel.findOne({ _id: uid });
      const code = await this._generateUniqueVerificationCode();

      const message = `your verification code ${code}`;

      this._sendMail(FROM_VERIFY_EMAIL, user.email, 'Verify Email', message);

      await this.userModel.findOneAndUpdate(
        { _id: uid },
        { verificationCode: code },
      );

      return res.json({ message: 'email sent successfully!', success: true });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  async verifyEmail(uid: string, body: VerifyEmailDto, res: Res): Promise<Res> {
    try {
      const { code } = body;
      const user = await this.userModel.findOne({ _id: uid });

      if (code !== user.verificationCode) {
        throw new ConflictException('Code is incorrect!');
      }

      await this.userModel.findOneAndUpdate({ _id: uid }, { verified: true });

      return res.json({
        message: 'user verified successfully!',
        success: true,
      });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException(err.message);
    }
  }

  _sendMail(from, to, subject, message) {
    this.mailService.sendMail({
      from,
      to,
      subject,
      text: message,
    });
  }

  async _generateUniqueVerificationCode() {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = Math.floor(100000 + Math.random() * 900000).toString();

      const existingCode = await this.userModel.findOne({
        verificationCode: code,
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return code;
  }
}
