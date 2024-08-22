import { Outlet } from "react-router-dom";

export function HomeLayout() {

  return (
    <div>
      Home Layout
      <Outlet />
    </div>
  );
}

export default HomeLayout;
