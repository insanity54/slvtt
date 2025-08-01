
// promisePool.ts
// @see https://medium.com/@blendedidea/promises-with-limited-parallelism-in-javascript-171291f94c59

type Task<T> = () => Promise<T>;
type Result<T> =
    | { status: "fulfilled"; value: T }
    | { status: "rejected"; reason: unknown };

interface Options {
    limit?: number;
}

export function promisePool<T>(tasks: Task<T>[], { limit = 5 }: Options = {}): Promise<Result<T>[]> {
    return new Promise((resolve) => {
        let activeCount = 0;
        let currentIndex = 0;
        const results: Result<T>[] = new Array(tasks.length);

        function runNext(): void {
            if (currentIndex >= tasks.length && activeCount === 0) {
                resolve(results);
                return;
            }

            if (activeCount >= limit || currentIndex >= tasks.length) {
                return;
            }

            const taskIndex = currentIndex++;
            const task = tasks[taskIndex];

            activeCount++;
            Promise.resolve(task())
                .then((result) => {
                    results[taskIndex] = { status: "fulfilled", value: result };
                })
                .catch((error) => {
                    results[taskIndex] = { status: "rejected", reason: error };
                })
                .finally(() => {
                    activeCount--;
                    runNext();
                });

            runNext();
        }

        for (let i = 0; i < limit; i++) {
            runNext();
        }
    });
}
