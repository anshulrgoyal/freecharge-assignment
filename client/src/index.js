import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Home from "./pages/home";

ReactDOM.render(
  <Fragment>
    <CssBaseline>
      <Home />
    </CssBaseline>
  </Fragment>,
  document.querySelector("#root")
);
