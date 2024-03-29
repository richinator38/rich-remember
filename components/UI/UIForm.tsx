export interface FormProps extends React.PropsWithChildren {
  title: string;
}

const UIForm = (props: FormProps) => {
  return (
    <div className="container mx-auto border border-zinc-300 p-4 rounded-md drop-shadow-md mt-6 max-w-md">
      <form className="flex flex-col justify-center">
        <p
          className="font-bold text-4xl text-center mb-3 mt-1"
          aria-label={props.title}
        >
          {props.title}
        </p>
        {props.children}
      </form>
    </div>
  );
};

export default UIForm;
