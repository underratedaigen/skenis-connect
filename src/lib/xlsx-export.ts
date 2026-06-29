import ExcelJS from "exceljs";
import type { ProductType, RedirectLink, RedirectStatus } from "@prisma/client";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import { getPublicBaseUrl } from "@/lib/env";

type BatchForExport = {
  id: string;
  name: string;
  productType: ProductType;
  manufacturerNote: string | null;
  createdAt: Date;
  links: Array<
    Pick<
      RedirectLink,
      | "token"
      | "shortUrl"
      | "productType"
      | "status"
      | "companyName"
      | "destinationUrl"
      | "createdAt"
    >
  >;
};

export async function buildBatchWorkbook(batch: BatchForExport) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Skenis.lt";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("QR kodai", {
    views: [{ state: "frozen", ySplit: 5 }]
  });

  sheet.addRow(["Batch name", batch.name]);
  sheet.addRow(["Batch ID", batch.id]);
  sheet.addRow(["Manufacturer notes", batch.manufacturerNote || ""]);
  sheet.addRow(["Created date", batch.createdAt]);
  sheet.addRow([]);

  sheet.addRow([
    "Batch name",
    "Batch ID",
    "Row number",
    "Token",
    "Short URL",
    "QR code image URL",
    "Product type",
    "Status",
    "Assigned company name",
    "Final redirect URL",
    "Manufacturer notes",
    "Created date"
  ]);

  const headerRow = sheet.getRow(6);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF101820" }
  };

  const baseUrl = getPublicBaseUrl();

  batch.links.forEach((link, index) => {
    const row = sheet.addRow([
      batch.name,
      batch.id,
      index + 1,
      link.token,
      link.shortUrl,
      `${baseUrl}/api/qr/${link.token}`,
      productTypeLabels[link.productType],
      redirectStatusLabels[link.status as RedirectStatus],
      link.companyName || "",
      link.destinationUrl || "",
      batch.manufacturerNote || "",
      link.createdAt
    ]);

    row.getCell(5).value = {
      text: link.shortUrl,
      hyperlink: link.shortUrl
    };
    row.getCell(6).value = {
      text: `${baseUrl}/api/qr/${link.token}`,
      hyperlink: `${baseUrl}/api/qr/${link.token}`
    };
  });

  sheet.columns = [
    { width: 32 },
    { width: 28 },
    { width: 12 },
    { width: 20 },
    { width: 34 },
    { width: 42 },
    { width: 32 },
    { width: 18 },
    { width: 30 },
    { width: 46 },
    { width: 36 },
    { width: 24 }
  ];

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  return workbook;
}
