export interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const UIButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className="rounded-md border border-black mt-12 p-4 cursor-pointer bg-sky-500/40 hover:bg-sky-500"
    >
      {props.text}
    </button>
  );
};

export default UIButton;
