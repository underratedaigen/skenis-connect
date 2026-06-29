import QRCode from "qrcode";

export async function createQrPngBuffer(value: string) {
  return QRCode.toBuffer(value, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 1200,
    color: {
      dark: "#101820",
      light: "#FFFFFF"
    }
  });
}

export async function createQrSvg(value: string) {
  return QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: "#101820",
      light: "#FFFFFF"
    }
  });
}
