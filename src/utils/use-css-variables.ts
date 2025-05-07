export class UseCssVariables {
	private constructor() {}

	static setRootVariables(variables: { [key: string]: string }) {
		Object.entries(variables).forEach(([name, value]) => {
			document.documentElement.style.setProperty(name.startsWith('--') ? name : `--${name}`, value);
		});
	}

	static getRootCSSVariable(name: string) {
		return getComputedStyle(document.documentElement).getPropertyValue(
			name.startsWith('--') ? name : `--${name}`,
		);
	}
}
