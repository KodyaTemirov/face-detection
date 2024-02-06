import { createPinia } from 'pinia';

const pinia = createPinia();

const state = {
	isAuth: false,
};

export const useStore = pinia(() => {
	return {
		state,
		setAuth(value) {
			state.isAuth = value;
		},
	};
});

export default pinia;
