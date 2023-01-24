import React from 'react';
import clsx from 'clsx';

const Col = (props: any) => {
  const { classname, children, ...other } = props;
  return (
    <div className={clsx('flex column', classname)} { ...other }>
      {children}
    </div>
  );
}

export default Col;
