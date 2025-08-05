type Props = {
  name: string;
};

const Avatar: React.FC<Props> = ({ name }) => {
  return (
    <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
      {name.charAt(0)}
    </div>
  );
};

export default Avatar;
