export const SALT_ROUNDS = 10;
export const FROM_VERIFY_EMAIL = 'noreply@gmail.com';

export enum Role {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  PARENT = 'parent',
  TUTOR = 'tutor',
  STUDENT = 'student',
}

export enum Status {
  PENDING = 'pending',
  RESOLVED = 'resolved',
}

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
