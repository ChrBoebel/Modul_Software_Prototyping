export const DataTable = ({
  columns,
  data,
  onRowClick,
  selectedRowId,
  emptyMessage = 'Keine Daten vorhanden',
  className = ''
}) => {
  const getRowId = (row, index) => row.id ?? row._id ?? index;

  return (
    <div className={`table-wrapper ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align || 'left' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = selectedRowId !== undefined && selectedRowId === rowId;

              return (
                <tr
                  key={rowId}
                  className={`${isSelected ? 'selected' : ''} ${onRowClick ? 'clickable' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
