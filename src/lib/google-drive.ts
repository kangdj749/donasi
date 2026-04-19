import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const drive = google.drive({ version: "v3", auth });

/* ================= CREATE SPREADSHEET ================= */

export async function createSpreadsheet(name: string) {
  const file = await drive.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.spreadsheet",
    },
  });

  return file.data.id;
}

/* ================= COPY TEMPLATE ================= */

export async function copyTemplate(
  templateId: string,
  newSheetId: string
) {
  const sheets = google.sheets({ version: "v4", auth });

  const template = await sheets.spreadsheets.get({
    spreadsheetId: templateId,
  });

  const sheetNames =
    template.data.sheets?.map((s) => s.properties?.title) || [];

  for (const name of sheetNames) {
    await sheets.spreadsheets.sheets.copyTo({
      spreadsheetId: templateId,
      sheetId:
        template.data.sheets?.find(
          (s) => s.properties?.title === name
        )?.properties?.sheetId!,
      requestBody: {
        destinationSpreadsheetId: newSheetId,
      },
    });
  }
}

/* ================= SHARE ================= */

export async function shareSpreadsheet(sheetId: string) {
  await drive.permissions.create({
    fileId: sheetId,
    requestBody: {
      role: "writer",
      type: "user",
      emailAddress: process.env.GOOGLE_CLIENT_EMAIL,
    },
  });
}