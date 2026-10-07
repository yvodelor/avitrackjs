import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";

export type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type Props<T> = {
  data?: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pageSize?: number;
  loading?: boolean;
  rowKey?: keyof T;
  linkButton?: string;
  textButton?: string;
  actions?: (row: T) => React.ReactNode
};

export function DynamicTable<T extends Record<string, any>>({
  data = [],
  columns,
  searchable = true,
  pageSize = 10,
  loading = false,
  rowKey = "id" as keyof T,
  linkButton = "",
  textButton = "Ajouter",
  actions
}: Props<T>) {

  // =========================
  // SAFE DATA
  // =========================
  const safeData = Array.isArray(data)
    ? data
    : [];

  // =========================
  // STATES
  // =========================
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // =========================
  // FILTER
  // =========================
  const filtered = useMemo(() => {

    if (!search.trim()) {
      return safeData;
    }

    return safeData.filter((row) =>
      columns.some((col) => {

        const value = row[col.key];

        if (value === null || value === undefined) {
          return false;
        }

        return String(value)
          .toLowerCase()
          .includes(search.toLowerCase());

      })
    );

  }, [safeData, search, columns]);

  // =========================
  // SORT
  // =========================
  const sorted = useMemo(() => {

    
    if (!sortKey) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {

      const valA = a[sortKey];
      const valB = b[sortKey];

      // null / undefined
      if (valA == null) return 1;
      if (valB == null) return -1;

      // numbers
      if (
        typeof valA === "number" &&
        typeof valB === "number"
      ) {
        return sortDir === "asc"
          ? valA - valB
          : valB - valA;
      }

      // dates
      
      if (
        typeof valA === 'string' &&
        typeof valB === 'string'
      ) {
        const dateA = new Date(valA);
        const dateB = new Date(valB);

        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateA.getTime() - dateB.getTime();
        }
      }

      // strings
      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));

    });

  }, [filtered, sortKey, sortDir]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / pageSize)
  );

  const paginated = useMemo(() => {

    const start = (page - 1) * pageSize;

    return sorted.slice(start, start + pageSize);

  }, [sorted, page, pageSize]);

  // =========================
  // HANDLE SORT
  // =========================
  const handleSort = (key: keyof T) => {

    setPage(1);

    if (sortKey === key) {

      setSortDir((prev) =>
        prev === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortKey(key);
      setSortDir("asc");

    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6  ">
          {/* SEARCH */}
          {searchable && (
            <div className="mb-4">

              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="
                  w-full
                  max-w-sm
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                "
              />

            </div>
          )}
        </div>
        
        {/* Button */}
        {textButton && linkButton && (
        <div className="col-span-6 text-end">
          <Button size="sm" variant="primary" className="bg-gray-500">
            <Link to = {linkButton}> {textButton} </Link>
          </Button>
        </div>
        )}
      </div>

      {/* TABLE */}
      <table className="w-full table-auto border-collapse text-sm">

        {/* HEAD */}
        <thead>

          <tr className="bg-gray-100 dark:bg-gray-800">

            {columns.map((col) => (

              <th
                key={String(col.key)}
                onClick={() =>
                  col.sortable &&
                  handleSort(col.key)
                }
                className={` px-4 py-3 text-left font-semibold text-gray-800  dark:text-gray-200
                  select-none
                  transition-colors

                  ${
                    col.sortable
                      ? "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      : ""
                  }
                `}
              >

                <div className="flex items-center gap-1">

                  {col.header}

                  {sortKey === col.key && (
                    <span>
                      {sortDir === "asc"
                        ? "↑"
                        : "↓"}
                    </span>
                  )}

                </div>

              </th>

            ))}

            { actions && <th className=" px-4 py-3 text-gray-800 dark:text-gray-200 text-center ">Actions</th>}

          </tr>

        </thead>

        {/* BODY */}
        <tbody>

          {paginated.length > 0 ? (

            paginated.map((row) => (

              <tr
                key={String(row[rowKey])}
                className="
                  border-b
                  border-gray-200
                  transition-colors
                  hover:bg-gray-50
                  dark:border-gray-700
                  dark:hover:bg-gray-900
                "
              >

                {columns.map((col) => (

                  <td
                    key={String(col.key)}
                    className="
                      px-4
                      py-3
                      text-gray-800
                      dark:text-gray-200
                    "
                  >

                    {col.render
                      ? col.render(
                          row[col.key],
                          row
                        )
                      : String(
                          row[col.key] ?? "-"
                        )}

                  </td>
                ))}

                 { actions && <td className=" px-4 py-3 text-gray-800 dark:text-gray-200  text-right ">{actions(row)}</td>}

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan={columns.length}
                className="
                  px-4
                  py-10
                  text-center
                "
              >

                <div className="flex flex-col items-center">

                  <p className="text-gray-500 dark:text-gray-400">
                    Aucune donnée trouvée
                  </p>

                </div>

              </td>


            </tr>

          )}

        </tbody>

      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="mt-4 flex items-center justify-between text-sm">

          <span className="text-gray-600 dark:text-gray-400">
            Page {page} sur {totalPages}
          </span>

          <div className="flex gap-2">

            <button
              onClick={() =>
                setPage((p) =>
                  Math.max(1, p - 1)
                )
              }
              disabled={page === 1}
              className="
                rounded-md
                border
                px-3
                py-1
                transition-opacity
                disabled:opacity-50
                dark:border-gray-700
              "
            >
              Précédent
            </button>

            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(
                    totalPages,
                    p + 1
                  )
                )
              }
              disabled={page === totalPages}
              className="
                rounded-md
                border
                px-3
                py-1
                transition-opacity
                disabled:opacity-50
                dark:border-gray-700
              "
            >
              Suivant
            </button>

          </div>

        </div>

      )}

    </div>
  );
}