import { MathJaxContext } from "better-react-mathjax";

import Calculator from "./Calculator";
import { CalculatorStoreProvider } from "../CalculatorStore";

const config = {
  loader: { 
    load: ["input/asciimath"]
  },
  displaystyle: false,
};

const App = () => 
  <MathJaxContext config={config}>
    <CalculatorStoreProvider>
      <Calculator />      
    </CalculatorStoreProvider>
  </MathJaxContext>;

export default App;
