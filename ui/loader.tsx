import Image from 'next/image';
import React from 'react';

export const Loader = (width: number = 50, height: number = 50) => {
  return (
    <Image
      src="/public/spinner.gif"
      alt="Loading..."
      width={width}
      height={height}
    />
  );
};
