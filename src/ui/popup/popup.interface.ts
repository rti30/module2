export interface PopupOptions {
	popupSelector: string;
	onOpen?: () => void;
	onClose?: () => void;
	overlayClose?: boolean;
	closeButtonSelector?: string;
}
