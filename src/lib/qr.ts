export async function createQrSvg(value: string) {
  const QRCode = await import("qrcode");

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
