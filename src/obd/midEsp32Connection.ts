import { connectToMerivaMidEsp32, MID_ESP32_DEVICE_NAME, type RealElmConnection } from './bluetoothManager';

export type MidEsp32Status =
  | 'PARANDO'
  | 'PROCURANDO'
  | 'CONECTANDO'
  | 'ESP32 CONECTADO'
  | 'ELM RESPONDENDO'
  | 'ERRO';

export interface MidEsp32State {
  status: MidEsp32Status;
  connection: RealElmConnection | null;
  error: string | null;
  attempts: number;
}

type Listener = (state: MidEsp32State) => void;

const RETRY_MS = 2000;

export class MidEsp32ConnectionManager {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private connecting = false;
  private readonly listeners = new Set<Listener>();
  private state: MidEsp32State = {
    status: 'PROCURANDO',
    connection: null,
    error: null,
    attempts: 0,
  };

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => this.listeners.delete(listener);
  }

  getState(): MidEsp32State {
    return { ...this.state };
  }

  private emit(): void {
    const snapshot = { ...this.state };
    for (const listener of this.listeners) listener(snapshot);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.state = { ...this.state, status: 'PROCURANDO', error: null };
    this.emit();
    void this.tryConnect();
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;

    const connection = this.state.connection;
    this.state = {
      status: 'PARANDO',
      connection: null,
      error: null,
      attempts: this.state.attempts,
    };
    this.emit();

    if (connection) {
      try {
        await connection.session.close();
      } catch {
        // conexão já encerrada
      }
    }
  }

  private scheduleRetry(): void {
    if (!this.running || this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.tryConnect();
    }, RETRY_MS);
  }

  private async tryConnect(): Promise<void> {
    if (!this.running || this.connecting || this.state.connection) return;
    this.connecting = true;

    const attempts = this.state.attempts + 1;
    this.state = {
      ...this.state,
      status: 'PROCURANDO',
      error: null,
      attempts,
    };
    this.emit();

    try {
      this.state = { ...this.state, status: 'CONECTANDO' };
      this.emit();

      const connection = await connectToMerivaMidEsp32();

      if (!this.running) {
        await connection.session.close();
        return;
      }

      this.state = {
        ...this.state,
        status: 'ELM RESPONDENDO',
        connection,
        error: null,
      };
      this.emit();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'ESP32 MID não respondeu.';
      this.state = {
        ...this.state,
        status: 'ERRO',
        connection: null,
        error: message,
      };
      this.emit();
      this.scheduleRetry();
    } finally {
      this.connecting = false;
    }
  }
}

export const midEsp32Connection = new MidEsp32ConnectionManager();
export { MID_ESP32_DEVICE_NAME };
