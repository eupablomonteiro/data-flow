import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import request from "supertest";
import axios from "axios";
import { app } from "../../../src/app";
import { createTestToken, authCookie } from "../../helpers/auth";
import { getPrisma } from "@dataflow/database";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("Auth Endpoints", () => {
  let testUserId: string;

  beforeAll(async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({
      data: {
        email: "test-auth@example.com",
        name: "Test Auth",
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    const prisma = getPrisma();
    await prisma.user.delete({
      where: { id: testUserId },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/auth/me", () => {
    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Authentication token is missing.");
    });

    it("should return 200 with valid token", async () => {
      const token = createTestToken(testUserId, "test-auth@example.com");
      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", authCookie(token));

      expect(response.status).toBe(200);
      expect(response.body.email).toBe("test-auth@example.com");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return 200 and clear cookie", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged out successfully.");
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /api/auth/github/callback", () => {
    it("should redirect to dashboard with cookie on success", async () => {
      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { access_token: "fake-github-access-token" },
      });

      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          id: 12345,
          email: "user@github.com",
          name: "Test User",
          login: "testuser",
          avatar_url: "https://avatar.url",
        },
      });

      const response = await request(app)
        .get("/api/auth/github/callback")
        .query({ code: "valid-github-code" });

      expect(response.status).toBe(302);
      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = Array.isArray(response.headers["set-cookie"])
        ? response.headers["set-cookie"]
        : [response.headers["set-cookie"]];
      expect(cookies.some((c: string) => c.includes("auth_token="))).toBe(true);
      expect(response.headers["location"]).toContain("/dashboard");
    });

    it("should redirect with auth_error on failed callback", async () => {
      const response = await request(app)
        .get("/api/auth/github/callback")
        .query({ code: "bad-code" });

      expect(response.status).toBe(302);
      expect(response.headers["location"]).toContain("/?auth_error=");
      expect(response.headers["location"]).toContain(
        encodeURIComponent("Failed to validate github user."),
      );
    });
  });

  describe("GET /api/auth/google/callback", () => {
    it("should redirect to dashboard with cookie on success", async () => {
      (axios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: { access_token: "fake-google-access-token" },
      });

      (axios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        data: {
          id: "google-id-123",
          email: "user@gmail.com",
          name: "Google User",
          picture: "https://picture.url",
        },
      });

      const response = await request(app)
        .get("/api/auth/google/callback")
        .query({ code: "valid-google-code" });

      expect(response.status).toBe(302);
      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = Array.isArray(response.headers["set-cookie"])
        ? response.headers["set-cookie"]
        : [response.headers["set-cookie"]];
      expect(cookies.some((c: string) => c.includes("auth_token="))).toBe(true);
      expect(response.headers["location"]).toContain("/dashboard");
    });

    it("should redirect with auth_error on failed callback", async () => {
      const response = await request(app)
        .get("/api/auth/google/callback")
        .query({ code: "bad-code" });

      expect(response.status).toBe(302);
      expect(response.headers["location"]).toContain("/?auth_error=");
      expect(response.headers["location"]).toContain(
        encodeURIComponent("Failed to validate google user."),
      );
    });

    it("should return 422 when no code is provided", async () => {
      const response = await request(app).get("/api/auth/google/callback");

      expect(response.status).toBe(422);
    });
  });
});
