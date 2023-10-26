import { Fragment } from "react";
import { Outlet } from "react-router-dom";

import HeaderP from "../pages/header";

const FrontLayout = () => {
  return (
    <Fragment>
      <HeaderP />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default FrontLayout;