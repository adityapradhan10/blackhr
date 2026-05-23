import reactRefresh from 'eslint-plugin-react-refresh';
import config from '../../packages/eslint-config/react.js';

export default [...config, reactRefresh.configs.vite];
