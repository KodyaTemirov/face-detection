import Button from '../global/Button.vue';
import Layout from '../global/Layout.vue';
import Card from '../global/Card.vue';
import CheckedItem from '../global/CheckedItem.vue';
import Icon from '../global/Icon.vue';
import Alert from '../global/Alert.vue';

const components = [
	{ name: 'Button', component: Button },
	{ name: 'Layout', component: Layout },
	{ name: 'Card', component: Card },
	{ name: 'CheckedItem', component: CheckedItem },
	{ name: 'Icon', component: Icon },
	{ name: 'Alert', component: Alert },
];

export default {
	install(app) {
		components.forEach(({ name, component }) => {
			app.component(name, component);
		});
	},
};
