import { MathJaxContext } from "better-react-mathjax";

import Calculator from "./Calculator";

const config = {
  loader: { 
    load: ["input/asciimath"]
  },
  displaystyle: false,
};

const App = () => 
  <MathJaxContext config={config}>
    <Calculator />
  </MathJaxContext>;

export default App;
