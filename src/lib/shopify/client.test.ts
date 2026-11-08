import { describe, expect, it, vi } from "vitest";
import { createShopifyClient, type TypedDocument } from "./client";
import { ShopifyError } from "./errors";

const doc = { toString: () => "query Test { shop { name } }" } as TypedDocument<
  { shop: { name: string } },
  Record<string, never>
>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function setup(responses: Array<Response | Error>) {
  const fetchMock = vi.fn<typeof fetch>(async () => {
    const next = responses.shift();
    if (!next) throw new Error("no more responses");
    if (next instanceof Error) throw next;
    return next;
  });
  const client = createShopifyClient({
    storeDomain: "test-store.myshopify.com",
    apiVersion: "2026-07",
    privateToken: "secret",
    fetch: fetchMock,
    sleep: async () => {},
  });
  return { client, fetchMock };
}

describe("shopify client", () => {
  it("sends the private token and returns data", async () => {
    const { client, fetchMock } = setup([json({ data: { shop: { name: "SS" } } })]);
    await expect(client.request(doc, { variables: {} })).resolves.toEqual({ shop: { name: "SS" } });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://test-store.myshopify.com/api/2026-07/graphql.json");
    expect((init?.headers as Record<string, string>)["Shopify-Storefront-Private-Token"]).toBe("secret");
  });

  it("retries 5xx and network failures, then succeeds", async () => {
    const { client, fetchMock } = setup([
      json({}, 503),
      new TypeError("fetch failed"),
      json({ data: { shop: { name: "SS" } } }),
    ]);
    await expect(client.request(doc, { variables: {} })).resolves.toEqual({ shop: { name: "SS" } });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not retry 4xx", async () => {
    const { client, fetchMock } = setup([json({}, 401)]);
    await expect(client.request(doc, { variables: {} })).rejects.toMatchObject({ kind: "http", status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws a graphql error with all messages", async () => {
    const { client } = setup([json({ errors: [{ message: "Field 'x' doesn't exist" }] })]);
    const error = await client.request(doc, { variables: {} }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ShopifyError);
    expect(error).toMatchObject({ kind: "graphql", message: "Field 'x' doesn't exist" });
  });

  it("retries THROTTLED graphql errors", async () => {
    const { client, fetchMock } = setup([
      json({ errors: [{ message: "Throttled", extensions: { code: "THROTTLED" } }] }),
      json({ data: { shop: { name: "SS" } } }),
    ]);
    await expect(client.request(doc, { variables: {} })).resolves.toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("respects retries: 0 for mutations", async () => {
    const { client, fetchMock } = setup([json({}, 503)]);
    await expect(client.request(doc, { variables: {}, retries: 0 })).rejects.toMatchObject({ kind: "http" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
