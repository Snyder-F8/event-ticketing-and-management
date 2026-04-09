import React from "react";

function Table({ headers, data }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;