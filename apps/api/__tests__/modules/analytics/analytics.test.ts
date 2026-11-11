import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../../src/app";
import { createTestToken, authCookie } from "../../helpers/auth";
import { getPrisma } from "@dataflow/database";

describe("Analytics Endpoints", () => {
  let testUserId: string;
  let testUploadId: string;
  let authToken: string;

  beforeAll(async () => {
    const user = await getPrisma().user.create({
      data: { email: "test-analytics@example.com", name: "Analytics Test" },
    });
    testUserId = user.id;
    authToken = createTestToken(testUserId, "test-analytics@example.com");

    const upload = await getPrisma().upload.create({
      data: {
        filename: "analytics-test.csv",
        filepath: "/tmp/analytics-test.csv",
        status: "COMPLETED",
        processedRows: 4,
        successRows: 4,
        errorRows: 0,
        userId: testUserId,
      },
    });
    testUploadId = upload.id;

    await getPrisma().sale.createMany({
      data: [
        {
          date: new Date("2024-01-01"),
          product: "Product A",
          category: "Electronics",
          price: 100,
          quantity: 2,
          country: "Brazil",
          total: 200,
          uploadId: testUploadId,
        },
        {
          date: new Date("2024-01-01"),
          product: "Product B",
          category: "Clothing",
          price: 50,
          quantity: 3,
          country: "USA",
          total: 150,
          uploadId: testUploadId,
        },
        {
          date: new Date("2024-01-02"),
          product: "Product A",
          category: "Electronics",
          price: 100,
          quantity: 1,
          country: "Brazil",
          total: 100,
          uploadId: testUploadId,
        },
        {
          date: new Date("2024-01-02"),
          product: "Product C",
          category: "Electronics",
          price: 200,
          quantity: 1,
          country: "Germany",
          total: 200,
          uploadId: testUploadId,
        },
      ],
    });
  });

  afterAll(async () => {
    await getPrisma().sale.deleteMany({
      where: { upload: { userId: testUserId } },
    });

    await getPrisma().upload.deleteMany({
      where: { userId: testUserId },
    });

    await getPrisma().user.delete({
      where: { id: testUserId },
    });
  });

  describe("GET /api/analytics", () => {
    // teste 1: 401 sem token
    it("should return 401 without token", async () => {
      const response = await request(app).get("/api/analytics");
      expect(response.status).toBe(401);
    });

    // teste 2: 200 com dados corretos
    it("should return 200 with valid token and correct aggregated data", async () => {
      const response = await request(app)
        .get("/api/analytics")
        .set("Cookie", authCookie(authToken));

      expect(response.status).toBe(200);
      expect(response.body.totalRevenue).toBe(650);
      expect(response.body.totalSales).toBe(4);
      expect(response.body.revenueByCountry).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ country: "Brazil", total: 300 }),
          expect.objectContaining({ country: "USA", total: 150 }),
          expect.objectContaining({ country: "Germany", total: 200 }),
        ]),
      );

      expect(response.body.topProducts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ product: "Product A", quantity: 3 }),
          expect.objectContaining({ product: "Product B", quantity: 3 }),
        ]),
      );

      expect(response.body.salesPerDay).toHaveLength(2);

      expect(response.body.categoryPerformance).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ category: "Electronics", total: 500 }),
          expect.objectContaining({ category: "Clothing", total: 150 }),
        ]),
      );
    });
  });
});
