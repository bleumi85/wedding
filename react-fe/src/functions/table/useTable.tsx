import {
  Button,
  Center,
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  ResponsiveValue,
  Select,
  Stack,
  Table,
  TableContainer,
  TableHeadProps,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  RowData,
  RowSelectionState,
  TableState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaAngleUp, FaAnglesLeft, FaAnglesRight, FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import BooleanFilter from './BooleanFilter';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import Filter from './Filter';

/* eslint-disable @typescript-eslint/no-explicit-any */

type UseTableOptions<T> = {
  enableColumnFilters?: boolean;
  initialColumnFilters?: ColumnFiltersState;
  isSelectable?: boolean;
  getCanSelect?: (row: Row<T>) => boolean;
};

interface ITblFilterProps {
  children?: React.ReactElement | React.ReactElement[];
  showAdd?: boolean;
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg';
}

interface ExtendedTableHeadProps extends TableHeadProps {
  headerPadding?: ResponsiveValue<number | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'unset'>;
  centered?: boolean;
}

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterTitle?: string;
    isNumeric?: boolean;
    headerCentered?: boolean;
  }
}

export function useTable<T>(data: T[], columns: ColumnDef<T, any>[], options?: UseTableOptions<T>) {
  const enableColumnFilters = options?.enableColumnFilters ?? true;
  const initialColumnFilters = options?.initialColumnFilters ?? [];
  const isSelectable = options?.isSelectable ?? false;
  const getCanSelect = options?.getCanSelect;

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const colorCheckboxBorder = useColorModeValue('primary.500', 'primary.200');
  const borderColorValue = useColorModeValue('white', 'gray.700');
  const colorSchemeValue = useColorModeValue('white', 'black');
  const tblHeadBackgroundColor = colorCheckboxBorder;
  const tblHeadFontColor = borderColorValue;

  const selectableColumns = React.useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            isChecked={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            borderColor={borderColorValue}
            colorScheme={colorSchemeValue}
          />
        ),
        cell: ({ row }) => (
          <Center>
            <IndeterminateCheckbox
              isChecked={row.getIsSelected()}
              isIndeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              isDisabled={!getCanSelect ? !row.getCanSelect() : getCanSelect(row)}
              borderColor={colorCheckboxBorder}
              colorScheme="primary"
            />
          </Center>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        meta: { headerCentered: true },
      },
      ...columns,
    ],
    [borderColorValue, colorCheckboxBorder, colorSchemeValue, columns, getCanSelect],
  );

  const table = useReactTable({
    data,
    columns: isSelectable ? selectableColumns : columns,
    state: {
      columnFilters,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableColumnFilters,
  });

  const TblBody: React.FunctionComponent = () => (
    <Tbody>
      {table.getRowModel().rows.map((row) => (
        <Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Td key={cell.id} isNumeric={cell.column.columnDef.meta?.isNumeric}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  );

  const TblContainer = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
    const { children, ...delegated } = props;
    return (
      <Flex p={4} bg={useColorModeValue('white', 'gray.700')} boxShadow={'md'}>
        <TableContainer w={'100%'}>
          <Table ref={ref} size={'sm'} variant={'striped'} {...delegated}>
            {children}
          </Table>
        </TableContainer>
      </Flex>
    );
  });

  const TblFilter: React.FunctionComponent<ITblFilterProps> = (props) => {
    const { children, showAdd = false, buttonSize = 'md' } = props;
    const state: TableState = table.getState();
    return (
      <Stack direction={'row'} w={'100%'} spacing={2} justify={'flex-end'}>
        <Stack direction={'row'} flexGrow={1} spacing={4}>
          {table.getHeaderGroups().map((headerGroup) => {
            return headerGroup.headers.map((header) => {
              const canFilter = header.column.getCanFilter();
              const isBoolean = header.column.id.endsWith('Bool');
              if (canFilter && isBoolean) {
                return <BooleanFilter key={header.id} column={header.column} />;
              } else if (canFilter) {
                return <Filter key={header.id} column={header.column} />;
              } else {
                return null;
              }
            });
          })}
        </Stack>
        {enableColumnFilters && (
          <Button minW={100} colorScheme="primary" variant={'outline'} onClick={onReset} size={buttonSize} isDisabled={state.columnFilters.length === 0}>
            Reset
          </Button>
        )}
        {showAdd && (
          <Link to="add">
            <IconButton aria-label="add" colorScheme="primary" icon={<FaPlus />} size={buttonSize} />
          </Link>
        )}
        {children}
      </Stack>
    );
  };

  const TblHead = React.forwardRef<HTMLTableSectionElement, ExtendedTableHeadProps>((props, ref) => {
    const { bg, color, headerPadding = 2, ...delegated } = props;

    const backgroundColor = bg || tblHeadBackgroundColor;
    const fontColor = color || tblHeadFontColor;

    return (
      <Thead ref={ref} bg={backgroundColor} {...delegated}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Th key={header.id} colSpan={header.colSpan} color={fontColor} py={headerPadding} isNumeric={header.column.columnDef.meta?.isNumeric}>
                  {header.isPlaceholder ? null : (
                    <Flex
                      justifyContent={header.column.columnDef.meta?.headerCentered ? 'center' : 'inherit'}
                      gap={2}
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <FaAngleUp />,
                        desc: <FaAngleDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </Flex>
                  )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
    );
  });

  const TblJson: React.FC = () => {
    const state: TableState = table.getState();
    const data = {
      columnFilters: state.columnFilters,
      sorting: state.sorting,
      pagination: state.pagination,
      rowSelection: state.rowSelection,
    };
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  const TblPagination: React.FunctionComponent = () => (
    <Stack direction={'row'} spacing={4}>
      <Tooltip label="Erste Seite">
        <IconButton
          aria-label="first page"
          icon={<FaAnglesLeft />}
          onClick={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
          size={'sm'}
        />
      </Tooltip>
      <Tooltip label="Vorherige Seite">
        <IconButton
          aria-label="previous page"
          icon={<FaAngleLeft />}
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
          size={'sm'}
        />
      </Tooltip>
      <Stack direction={'row'} flexGrow={1} justify={'center'} align={'center'} spacing={8}>
        <Text flexShrink={0} verticalAlign={'middle'}>
          Seite{' '}
          <Text fontWeight="bold" as="span">
            {table.getState().pagination.pageIndex + 1}
          </Text>{' '}
          von{' '}
          <Text fontWeight="bold" as="span">
            {table.getPageCount()}
          </Text>
        </Text>
        <Text flexShrink={0}>Gehe zu Seite:</Text>{' '}
        <NumberInput
          size={'sm'}
          maxW={'80px'}
          min={1}
          max={table.getPageCount()}
          onChange={(value) => {
            const page = value ? Number(value) - 1 : 0;
            table.setPageIndex(page);
          }}
          defaultValue={table.getState().pagination.pageIndex + 1}
          keepWithinRange
        >
          <NumberInputField min="1" max={`${table.getPageCount()}`} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Select
          size={'sm'}
          maxW={'150px'}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Zeige {pageSize}
            </option>
          ))}
        </Select>
      </Stack>
      <Tooltip label="Nächste Seite">
        <IconButton aria-label="next page" icon={<FaAngleRight />} onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()} size={'sm'} />
      </Tooltip>
      <Tooltip label="Letzte Seite">
        <IconButton
          aria-label="last page"
          icon={<FaAnglesRight />}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
          size={'sm'}
        />
      </Tooltip>
    </Stack>
  );

  const getSelectedRows: Row<T>[] = table.getSelectedRowModel().flatRows;
  const toggleAllRowsSelected = (selected: boolean) => table.toggleAllRowsSelected(selected);

  const onReset = () => {
    table.setColumnFilters(initialColumnFilters);
    table.setSorting([]);
    table.setRowSelection({});
    table.setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  return { TblBody, TblContainer, TblFilter, TblHead, TblJson, TblPagination, getSelectedRows, toggleAllRowsSelected };
}
