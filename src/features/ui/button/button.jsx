import "./button.css";

export const Button = ({ children, ...restProps }) => {
  return <button {...restProps}>{children}</button>;
};
