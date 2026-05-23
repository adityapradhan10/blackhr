import reactRefresh from 'eslint-plugin-react-refresh';
import config from '../../packages/eslint-config/react.ts';

export default [...config, reactRefresh.configs.vite];
