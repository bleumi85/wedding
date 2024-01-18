import { Select } from '@chakra-ui/react';
import { Column } from '@tanstack/table-core';
import * as React from 'react';

interface IBooleanFilterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, unknown>;
}

const BooleanFilter: React.FunctionComponent<IBooleanFilterProps> = (props) => {
  const { column } = props;
  const heading = column.columnDef.header || 'Suche';
  const columnFilterValue = column.getFilterValue();

  return (
    <Select
      maxW="300px"
      size={'sm'}
      variant={'wedding'}
      placeholder={`${heading.toString()}...`}
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      boxShadow={'md'}
    >
      <option value="TRUE">JA</option>
      <option value="FALSE">NEIN</option>
    </Select>
  );
};

export default BooleanFilter;
