import { Link } from "react-router-dom";

const HomePage = () => {
  return <div>
    <div>Home Page</div>
    <Link to="auth/new-account">go to new account page</Link>
  </div>;
}

export default HomePage
