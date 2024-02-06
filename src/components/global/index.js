import Button from '../global/Button.vue';
import Layout from '../global/Layout.vue';

const components = [
	{ name: 'Button', component: Button },
	{ name: 'Layout', component: Layout },
];

export default {
	install(app) {
		components.forEach(({ name, component }) => {
			app.component(name, component);
		});
	},
};
