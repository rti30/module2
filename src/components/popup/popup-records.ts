import Popup from '@/ui/popup/popup';

const popup = new Popup({
	popupSelector: '#popup-record',
	overlayClose: true,
});

export default () => {
	document.querySelectorAll('.open-popup-records').forEach((btn) =>
		btn.addEventListener('click', () => {
			popup.open();
		}),
	);
};
