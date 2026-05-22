import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Briefcase } from "lucide-react";

const sampleSalaries = [
  { name: "John Smith", role: "Principal", amount: 45000, status: "paid" },
  { name: "Sarah Wilson", role: "Senior Teacher", amount: 32000, status: "paid" },
  { name: "Michael Brown", role: "Junior Teacher", amount: 28000, status: "pending" },
  { name: "Emily Davis", role: "Admin Staff", amount: 25000, status: "paid" },
];

export default function SalaryPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Salary</h1>
        <p className="text-muted-foreground">Manage payroll and staff compensation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 130,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleSalaries.length} Employees</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Status</CardTitle>
          <CardDescription>Current month compensation tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Gross Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSalaries.map((salary, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{salary.name}</TableCell>
                  <TableCell>{salary.role}</TableCell>
                  <TableCell>R {salary.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={salary.status === "paid" ? "success" : "secondary"}>
                      {salary.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
