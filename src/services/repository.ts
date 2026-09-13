/**
 * Repository abstraction.
 *
 * The UI and services never talk to localStorage directly. They depend on
 * this interface, which the prototype satisfies with LocalStorageRepository.
 * A future backend (REST / GraphQL / Supabase / FHIR-compatible) can be
 * introduced by implementing the same interface as an ApiRepository, with
 * no changes required in services or components.
 */
export interface Repository<T extends { id: string }> {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(item: T): T;
  update(id: string, patch: Partial<T>): T | undefined;
  remove(id: string): void;
  seedIfEmpty(seed: T[]): void;
}

const NAMESPACE = 'esigra:v1:';

export class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  private key: string;

  constructor(collectionName: string) {
    this.key = `${NAMESPACE}${collectionName}`;
  }

  private read(): T[] {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  private write(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch {
      // Storage unavailable (e.g. private mode) - fail silently for prototype
    }
  }

  seedIfEmpty(seed: T[]): void {
    const existing = localStorage.getItem(this.key);
    if (existing === null) {
      this.write(seed);
    }
  }

  getAll(): T[] {
    return this.read();
  }

  getById(id: string): T | undefined {
    return this.read().find((i) => i.id === id);
  }

  create(item: T): T {
    const items = this.read();
    items.push(item);
    this.write(items);
    return item;
  }

  update(id: string, patch: Partial<T>): T | undefined {
    const items = this.read();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch };
    this.write(items);
    return items[idx];
  }

  remove(id: string): void {
    const items = this.read().filter((i) => i.id !== id);
    this.write(items);
  }
}
