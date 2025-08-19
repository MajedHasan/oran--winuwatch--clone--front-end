"use client";

import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiShoppingCart,
  FiMessageCircle,
  FiBell,
} from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  // KPI Cards
  const kpis = [
    {
      label: "Total Users",
      value: 1240,
      icon: <FiUsers className="text-yellow-400" />,
    },
    {
      label: "Active Competitions",
      value: 28,
      icon: <FiAward className="text-yellow-400" />,
    },
    {
      label: "Total Biddings",
      value: 512,
      icon: <FiShoppingCart className="text-yellow-400" />,
    },
    {
      label: "Wallet Balance",
      value: "£42,780",
      icon: <FiDollarSign className="text-yellow-400" />,
    },
    {
      label: "Pending Withdrawals",
      value: "£3,500",
      icon: <FiClock className="text-yellow-400" />,
    },
    {
      label: "New Users Today",
      value: 34,
      icon: <FiUsers className="text-yellow-400" />,
    },
    {
      label: "Competitions Ended",
      value: 12,
      icon: <FiAward className="text-yellow-400" />,
    },
    {
      label: "Active Users Online",
      value: 56,
      icon: <FiTrendingUp className="text-yellow-400" />,
    },
  ];

  // Charts
  const dailyUsers = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "New Users",
        data: [50, 75, 60, 90, 100, 120, 80],
        borderColor: "#facc15",
        backgroundColor: "rgba(250,204,21,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const revenueTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: [4200, 3800, 5100, 6000, 4800, 7200, 6500],
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const competitionActivity = {
    labels: ["Rolex", "Patek", "Audemars", "Omega", "Tag Heuer"],
    datasets: [
      {
        label: "Active Biddings",
        data: [34, 20, 15, 25, 18],
        backgroundColor: [
          "#facc15",
          "#f59e0b",
          "#fbbf24",
          "#fde68a",
          "#fbbf24",
        ],
      },
    ],
  };

  // Recent activities
  const recentActivities = [
    {
      type: "Bid",
      user: "John Doe",
      competition: "Rolex Submariner",
      amount: "£75",
      date: "12 Aug 2025",
    },
    {
      type: "Deposit",
      user: "Jane Smith",
      competition: "-",
      amount: "£150",
      date: "11 Aug 2025",
    },
    {
      type: "Withdrawal",
      user: "Bob Johnson",
      competition: "-",
      amount: "£200",
      date: "10 Aug 2025",
    },
    {
      type: "Bid",
      user: "Alice Brown",
      competition: "Patek Philippe Nautilus",
      amount: "£120",
      date: "10 Aug 2025",
    },
  ];

  // Top Users / Competitions
  const topUsers = [
    { name: "John Doe", biddings: 12, winnings: "£1,500" },
    { name: "Alice Brown", biddings: 9, winnings: "£950" },
    { name: "Bob Johnson", biddings: 7, winnings: "£700" },
  ];

  const topCompetitions = [
    { name: "Rolex Submariner", entries: 120, revenue: "£3,000" },
    { name: "Patek Philippe Nautilus", entries: 95, revenue: "£2,375" },
    { name: "Audemars Piguet Royal Oak", entries: 70, revenue: "£1,750" },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Notification & Messages */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <FiBell className="text-yellow-400 text-xl" />
          <span className="text-white/70 text-sm">
            You have 5 new notifications
          </span>
        </div>
        <div className="flex items-center gap-3">
          <FiMessageCircle className="text-yellow-400 text-xl" />
          <span className="text-white/70 text-sm">3 unread messages</span>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 bg-gray-950 p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="text-3xl">{kpi.icon}</div>
            <div>
              <div className="text-white/70 text-sm">{kpi.label}</div>
              <div className="text-xl font-bold">{kpi.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-4">Daily New Users</h3>
          <Line data={dailyUsers} />
        </div>
        <div className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <Bar data={revenueTrend} />
        </div>
        <div className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-4">Competition Activity</h3>
          <Doughnut data={competitionActivity} />
        </div>
      </section>

      {/* Top Users & Competitions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-4">Top Users</h3>
          <ul className="space-y-2">
            {topUsers.map((user, idx) => (
              <li
                key={idx}
                className="flex justify-between bg-gray-900 p-3 rounded-lg hover:bg-gray-800 transition"
              >
                <span>{user.name}</span>
                <span>
                  {user.biddings} biddings - {user.winnings}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-4">Top Competitions</h3>
          <ul className="space-y-2">
            {topCompetitions.map((comp, idx) => (
              <li
                key={idx}
                className="flex justify-between bg-gray-900 p-3 rounded-lg hover:bg-gray-800 transition"
              >
                <span>{comp.name}</span>
                <span>
                  {comp.entries} entries - {comp.revenue}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent Activities */}
      <section className="bg-gray-950 rounded-2xl p-6 shadow hover:shadow-lg transition overflow-x-auto">
        <h3 className="font-semibold mb-4">Recent Activities</h3>
        <table className="min-w-full text-left text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Competition</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((activity, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="px-4 py-2">{activity.type}</td>
                <td className="px-4 py-2">{activity.user}</td>
                <td className="px-4 py-2">{activity.competition}</td>
                <td className="px-4 py-2">{activity.amount}</td>
                <td className="px-4 py-2">{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
