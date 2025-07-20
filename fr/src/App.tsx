import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { GenerateFlowchartPage } from './pages/GenerateFlowchartPage';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="documentation" element={<DocumentationPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="generate-flowchart" element={<GenerateFlowchartPage />} />
      </Route>
    </Routes>
  );
}

export default App;
