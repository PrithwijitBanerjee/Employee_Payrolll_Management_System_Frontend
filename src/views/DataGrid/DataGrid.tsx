import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaSearch, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import DeleteModal from "@/components/modals/DeleteModal";

// Define types for the component
interface Column {
  name: string;
  key: string;
  render?: (row: any, index?: number) => React.ReactNode;
  width?: string;
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => Promise<void> | void;
  title?: string;
  pagination?: boolean;
  searchable?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  tableHeight?: string;
  tableWidth?: string;
  filteredDropdownForImages?: boolean;
  onSearchChange?: (searchText: string) => void;
  serverSideSearch?: boolean;
  isAddPaginateBtn?: boolean,
  paginateBtnHnadler?: any,
  buttonText: string |any,
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  title = 'Data Table',
  pagination = true,
  searchable = true,
  striped = true,
  highlightOnHover = true,
  tableHeight = '500px',
  tableWidth = '100%',
  onSearchChange,
  serverSideSearch = false,
  isAddPaginateBtn = false,
  paginateBtnHnadler,
  buttonText,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const handleDeleteClick = (row: any) => {
    setItemToDelete(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete && onDelete) {
      await onDelete(itemToDelete);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // Add action column if onEdit or onDelete provided
  const tableColumns = useMemo(() => {
    const cols: Column[] = [...columns];

    if (onEdit || onDelete) {
      cols.push({
        name: 'Actions',
        key: 'actions',
        render: (row: any) => (
          <div className="d-flex gap-2">
            {onEdit && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
                className="btn btn-sm btn-outline-primary mx-2"
                title="Edit"
              >
                <FaEdit />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDeleteClick(row);
                }}
                className="btn btn-sm btn-outline-danger"
                title="Delete"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ),
        width: '120px'
      });
    }
    return cols;
  }, [columns, onEdit, onDelete]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (serverSideSearch) {
      return data;
    }
    if (!searchText) return sortedData;

    return sortedData.filter(item =>
      Object.values(item).some(
        (val: any) => String(val).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [sortedData, searchText, serverSideSearch, data]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage, pagination]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePerRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(e.target.value);
    setRowsPerPage(newPerPage);
    setCurrentPage(1);
  };

  const getRowClass = (index: number): string => {
    const classes: string[] = [];
    if (striped && index % 2 === 0) classes.push('bg-light');
    if (highlightOnHover) classes.push('hover-highlight');
    return classes.join(' ');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (serverSideSearch && onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="d-flex justify-content-end">
      <div className='form-header mx-2'>
        <section className="piechartsBox_area">
          <div className="card shadow-sm" style={{ width: tableWidth, maxWidth: '1200px' }}>
            <div className="card-body d-flex flex-column" style={{ height: '100%' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">{title}</h4>

                {isAddPaginateBtn && (
                  <div className="input-group" style={{ width: '300px', minWidth: '200px' }}>
                    <button className='btn btn-outline-primary' onClick={paginateBtnHnadler}>{buttonText}</button>
                  </div>
                )}
                {searchable && (
                  <div className="input-group" style={{ width: '300px', minWidth: '200px' }}>
                    <span className="input-group-text mx-2">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                  </div>
                )}
              </div>

              <div className="table-responsive flex-grow-1">
                <table
                  className="table table-bordered mb-0"
                  style={{ minWidth: '100%' }}
                >
                  <thead className="thead-light sticky-top" style={{ top: 0 }}>
                    <tr>
                      {tableColumns.map((column: Column) => (
                        <th
                          key={column.key}
                          style={{
                            width: column.width || 'auto',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#f8f9fa',
                            zIndex: 1
                          }}
                          onClick={() => column.key !== 'actions' && handleSort(column.key)}
                          className={column.key !== 'actions' ? 'sortable' : ''}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            {column.name}
                            {sortConfig.key === column.key && column.key !== 'actions' && (
                              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className={getRowClass(rowIndex)}>
                          {tableColumns.map((column: Column) => {
                            if (column.name === 'ID') {
                              return (
                                <td key={`${rowIndex}-${column.key}`}>
                                  {column.render ? column.render(row, rowIndex) : row[column.key]}
                                </td>
                              );
                            } else {
                              return (
                                <td key={`${rowIndex}-${column.key}`}>
                                  {column.render ? column.render(row) : row[column.key]}
                                </td>
                              );
                            }
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableColumns.length}
                          className="text-center py-4 text-muted"
                          style={{ height: tableHeight }}
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination && filteredData.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="d-flex align-items-center">
                    <span className="me-2">Rows per page:</span>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={rowsPerPage}
                      onChange={handlePerRowsChange}
                    >
                      {[10, 25, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex align-items-center gap-1 flex-wrap">
                    <span className="me-3">
                      Showing {((currentPage - 1) * rowsPerPage) + 1} to{' '}
                      {Math.min(currentPage * rowsPerPage, filteredData.length)} of{' '}
                      {filteredData.length} entries
                    </span>

                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-outline-secondary mx-2"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <FaAngleLeft />
                      </button>

                      <span className="mx-2 d-flex align-items-center">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        className="btn btn-sm btn-outline-secondary mx-2"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <FaAngleRight />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <FaAngleDoubleRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemId={itemToDelete?.id}
          itemName={itemToDelete?.name || 'item'}
        />
      </div>
    </div>
  );
};

export default DataGrid;