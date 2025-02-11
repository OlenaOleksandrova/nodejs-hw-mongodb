import nodemailer from 'nodemailer';
import { ENV_VARS } from '../constants/env.js';
import { getEnvVar } from './getEnvVar.js';
// import { options } from 'joi';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  host: getEnvVar(ENV_VARS.SMTP_HOST),
  port: getEnvVar(ENV_VARS.SMTP_PORT),
  auth: {
    user: getEnvVar(ENV_VARS.SMTP_USER),
    pass: getEnvVar(ENV_VARS.SMTP_PASS),
  },
});

export const sendEmail = async (options) => {
  try {
    return await transport.sendMail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      from: options.from,
    });
  } catch (err) {
    console.error(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
