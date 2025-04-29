import { useState } from "react";

const sidebarOptions = [
	{ iconName: "bi bi-house", name: "Home" },
	{ iconName: "bi bi-grid", name: "Dashboard" },
	{ iconName: "bi bi-wallet", name: "Wallet" },
];

const footerOptions = [
	{ iconName: "bi bi-people", name: "Our Community" },
	{ iconName: "bi bi-gear", name: "Settings" },
	{ iconName: "bi bi-telephone", name: "Contact Us" },
];

function Sidebar() {

	return (
		<div className="flex flex-col border-r-1 border-gray-300 w-full max-w-xs p-8 items-center gap-7">
			<div className="flex gap-2 items-center">
				<i className="bi bi-coin text-4xl font-bold"></i>
				<span className="text-2xl font-bold">Stock Dasher</span>
			</div>

      <div className="gradient-bg rounded-2xl flex text-white p-5 w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-thin">Total Investment</span>
          <span className="text-2xl">$3219.62</span>
        </div>

        <span className="text-green-400 text-lg">+1.83%<i className="bi bi-arrow-up"></i></span>
      </div>

			<div className="flex flex-col h-full w-full justify-between">
			  <div className="flex flex-col gap-2 w-full">
  				{sidebarOptions.map((item, index) => (
  					<span className={`rounded-2xl hover:bg-gray-200 transition-all p-2 `} key={index}>
  						<i
  							className={`${item.iconName} font-medium text-xl pr-3`}
  						></i>
  						{item.name}
  					</span>
  				))}
  			</div>
  
  			<div className="flex flex-col gap-2 w-full border-t-1 pt-10 border-gray-300">
  				{footerOptions.map((item, index) => (
  					<span className="rounded-2xl hover:bg-gray-200 transition-all p-2" key={index}>
  						<i
  							className={`${item.iconName} text-xl pr-3`}
  						></i>
  						{item.name}
  					</span>
  				))}
  			</div>
			</div>
		</div>
	);
}

export default Sidebar;
