import { Outlet } from "react-router-dom";

export function HomeLayout() {

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default HomeLayout;
