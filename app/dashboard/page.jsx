"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios"; // your axios instance
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
  const [users, setUsers] = useState(0);
  const [activeCompetitions, setActiveCompetitions] = useState(0);
  const [totalBiddings, setTotalBiddings] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [competitionsEnded, setCompetitionsEnded] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [topCompetitions, setTopCompetitions] = useState([]);
  const [chartData, setChartData] = useState({
    dailyUsers: [],
    revenueTrend: [],
    competitionActivity: [],
    dailyLabels: [],
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get("dashboard/stats", { headers });
        const data = res.data;

        setUsers(data.totalUsers);
        setActiveCompetitions(data.activeCompetitions);
        setTotalBiddings(data.totalBiddings);
        setNewUsers(data.newUsersToday);
        setCompetitionsEnded(data.competitionsEnded);
        setRecentActivities(data.recentActivities || []);
        setTopUsers(data.topUsers || []);
        setTopCompetitions(data.topCompetitions || []);

        setChartData({
          dailyUsers: data.chartData.dailyUsers,
          revenueTrend: data.chartData.revenueTrend,
          competitionActivity: data.chartData.competitionActivity,
          dailyLabels: data.chartData.last7Days,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    }

    fetchDashboardData();
  }, []);

  // KPI Cards
  const kpis = [
    {
      label: "Total Users",
      value: users,
      icon: <FiUsers className="text-yellow-400" />,
    },
    {
      label: "Active Competitions",
      value: activeCompetitions,
      icon: <FiAward className="text-yellow-400" />,
    },
    {
      label: "Total Biddings",
      value: totalBiddings,
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
      value: newUsers,
      icon: <FiUsers className="text-yellow-400" />,
    },
    {
      label: "Competitions Ended",
      value: competitionsEnded,
      icon: <FiAward className="text-yellow-400" />,
    },
    {
      label: "Active Users Online",
      value: 0,
      icon: <FiTrendingUp className="text-yellow-400" />,
    },
  ];

  // Charts
  const dailyUsers = {
    labels: chartData.dailyLabels,
    datasets: [
      {
        label: "New Users",
        data: chartData.dailyUsers,
        borderColor: "#facc15",
        backgroundColor: "rgba(250,204,21,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const revenueTrend = {
    labels: chartData.dailyLabels,
    datasets: [
      {
        label: "Revenue",
        data: chartData.revenueTrend,
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const competitionActivity = {
    labels: topCompetitions.map((c) => c.name),
    datasets: [
      {
        label: "Active Biddings",
        data: chartData.competitionActivity,
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

  return (
    <div className="space-y-8">
      {/* Quick Notification & Messages */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <FiBell className="text-yellow-400 text-xl" />
          <span className="text-white/70 text-sm">
            You have {recentActivities.length} new notifications
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
