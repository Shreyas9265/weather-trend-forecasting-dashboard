import { NavLink } from "react-router-dom";

const navItems = [
  ["/", "Overview"],
  ["/cleaning", "Data Cleaning"],
  ["/eda", "EDA"],
  ["/forecasting", "Forecasting"],
  ["/advanced", "Advanced Analysis"],
  ["/insights", "Insights"],
  ["/mission", "PM Accelerator Mission"],
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:flex lg:gap-6">
        <aside className="lg:w-72 mb-4 lg:mb-0">
          <div className="card sticky top-6">
            <h1 className="text-xl font-bold text-brand-800">Weather Trend Forecasting</h1>
            <p className="text-sm text-slate-600 mt-2">PM Accelerator Assessment Dashboard</p>
            <nav className="mt-4 space-y-2">
              {navItems.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
