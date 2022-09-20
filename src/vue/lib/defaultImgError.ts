export default (e: Event): void => {
	const target = e.target as HTMLImageElement;
	if (target) target.src = '/src/assets/imgs/minecraft/player.png';
};
