import { Link } from 'react-router-dom';

function Sidebar() {

  return (
    <div className="w-[220px] bg-white h-screen shadow p-5 flex flex-col gap-5">

      <Link
        to="/dashboard"
        className="font-semibold"
      >
        Dashboard
      </Link>

      <Link
        to="/invoices"
        className="font-semibold"
      >
        Invoices
      </Link>

      <Link
        to="/users"
        className="font-semibold"
      >
        Users
      </Link>

    </div>
  );
}

export default Sidebar;