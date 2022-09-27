export default (e: Event): void => {
	const target = e.target as HTMLImageElement;
	if (target)
		target.src = '/imgs/minecraft/player.png';
};
