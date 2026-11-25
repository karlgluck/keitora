import { describe, expect, it } from "vitest";
import { taskProjectArg } from "./taskProject";

describe("taskProjectArg", () => {
  it("omits the active project", () => {
    expect(taskProjectArg("proj", "proj")).toBeUndefined();
  });

  it("names any other project by its registry key", () => {
    expect(taskProjectArg("other-proj", "proj")).toBe("other-proj");
  });

  it("names the project when none is active", () => {
    expect(taskProjectArg("proj", null)).toBe("proj");
  });
});
