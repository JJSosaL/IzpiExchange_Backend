export type Properties<Object> = Readonly<{
	[Key in keyof Object]: Object[Key];
}>;
