import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FaRocket,
  FaStar,
  FaCalendarCheck,
  FaUsers,
  FaArrowRight,
  FaLightbulb,
  FaBell, // <--- Yeh missing tha
} from "react-icons/fa";

const EmployeeHome = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    {
      label: "Attendance",
      value: "98%",
      icon: <FaCalendarCheck />,
      color: "bg-emerald-500",
    },
    {
      label: "Current Rank",
      value: "#04",
      icon: <FaStar />,
      color: "bg-amber-500",
    },
    {
      label: "Team Size",
      value: "12",
      icon: <FaUsers />,
      color: "bg-blue-500",
    },
    {
      label: "Projects",
      value: "03",
      icon: <FaRocket />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-indigo-100 text-xs font-bold tracking-widest uppercase mb-4 border border-white/10">
              <FaLightbulb className="animate-pulse" /> Focus for today
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Ready to crush it, <br />
              <span className="text-indigo-200">
                {user?.name?.split(" ")[0] || "Member"}?
              </span>
            </h1>
            <p className="mt-4 text-indigo-100/80 max-w-md font-medium">
              Your performance this week is 15% higher than last month. Keep up
              the great work!
            </p>
          </div>

          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3 self-start md:self-center">
            View My Tasks <FaArrowRight />
          </button>
        </div>
      </div>

      {/* --- QUICK STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">
              Internal Announcements
            </h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer hover:underline">
              Mark all as read
            </span>
          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <FaBell />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    New Policy Update: Remote Work
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    The company has updated the remote work policy effective
                    from next Monday.
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 block">
                    2 HOURS AGO
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CustomTrophyIcon size={120} />
          </div>
          <h3 className="text-xl font-black mb-6 relative z-10">
            Monthly Star
          </h3>

          <div className="text-center relative z-10">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 p-1">
              <img
                src="https://ui-avatars.com/api/?name=Top+Performer&background=0f172a&color=fff"
                className="w-full h-full rounded-[1.4rem] object-cover"
                alt="top performer"
              />
            </div>
            <p className="text-lg font-bold">Rohan Verma</p>
            <p className="text-xs text-slate-400 font-medium">
              Senior Designer
            </p>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                Your Progress
              </p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                <div className="bg-indigo-500 h-full rounded-full w-[70%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                30% more to reach top rank
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomTrophyIcon = ({ size }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 576 512"
    height={size}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 66.5 44.1 122.6 104.5 140.2 16.8 35.2 46.2 62.8 83.6 77.1 22.1 63.4 82.8 108.7 154.1 108.7h.3c71.3 0 132-45.3 154.1-108.7 37.3-14.3 66.8-41.9 83.6-77.1 60.4-17.6 104.5-73.7 104.5-140.2V88c0-13.3-10.7-24-24-24zM128 144v48c0 30.9-25.1 56-56 56s-56-25.1-56-56V96h88.2c-16.1 14.8-26.2 36-26.2 48zm376 48c0 30.9-25.1 56-56 56s-56-25.1-56-56V144c0-12 10.1-33.2 26.2-48H544v48z"></path>
  </svg>
);

export default EmployeeHome;
