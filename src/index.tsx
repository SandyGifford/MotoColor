console.clear();

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "@components/App/App";

const target = document.createElement("div");
document.body.appendChild(target);

ReactDOM.render(<App />, target);
