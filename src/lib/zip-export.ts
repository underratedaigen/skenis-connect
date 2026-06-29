import JSZip from "jszip";
import { createQrSvg } from "@/lib/qr";

type LinkForZip = {
  token: string;
  shortUrl: string;
};

export async function buildQrZip(links: LinkForZip[]) {
  const zip = new JSZip();
  const manifestRows = ["file_name,token,short_url"];

  for (const link of links) {
    const fileName = `QR_${link.token}.svg`;
    const svg = await createQrSvg(link.shortUrl);
    zip.file(fileName, svg);
    manifestRows.push(`${fileName},${link.token},${link.shortUrl}`);
  }

  zip.file("manifest.csv", manifestRows.join("\n"));

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 }
  });
}
