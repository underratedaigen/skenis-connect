import { describe, expect, it } from "vitest";
import { getProductPrice } from "../src/lib/product-pricing";
describe("existing NFC product commercial thresholds", () => {
  it.each([
    [1, 19.99, 19.99],
    [2, 19.99, 39.98],
    [24, 19.99, 479.76],
    [25, 16.99, 424.75],
    [99, 16.99, 1682.01],
    [100, 13.99, 1399],
    [500, 13.99, 6995],
  ])("prices %i cards at the unchanged tier", (quantity, unit, total) => {
    expect(getProductPrice(quantity)).toEqual({
      unitPrice: unit,
      totalPrice: total,
    });
  });
});
