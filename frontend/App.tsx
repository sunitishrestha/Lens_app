import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/store/authStore';

export default function App() {
  return <AuthProvider><AppNavigator /></AuthProvider>;
}
