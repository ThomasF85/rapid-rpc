import { act, renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { setUpClientApi } from "./testutils";
import { Fixture, fixtures } from "./fixtures";

test.each(fixtures)(
  "client api queries work with batching",
  async (fixture: Fixture) => {
    const api = setUpClientApi(fixture.createServer, true);
    function useQueries() {
      return fixture.queries.map((q) => api[q.method].useQuery(...q.args));
    }
    const { result } = renderHook(useQueries);

    await waitFor(() => {
      fixture.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });
    if (fixture.hasContext) {
      expect(fixture.getNumberOfContextCalls!()).toBe(
        fixture.expectedContextCalls!(true, 1, 0, 0)
      );
    }
    if (fixture.hasMiddleware) {
      expect(fixture.getNumberOfMiddlewareCalls!()).toBe(
        fixture.expectedMiddlewareCalls!(1, 0, 0)
      );
    }
  }
);

test.each(fixtures)(
  "client api mutations work with batching",
  async (fixture: Fixture) => {
    const api = setUpClientApi(fixture.createServer, true);
    function useQueries() {
      return fixture.events.queries.map((q) =>
        api[q.method].useQuery(...q.args)
      );
    }

    function useMutations() {
      return fixture.events.mutations.map((m) => api[m.method].useMutation());
    }

    const { result } = renderHook(useQueries);
    const { result: mutationResult } = renderHook(useMutations);

    await waitFor(() => {
      fixture.events.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.initialExpected);
      });
    });

    await act(async () => {
      let promises: any[] = [];
      for (let i = 0; i < fixture.events.mutations.length; i++) {
        for (const args of fixture.events.mutations[i].args) {
          //@ts-ignore
          promises.push(mutationResult.current[i].trigger(...args));
        }
      }
      await Promise.all(promises);
    });

    await act(async () => {
      let promises: any[] = [];
      for (const q of result.current) {
        promises.push(q.mutate());
      }
      await Promise.all(promises);
    });

    await waitFor(() => {
      fixture.events.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });

    if (fixture.hasContext) {
      expect(fixture.getNumberOfContextCalls!()).toBe(
        fixture.expectedContextCalls!(true, 0, 2, 1)
      );
    }
    if (fixture.hasMiddleware) {
      expect(fixture.getNumberOfMiddlewareCalls!()).toBe(
        fixture.expectedMiddlewareCalls!(0, 2, 1)
      );
    }
  }
);
