import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Text2Clip } from './pages/Text2Clip';
import { Ovi } from './pages/Ovi';
import { AgentCanvasTool } from './pages/AgentCanvasTool';
import { InsightsIndex } from './pages/InsightsIndex';
import { InsightDetail } from './pages/InsightDetail';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work/text2clip" element={<Text2Clip />} />
          <Route path="work/ovi" element={<Ovi />} />
          <Route path="tools/agent-canvas" element={<AgentCanvasTool />} />
          <Route path="insights" element={<InsightsIndex />} />
          <Route path="insights/:slug" element={<InsightDetail />} />
        </Route>
      </Routes>
    </>
  );
}
