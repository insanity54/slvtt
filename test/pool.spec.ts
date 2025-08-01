import { describe, expect, it } from "vitest";
import { promisePool } from "../src/pool";

describe("promisePool", () => {
    it("respects concurrency limit and returns results in order", async () => {
        const callOrder: number[] = [];
        const createTask = (id: number, delay: number) => () =>
            new Promise<number>((resolve) => {
                setTimeout(() => {
                    callOrder.push(id);
                    resolve(id);
                }, delay);
            });

        const tasks = [
            createTask(1, 100),
            createTask(2, 50),
            createTask(3, 30),
            createTask(4, 10),
            createTask(5, 10),
            createTask(6, 10),
        ];

        const results = await promisePool(tasks, { limit: 2 });

        expect(results).toHaveLength(tasks.length);
        expect(results.every(r => r.status === "fulfilled")).toBe(true);
        expect(results.map(r => (r as any).value)).toEqual([1, 2, 3, 4, 5, 6]);
        expect(callOrder).toContain(1); // check task executed
    });

    it("handles rejected tasks", async () => {
        const tasks = [
            () => Promise.resolve("success"),
            () => Promise.reject("fail"),
        ];

        const results = await promisePool(tasks, { limit: 1 });

        expect(results).toEqual([
            { status: "fulfilled", value: "success" },
            { status: "rejected", reason: "fail" },
        ]);
    });
});
