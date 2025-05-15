import React from "react";
import OrderSystem from "./components/OrderSystem";




const App = () => (
  <div className="container mx-auto px-4 h-screen flex flex-col">
    <nav className="bg-navbg rounded-full mt-4 px-8 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <img src="./assets/logo.svg" className="text-primary mr-2" />
        <h1 className="text-2xl font-bold">
          <span className="text-primary">Dine</span>Out
        </h1>
      </div>
      <img src="./assets/user-icon.svg" className="h-10" />
    </nav>

    <OrderSystem />
  </div>
);

export default App;
