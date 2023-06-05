import { create } from "../src/server/index";
import { act, renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { setUpClientApi } from "./testutils";
import { fixtures } from "./fixtures";

test.each(fixtures)(
  "server api queries work",
  (apiOptions, queries, events) => {
    const [serverApi] = create(apiOptions());
    queries.forEach((q) => {
      expect(serverApi[q.method](...q.args)).toStrictEqual(q.expected);
    });
  }
);

test.each(fixtures)(
  "server api mutations work",
  (apiOptions, queries, events) => {
    const [serverApi] = create(apiOptions());
    for (let i = 0; i < events.mutations.length; i++) {
      for (const args of events.mutations[i].args) {
        serverApi[events.mutations[i].method](...args);
      }
    }
    events.queries.forEach((q) => {
      expect(serverApi[q.method](...q.args)).toStrictEqual(q.expected);
    });
  }
);

test.each(fixtures)(
  "client api queries work",
  async (apiOptions, queries, events) => {
    const api = setUpClientApi(apiOptions, false);
    function useQueries() {
      return queries.map((q) => api[q.method].useQuery(...q.args));
    }
    const { result } = renderHook(useQueries);

    await waitFor(() => {
      queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });
  }
);

test.each(fixtures)(
  "client api mutations work",
  async (apiOptions, queries, events) => {
    const api = setUpClientApi(apiOptions, false);
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

    for (let i = 0; i < events.mutations.length; i++) {
      for (const args of events.mutations[i].args) {
        await act(async () => {
          //@ts-ignore
          await mutationResult.current[i].mutate(...args);
        });
      }
    }

    for (const q of result.current) {
      await act(async () => await q.mutate());
    }

    await waitFor(() => {
      events.queries.forEach((q, index) => {
        expect(result.current[index].data).toStrictEqual(q.expected);
      });
    });
  }
);
