import React from 'react';
import clsx from 'clsx';

const Col = (props: any) => {
  const { classname, children, ...other } = props;
  return (
    <div className={clsx('flex row', classname)} { ...other }>
      {children}
    </div>
  );
}

export default Col;
