import { Badge } from '../Badge';
import { DataTable } from '../DataTable';
import { ComponentSection, ComponentShowcase } from './shared';

const TablesSection = () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'E-Mail' },
    { key: 'status', header: 'Status', render: (val) => <Badge variant={val === 'Aktiv' ? 'success' : 'neutral'}>{val}</Badge> },
    { key: 'score', header: 'Score', align: 'right' }
  ];

  const data = [
    { id: 1, name: 'Max Mustermann', email: 'max@example.com', status: 'Aktiv', score: 85 },
    { id: 2, name: 'Erika Musterfrau', email: 'erika@example.com', status: 'Aktiv', score: 72 },
    { id: 3, name: 'Hans Schmidt', email: 'hans@example.com', status: 'Inaktiv', score: 45 }
  ];

  return (
    <ComponentSection
      title="Tables"
      description="Datentabellen mit anpassbaren Spalten und Renderern."
    >
      <ComponentShowcase
        title="DataTable"
        code={`<DataTable
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status', render: (val) => <Badge>{val}</Badge> }
  ]}
  data={[{ name: 'Max', status: 'Aktiv' }]}
  onRowClick={(row) => console.log(row)}
/>`}
      >
        <DataTable columns={columns} data={data} />
      </ComponentShowcase>
    </ComponentSection>
  );
};

export default TablesSection;
