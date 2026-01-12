import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import ArtworkTable from './components/ArtworkTable';

export default function App() {
  return (
    <div className="p-4">
      <h2>Art Institute of Chicago – Artworks</h2>
      <ArtworkTable />
    </div>
  );
}
