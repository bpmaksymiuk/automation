import { ShellProvider } from './shell/ShellContext';
import ShellRoot from './shell/ShellRoot';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';

export default function App() {
  return (
    <ShellProvider>
      <ShellRoot />
    </ShellProvider>
  );
}
