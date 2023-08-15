import { FC } from 'react';
import clx from 'classnames';

export interface TableProps {
  headers: string[];
  rows: {
    [key: string]: any;
  }[];
}

const Table: FC<TableProps> = ({ headers, rows }) => {
  return (
    <table className="w-full my-4 border-collapse">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th className={clx({
              'text-left text-xl': true,
              'pl-4': header === 'Show Name'
            })}>
              {header === 'Action' ? '' : header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            className={clx({
              'bg-slate-100': index % 2 === 0,
              'bg-slate-300': index % 2 === 1,
              '': true,
            })}
          >
            {headers.map((header, index) => (
              <td
                className={clx({
                  'pr-4': index === headers.length - 1,
                  'w-3/6 pl-4': header === 'Show Name',
                  'w-32': header === 'Poster'
                })}
              >
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
