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

interface SidebarProp {
	showSidebar: boolean;
}

function Sidebar(prop: SidebarProp) {
	return (
		<div
			className={`flex flex-col border-r border-gray-300 p-8 items-center gap-7 overflow-hidden transition-all duration-300`}
			style={{ width: prop.showSidebar ? "25rem" : "5rem" }}
		>
			<div className="flex gap-2 items-center transition-opacity duration-300">
				<i className="bi bi-coin text-4xl font-bold"></i>
				{prop.showSidebar && (
					<span className="hidden md:flex text-2xl font-bold">Stock Dasher</span>
				)}
			</div>

			{prop.showSidebar && (
				<div className="hidden md:flex gradient-bg rounded-2xl text-white p-5 w-full items-center justify-between">
					<div className="flex flex-col gap-2">
						<span className="font-light">Total Investment</span>
						<span className="text-2xl">$3219.62</span>
					</div>
					<span className="text-green-400 text-lg">
						+1.83%<i className="bi bi-arrow-up"></i>
					</span>
				</div>
			)}

			<div
				className={
					"flex flex-col h-full justify-between " +
					(prop.showSidebar ? "w-full" : "")
				}
			>
				<div className="flex flex-col gap-2">
					{sidebarOptions.map((item, index) => (
						<div
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center gap-3 " +
								(!prop.showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{prop.showSidebar && <span className="hidden md:flex">{item.name}</span>}
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 w-full border-t pt-10 border-gray-300">
					{footerOptions.map((item, index) => (
						<div
							className={
								"rounded-2xl hover:bg-gray-200 transition-all p-2 flex items-center gap-3 " +
								(!prop.showSidebar && "justify-center")
							}
							key={index}
						>
							<i
								className={`${item.iconName} font-medium text-xl`}
							></i>
							{prop.showSidebar && <span className="hidden md:flex">{item.name}</span>}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
