import fs from "fs";
import path from "path";
import { emailTransporter } from "../config/email";
import { fileURLToPath } from "url";

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  variables: Record<string, string>
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.html`
  );

  let html = fs.readFileSync(templatePath, "utf8");

  // Replace {{variables}}
  Object.keys(variables).forEach((key) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
  });

  await emailTransporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};
