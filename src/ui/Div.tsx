import React from 'react';
import clsx from 'clsx';

const Div = (props: any) => {
  const { classname, children, ...other } = props;
  return (
    <div className={clsx(classname)} { ...other }>
      {children}
    </div>
  );
}

export default Div;
