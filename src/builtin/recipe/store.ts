import { ref } from 'vue';
import { typeFurnace, typeSmithing, typeStoneCutter } from './interface';

export const selectedRecipeType = ref<typeFurnace | typeStoneCutter | typeSmithing | 'crafting' | 'player'>('player');
export const selectedRecipeData = ref<unknown>(null);
export const selectedRecipeName = ref<string | null>(null);
