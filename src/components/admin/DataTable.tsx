interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({ columns, data, actions }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col, index) => (
              <th key={index} className={`text-left py-4 px-4 text-sm font-semibold text-gray-500 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
            {actions && <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {columns.map((col, index) => (
                <td key={index} className="py-4 px-4 text-sm text-gray-900">
                  {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                </td>
              ))}
              {actions && (
                <td className="py-4 px-4 text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
