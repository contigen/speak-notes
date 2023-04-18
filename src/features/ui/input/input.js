import "./input.css";

export const InputFile = ({ children, ...restProps }) => {
  return (
    <input type="file" {...restProps}>
      {children}
    </input>
  );
};
