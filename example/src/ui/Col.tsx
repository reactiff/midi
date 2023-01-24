import React from 'react';

const Col = (props: any) => {
  const { classname, children, ...other } = props;
  return (
    <div className={clsx('flex column', classname)} { ...other }>
      {children}
    </div>
  );
}

export default Col;
