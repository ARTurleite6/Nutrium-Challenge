const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-3xl font-bold">🥗 Nutrium</div>
      </div>
      <div className="text-base hidden lg:block">
        Are you a nutrition professional? Get to know our software →
      </div>
    </div>
  );
};

export default Navbar;
