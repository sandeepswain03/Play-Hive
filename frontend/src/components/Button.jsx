/* eslint-disable react/prop-types */
function Button({
  children,
  type = "button",
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`${bgColor} ${type} ${textColor} ${className} px-4 py-2 rounded-lg `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
