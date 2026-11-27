export const id = 'capture-button';
const label = 'Create Capture';

export const buttonInsert = /*html*/ `
	<div>
		<a id="${id}" href="#" title="Create Capture"  target="_blank" class="text-white text-sm md:text-base font-medium leading-[125%] bg-[#DD2D56] inline-flex items-center justify-center gap-2.5 md:px-3 md:py-2 rounded-[10px] md:w-auto w-9 md:h-full h-9 transition-all hover:text-white hover:opacity-85" rel="nofollow">
			<i class="icon icon-download md:text-[20px] text-[16px]" aria-hidden="true" style="transform: rotate(0deg);"></i>

			<span class="hidden md:inline-block">${label}</span>
		</a>
	</div>
	`;
