import { create } from "../src/server/index";
import { act, renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { setUpClientApi } from "./testutils";
import { fixtures } from "./fixtures";

test.each(fixtures)(
  "server api queries work",
  (createServer, queries, events, checkCalls) => {
    const [serverApi] = createServer();
    queries.forEach(async (q) => {
      expect(await serverApi[q.method](...q.args)).toStrictEqual(q.expected);
    });
  }
);

test.each(fixtures)(
  "server api mutations work",
  async (createServer, queries, events, checkCalls) => {
    const [serverApi] = createServer();
    for (let i = 0; i < events.mutations.length; i++) {
      for (const args of events.mutations[i].args) {
        await serverApi[events.mutations[i].method](...args);
      }
    }
    events.queries.forEach(async (q) => {
      expect(await serverApi[q.method](...q.args)).toStrictEqual(q.expected);
    });
  }
);

test.each(fixtures)(
  "client api queries work",
  async (createServer, queries, events, checkCalls) => {
    const api = setUpClientApi(createServer, false);
    function useQueries() {
      return queries.map((q) => api[q.method].useQuery(...q.args));
    }
    const { result } = renderHook(useQueries);

    await waitFor(() => {
      queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });
    if (checkCalls) {
      checkCalls(false, false);
    }
  }
);

test.each(fixtures)(
  "client api mutations work",
  async (createServer, queries, events, checkCalls) => {
    const api = setUpClientApi(createServer, false);
    function useQueries() {
      return events.queries.map((q) => api[q.method].useQuery(...q.args));
    }

    function useMutations() {
      return events.mutations.map((m) => api[m.method].useMutation());
    }

    const { result } = renderHook(useQueries);
    const { result: mutationResult } = renderHook(useMutations);

    await waitFor(() => {
      events.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.initialExpected);
      });
    });

    await act(async () => {
      let promises: any[] = [];
      for (let i = 0; i < events.mutations.length; i++) {
        for (const args of events.mutations[i].args) {
          //@ts-ignore
          promises.push(mutationResult.current[i].mutate(...args));
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
      events.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });

    if (checkCalls) {
      checkCalls(true, false);
    }
  }
);
