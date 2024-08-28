/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { Students } from '../../models/student.schema';
import { SALT_ROUNDS, FROM_VERIFY_EMAIL } from '../../constants';
import { RegisterDto, LoginDto, VerifyEmailDto } from './dto/index.dto';
import { addHours } from '../../utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Students.name)
    private studentsModel: Model<Students>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async getMe(uid: string, res: Res): Promise<Res> {
    try {
      const user = await this.userModel.findOne({ _id: uid });

      if (!user) {
        throw new BadRequestException("User doesn't exist!");
      }

      return res.json({ user, success: true });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async register(body: RegisterDto, res: Res): Promise<Res> {
    try {
      const { name, email, password, phoneNumber, role } = body;
      console.log('Body', body);

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

      const code = await this._generateUniqueVerificationCode();
      const message = `your verification code ${code}`;
      const date = new Date();
      const expireDate = addHours(date, 1);

      this._sendMail(FROM_VERIFY_EMAIL, resp.email, 'Verify Email', message);

      await this.userModel.findOneAndUpdate(
        { _id: resp._id },
        { verification: { code: code, expire: expireDate } },
      );

      const authToken = this.jwtService.sign({ _id: resp._id });
      return res
        .set({ 'x-a': authToken })
        .json({ message: 'User registered successfully!', success: true });
    } catch (err) {
      console.log(err);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async login(body: LoginDto, res: Res): Promise<Res> {
    try {
      const { username, email, password } = body;
      // const data = username ? { email } : { username };

      let user;
      if (username) {
        user = await this.studentsModel.findOne({ username: username });
      }
      user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found!');
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        throw new UnauthorizedException('Password is incorrect!');
      }

      const authToken = this.jwtService.sign({ _id: user._id });

      return res
        .set({
          'x-a': authToken,
        })
        .json({ _id: user._id, success: true });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async sendVerificationCode(uid: string, res: Res): Promise<Res> {
    try {
      const user = await this.userModel.findOne({ _id: uid });
      const code = await this._generateUniqueVerificationCode();

      const message = `your verification code ${code}`;

      const date = new Date();
      const expireDate = addHours(date, 1);

      this._sendMail(FROM_VERIFY_EMAIL, user.email, 'Verify Email', message);

      await this.userModel.findOneAndUpdate(
        { _id: uid },
        { verification: { code: code, expire: expireDate } },
      );

      return res.json({ message: 'email sent successfully!', success: true });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException({ message: err.message, success: false });
    }
  }

  async verifyEmail(uid: string, body: VerifyEmailDto, res: Res): Promise<Res> {
    try {
      const { code } = body;
      const user = await this.userModel.findOne({ _id: uid });

      //@ts-ignore
      if (code !== user.verification.code) {
        throw new ConflictException('Code is incorrect!');
      }
      const currentDate = new Date();

      if (currentDate > user.verification.expire) {
        throw new ConflictException('Code is expired!');
      }

      await this.userModel.findOneAndUpdate({ _id: uid }, { verified: true });

      return res.json({
        message: 'user verified successfully!',
        success: true,
      });
    } catch (err) {
      console.log(err.message);
      throw new BadRequestException({ message: err.message, success: false });
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
