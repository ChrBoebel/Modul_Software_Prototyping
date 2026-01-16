import KonstanzMap from './KonstanzMap';
import { Card } from '../ui';
import { Map, MapPin, Wifi } from 'lucide-react';

const MapView = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Map className="text-swk-blue" size={28} />
            Verfügbarkeitskarte Konstanz
          </h1>
          <p className="text-slate-500 mt-1">
            Produktverfügbarkeit für alle 687 Straßen in Konstanz
          </p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Wifi className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">FTTH</div>
              <div className="text-sm text-slate-500">Glasfaser</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wifi className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">Kabel</div>
              <div className="text-sm text-slate-500">Koaxial</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Wifi className="text-amber-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">DSL</div>
              <div className="text-sm text-slate-500">Kupfer</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <MapPin className="text-slate-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">687</div>
              <div className="text-sm text-slate-500">Straßen</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <KonstanzMap />
      </Card>
    </div>
  );
};

export default MapView;
