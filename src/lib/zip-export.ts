import JSZip from "jszip";
import { createQrPngBuffer } from "@/lib/qr";

type LinkForZip = {
  token: string;
  shortUrl: string;
};

export async function buildQrZip(links: LinkForZip[]) {
  const zip = new JSZip();
  const manifestRows = ["file_name,token,short_url"];

  for (const link of links) {
    const fileName = `QR_${link.token}.png`;
    const buffer = await createQrPngBuffer(link.shortUrl);
    zip.file(fileName, buffer);
    manifestRows.push(`${fileName},${link.token},${link.shortUrl}`);
  }

  zip.file("manifest.csv", manifestRows.join("\n"));

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}
