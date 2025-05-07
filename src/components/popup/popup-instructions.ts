import Popup from '@/ui/popup/popup';

const popup = new Popup({
	popupSelector: '#popup-rules',
	overlayClose: true,
});

export default () => {
	document.querySelectorAll('.open-popup-instructions').forEach((btn) =>
		btn.addEventListener('click', () => {
			popup.open();
		}),
	);
};
