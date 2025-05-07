import { PopupOptions } from './popup.interface';

class Popup {
	private overlay: HTMLElement;
	private popup: HTMLElement | null;
	private options: PopupOptions;

	constructor(options: PopupOptions) {
		this.options = {
			overlayClose: true,
			closeButtonSelector: '.popup-close',
			...options,
		};

		this.popup = document.querySelector(this.options.popupSelector);

		if (!this.popup) {
			console.warn('Попап не найден: ', this.options.popupSelector);

			return;
		}
		this.overlay = this.popup.closest('.popup-overlay') as HTMLElement;

		this.init();
	}

	private init(): void {
		// Закрытие по клику на оверлей
		if (this.options.overlayClose) {
			this.overlay.addEventListener('click', (e) => {
				if (e.target === this.overlay) this.close();
			});
		}

		// Закрытие по кнопке (если есть)
		if (this.options.closeButtonSelector) {
			const closeButton = this.popup?.querySelector(this.options.closeButtonSelector);
			if (closeButton) {
				closeButton.addEventListener('click', () => this.close());
			}
		}
		// Скрываем попап изначально
		this.overlay.hidden = true;
	}

	public open(): void {
		this.overlay.hidden = false;
		this.overlay.style.pointerEvents = 'auto';
		setTimeout(() => {
			this.overlay.classList.add('active');
			this.popup?.classList.add('active');
		}, 10);

		if (this.options.onOpen) this.options.onOpen();
	}

	public close(): void {
		this.overlay.classList.remove('active');
		this.popup?.classList.remove('active');
		setTimeout(() => {
			this.overlay.hidden = true;
			this.overlay.style.pointerEvents = 'none';
			if (this.options.onClose) this.options.onClose();
		}, 300);
	}
}

export default Popup;
