export interface ButtonProps {
  text: string;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const UIButton = (props: ButtonProps) => {
  const buttonClass =
    props.className +
    " rounded-md border border-black mt-3 p-4 cursor-pointer bg-sky-500/40 hover:bg-sky-500";

  return (
    <button onClick={props.onClick} className={buttonClass}>
      {props.text}
    </button>
  );
};

export default UIButton;
