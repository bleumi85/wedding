import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import * as React from 'react';

const IndeterminateCheckbox: React.FunctionComponent<CheckboxProps> = (props) => {
  const ref = React.useRef<HTMLInputElement>(null!);
  const { isIndeterminate, isChecked, ...rest } = props;

  React.useEffect(() => {
    if (typeof isIndeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && isIndeterminate;
    }
  }, [ref, isIndeterminate, rest.checked]);

  return <Checkbox ref={ref} isChecked={isChecked} isIndeterminate={isIndeterminate} {...rest} />;
};

export default IndeterminateCheckbox;
