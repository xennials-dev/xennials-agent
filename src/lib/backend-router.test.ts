import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import {
  getBuildType,
  getResolvedBackendUrl,
  getBackendTargetInfo,
  setBackendTarget,
  resolveApiUrl,
  probeBackend,
} from "./backend-router";

describe("backend-router", () => {
  let memoryStorage: Record<string, string> = {};

  beforeEach(() => {
    memoryStorage = {};
    const mockStorage = {
      getItem: (key: string) => memoryStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete memoryStorage[key];
      },
      clear: () => {
        memoryStorage = {};
      },
    };
    vi.stubGlobal("localStorage", mockStorage);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    memoryStorage = {};
  });

  describe("getBuildType", () => {
    it("detects build environment correctly", () => {
      const build = getBuildType();
      expect(["netlify", "vite-dev", "electron", "production-web"]).toContain(build);
    });
  });

  describe("getResolvedBackendUrl and setBackendTarget", () => {
    it("returns empty string by default when same origin", () => {
      const url = getResolvedBackendUrl();
      expect(typeof url).toBe("string");
    });

    it("honors localStorage override when set", () => {
      setBackendTarget("http://192.168.1.100:9119/");
      expect(getResolvedBackendUrl()).toBe("http://192.168.1.100:9119");
      expect(localStorage.getItem("hermes_backend_target")).toBe("http://192.168.1.100:9119");
    });

    it("resets target when null is passed", () => {
      setBackendTarget("http://192.168.1.100:9119");
      expect(getResolvedBackendUrl()).toBe("http://192.168.1.100:9119");

      setBackendTarget(null);
      expect(localStorage.getItem("hermes_backend_target")).toBeNull();
    });
  });

  describe("getBackendTargetInfo", () => {
    it("identifies local-default target", () => {
      setBackendTarget("http://127.0.0.1:9119");
      const info = getBackendTargetInfo();
      expect(info.type).toBe("local-default");
      expect(info.port).toBe("9119");
      expect(info.host).toBe("127.0.0.1:9119");
    });

    it("identifies local-custom target with different port", () => {
      setBackendTarget("http://localhost:8080");
      const info = getBackendTargetInfo();
      expect(info.type).toBe("local-custom");
      expect(info.port).toBe("8080");
    });

    it("identifies remote-custom target", () => {
      setBackendTarget("https://hermes.example.com");
      const info = getBackendTargetInfo();
      expect(info.type).toBe("remote-custom");
      expect(info.protocol).toBe("https:");
      expect(info.isCrossOrigin).toBe(true);
    });
  });

  describe("resolveApiUrl", () => {
    it("resolves relative path when no target is set", () => {
      setBackendTarget(null);
      expect(resolveApiUrl("/api/status")).toBe("/api/status");
      expect(resolveApiUrl("/api/status", "/prefix")).toBe("/prefix/api/status");
    });

    it("prepends target when configured", () => {
      setBackendTarget("http://127.0.0.1:9119");
      expect(resolveApiUrl("/api/status")).toBe("http://127.0.0.1:9119/api/status");
      expect(resolveApiUrl("/api/status", "/hermes")).toBe("http://127.0.0.1:9119/hermes/api/status");
    });
  });

  describe("probeBackend", () => {
    it("returns successful result when backend responds with JSON", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({
            ok: true,
            gateway_state: "running",
            active_sessions: 2,
            version: "0.9.0",
          }),
        })),
      );

      const res = await probeBackend("http://127.0.0.1:9119");
      expect(res.ok).toBe(true);
      expect(res.gatewayState).toBe("running");
      expect(res.activeSessions).toBe(2);
      expect(res.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it("returns error result when backend responds with HTML", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "text/html" }),
          json: async () => ({}),
        })),
      );

      const res = await probeBackend("http://127.0.0.1:9119");
      expect(res.ok).toBe(false);
      expect(res.error).toContain("HTML");
    });
  });
});
