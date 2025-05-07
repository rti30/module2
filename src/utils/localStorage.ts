type StorageType = 'local' | 'session';
type StoredValue<T> = {
	value: T;
	expires: number | null;
};

export class StorageService<T = unknown> {
	private storage: Storage;

	constructor(storageType: StorageType = 'local') {
		this.storage = storageType === 'local' ? localStorage : sessionStorage;
	}

	set(key: string, value: T, ttl: number | null = null): boolean {
		try {
			const item: StoredValue<T> = {
				value,
				expires: ttl ? Date.now() + ttl * 1000 : null,
			};
			this.storage.setItem(key, JSON.stringify(item));
			return true;
		} catch (error) {
			console.error('StorageService [set]: ошибка');
			return false;
		}
	}

	get(key: string, defaultValue: T | null = null): T | null {
		try {
			const itemStr = this.storage.getItem(key);
			if (!itemStr) return defaultValue;

			const item = JSON.parse(itemStr) as StoredValue<T>;
			if (item.expires && Date.now() > item.expires) {
				this.remove(key);
				return defaultValue;
			}
			return item.value;
		} catch (error) {
			console.error('StorageService [get]: ошибка', error);
			return defaultValue;
		}
	}

	remove(key: string): void {
		this.storage.removeItem(key);
	}

	has(key: string): boolean {
		return this.storage.getItem(key) !== null;
	}

	clear(): void {
		this.storage.clear();
	}
}
