import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../../src/app";

describe("Health Endpoints", () => {
  describe("GET /api/health", () => {
    it("should return 200 with status and timestamp", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ok");
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
