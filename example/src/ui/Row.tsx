import React from 'react';

const Col = (props: any) => {
  const { classname, children, ...other } = props;
  return (
    <div className={clsx('flex row', classname)} { ...other }>
      {children}
    </div>
  );
}

export default Col;
