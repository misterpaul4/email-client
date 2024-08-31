import { Link, Outlet } from "react-router-dom";

const CallBackLayout = () => {
  return (
    <div>
      <Link to="/">Home</Link>
      <Outlet />
    </div>
  );};

export default CallBackLayout
