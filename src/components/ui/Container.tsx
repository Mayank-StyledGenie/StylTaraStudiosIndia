import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  marginLeft?: string;
  marginRight?: string;
  backgroundColor?: string;
}

const Container = ({ children, className = '', marginLeft = '120px', marginRight = '120px',backgroundColor = 'transparent' }: ContainerProps) => {
  return (
    <div
      className={`${className}`}
      style={{ marginLeft, marginRight, backgroundColor}}
    >
      {children}
    </div>
  );
};

export default Container;