import { shouldScheduleNotification } from "../notifcationsUtils";

describe("shouldScheduleNotification", () => {
  it("returns false if the notification time is in the past", () => {
    const expiry = new Date(Date.now() - 2 * 86400000);
    const result = shouldScheduleNotification(expiry, 1);
    console.log("Test: Past expiry - should be false ➡️", result);
    expect(result).toBe(false);
  });

  it("returns true if the notification time is in the future", () => {
    const expiry = new Date(Date.now() + 3 * 86400000);
    const result = shouldScheduleNotification(expiry, 2);
    console.log(
      "Test: Future expiry, 2 days before - should be true ➡️",
      result
    );
    expect(result).toBe(true);
  });

  it("returns false if daysBefore pushes the trigger to the past", () => {
    const expiry = new Date(Date.now() + 1 * 86400000);
    const result = shouldScheduleNotification(expiry, 3);
    console.log(
      "Test: Expiry soon, 3 days before - should be false ➡️",
      result
    );
    expect(result).toBe(false);
  });

  it("returns true for a same-day trigger (0 days before)", () => {
    const expiry = new Date(Date.now() + 0.5 * 86400000);
    const result = shouldScheduleNotification(expiry, 0);
    console.log(
      "Test: Expiring today, 0 days before - should be true ➡️",
      result
    );
    expect(result).toBe(true);
  });
});
