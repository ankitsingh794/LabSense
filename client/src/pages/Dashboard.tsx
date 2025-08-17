import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const activityData = [
  { day: "Mon", users: 20 },
  { day: "Tue", users: 35 },
  { day: "Wed", users: 25 },
  { day: "Thu", users: 45 },
  { day: "Fri", users: 40 },
  { day: "Sat", users: 50 },
  { day: "Sun", users: 30 },
];

const barData = [
  { name: "Jan", reports: 30 },
  { name: "Feb", reports: 50 },
  { name: "Mar", reports: 45 },
  { name: "Apr", reports: 60 },
  { name: "May", reports: 70 },
];

const pieData = [
  { name: "Normal", value: 60, color: "#34d399" },
  { name: "Attention", value: 25, color: "#fbbf24" },
  { name: "Critical", value: 15, color: "#ef4444" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Top Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://via.placeholder.com/150" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-muted-foreground">Active Patient</p>
            <Progress value={70} className="w-full" />
            <p className="text-sm text-muted-foreground">Profile Completion: 70%</p>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Reports</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Active Users</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
