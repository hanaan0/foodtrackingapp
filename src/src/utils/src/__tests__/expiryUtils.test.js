// This file imports the logic from expiryUtils.js and tests it
import { isExpired } from "../../expiryUtils";

describe("isExpired", () => {
  it("should return true for a past date", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const result = isExpired(past);
    console.log("Past date result:", result);
    expect(result).toBe(true);
  });

  it("should return false for today's date", () => {
    const today = new Date().toISOString();
    const result = isExpired(today);
    console.log("Today result:", result);
    expect(result).toBe(false);
  });

  it("should return false for a future date", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    const result = isExpired(future);
    console.log("Future date result:", result);
    expect(result).toBe(false);
  });
});
