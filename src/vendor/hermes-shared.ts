export type ConnectionState = "idle" | "connecting" | "open" | "closed" | "error";
export type GatewayEventName =
  | "message.delta"
  | "message.complete"
  | "error"
  | "disconnect";

export type GatewayEvent = {
  type: GatewayEventName;
  payload?: unknown;
  code?: number;
  message?: string;
};

export class JsonRpcGatewayClient {
  connectionState: ConnectionState = "idle";
  private readonly options: {
    closedErrorMessage?: string;
    connectErrorMessage?: string;
    notConnectedErrorMessage?: string;
    onSocketClose?: (event: { code?: number }) => void;
    requestIdPrefix?: string;
  };

  constructor(options: typeof this.options = {}) {
    this.options = options;
  }

  async connect(_url: string): Promise<void> {
    const socket = new WebSocket(_url);
    this.connectionState = "connecting";
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener("open", () => {
        this.connectionState = "open";
        resolve();
      });
      socket.addEventListener("error", () => {
        this.connectionState = "error";
        reject(new Error(this.options.connectErrorMessage ?? "WebSocket connection failed"));
      });
      socket.addEventListener("close", (event) => {
        this.options.onSocketClose?.(event);
      });
    });
  }

  async request<T>(_method: string, _params?: unknown): Promise<T> {
    return undefined as T;
  }

  close(): void {
    this.connectionState = "closed";
  }
}

export function buildHermesWebSocketUrl(options: {
  authParam?: readonly [string, string];
  basePath?: string;
  host?: string;
  protocol?: string;
  path?: string;
}): string {
  const path = options.path ?? "/api/ws";
  const host = options.host ?? "localhost";
  const protocol = options.protocol ?? "ws:";
  const basePath = (options.basePath ?? "").replace(/\/+$/, "");
  const authPair = options.authParam;
  const params = authPair ? `?${authPair[0]}=${encodeURIComponent(authPair[1])}` : "";
  return `${protocol}//${host}${basePath}${path}${params}`;
}

export function createCronTriggerController(
  _onRunningChange?: (key: string, running: boolean) => void,
) {
  const running = new Map<string, Promise<unknown>>();

  return {
    run: async <T>(
      key: string,
      action: () => Promise<T>,
      onStarted?: () => void,
    ): Promise<{ started: boolean; value: T | null }> => {
      if (running.has(key)) {
        return { started: false, value: null };
      }

      let releaseMarker!: () => void;
      const marker = new Promise<void>((resolve) => {
        releaseMarker = resolve;
      });
      running.set(key, marker);
      try {
        _onRunningChange?.(key, true);
        onStarted?.();
        const promise = action();
        const value = await promise;
        return { started: true, value };
      } finally {
        running.delete(key);
        releaseMarker();
        _onRunningChange?.(key, false);
      }
    },
    isRunning: (key: string) => running.has(key),
  };
}
