export const useAnimationScore = (
	from: number,
	to: number,
	el: HTMLDivElement,
	className: string,
) => {
	return (progress: number) => {
		const value = Math.floor(from + (to - from) * progress);
		el.textContent = value.toString();
		el.classList.add(className);
	};
};

export const useAfterAnimationScore = (el: HTMLDivElement, className: string) => () => {
	el.classList.remove(className);
};
