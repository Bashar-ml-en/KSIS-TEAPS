import { useState } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calculator, Info, TrendingUp, AlertCircle } from 'lucide-react';
import backgroundImage from '../../assets/aiuis-bg.jpg';
import { View } from '../../App';

interface KPICalculationProps {
  onNavigate: (view: View) => void;
  onLogout: () => void;
  userName?: string;
  userRole: 'teacher' | 'admin' | 'principal';
}

const calculationSteps = [
  {
    step: 1,
    title: 'Data Collection',
    description: 'Gather all relevant data from various sources for the evaluation period',
    details: [
      'Student evaluation responses',
      'Attendance records (time-in/time-out)',
      'Professional development activities',
      'School contribution records',
      'Research and innovation documentation'
    ]
  },
  {
    step: 2,
    title: 'Component Scoring',
    description: 'Calculate individual scores for each KPI component',
    details: [
      'Teaching Effectiveness: Average of student ratings (0-100)',
      'Professional Development: Points per activity (max 100)',
      'School Contribution: Weighted participation score (max 100)',
      'Attendance: (Days present / Total days) × 100',
      'Innovation: Research points + Innovation score (max 100)'
    ]
  },
  {
    step: 3,
    title: 'Weight Application',
    description: 'Apply the designated weight to each component score',
    details: [
      'Teaching Effectiveness × 35% = Weighted Score 1',
      'Professional Development × 20% = Weighted Score 2',
      'School Contribution × 20% = Weighted Score 3',
      'Attendance & Punctuality × 15% = Weighted Score 4',
      'Innovation & Research × 10% = Weighted Score 5'
    ]
  },
  {
    step: 4,
    title: 'Final Calculation',
    description: 'Sum all weighted scores to get the final KPI',
    details: [
      'Final KPI = Sum of all weighted scores',
      'Result is a percentage value (0-100%)',
      'KPI is rounded to one decimal place',
      'Performance rating assigned based on KPI range'
    ]
  }
];

const exampleCalculation = {
  teachingEffectiveness: { score: 92, weight: 0.35, weighted: 32.2 },
  professionalDevelopment: { score: 85, weight: 0.20, weighted: 17.0 },
  schoolContribution: { score: 88, weight: 0.20, weighted: 17.6 },
  attendance: { score: 96, weight: 0.15, weighted: 14.4 },
  innovation: { score: 78, weight: 0.10, weighted: 7.8 },
  total: 89.0
};

const performanceRatings = [
  { range: '90% - 100%', rating: 'Outstanding', color: 'bg-green-100 text-green-700 border-green-300' },
  { range: '80% - 89%', rating: 'Excellent', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { range: '70% - 79%', rating: 'Good', color: 'bg-brown-100 text-brown-700 border-brown-300' },
  { range: '60% - 69%', rating: 'Satisfactory', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { range: 'Below 60%', rating: 'Needs Improvement', color: 'bg-red-100 text-red-700 border-red-300' },
];

export function KPICalculation({ onNavigate, onLogout, userName, userRole }: KPICalculationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div 
      className="flex h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/67 backdrop-blur-sm" />
      
      <div className="relative z-10 flex h-screen overflow-hidden w-full">
        <Sidebar
          role={userRole}
          currentView="kpi-calculation"
          onNavigate={onNavigate}
          onLogout={onLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title="How KPI is Calculated"
            userName={userName}
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Introduction */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>KPI Calculation Methodology</CardTitle>
                <CardDescription>
                  Step-by-step process for calculating teacher Key Performance Indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-100 border border-blue-500 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-blue-800 mb-2">Calculation Overview</h3>
                      <p className="text-blue-800 mb-3">
                        The KPI calculation follows a systematic weighted average approach, where each performance component 
                        contributes to the final score based on its assigned importance.
                      </p>
                      <p className="text-blue-800">
                        All calculations are automated and performed at the end of each evaluation period to ensure 
                        consistency and fairness across all teachers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Steps */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-4">Calculation Process</h2>
              <div className="space-y-4">
                {calculationSteps.map((item) => (
                  <Card key={item.step} className="border-l-4 border-l-purple-600">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-600 text-black rounded-full flex items-center justify-center flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-gray-900 mb-1">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 ml-14">
                        {item.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-600 text-xs">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Example Calculation */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Example Calculation</CardTitle>
                <CardDescription>
                  See how a teacher's KPI is calculated using sample data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-purple-600">
                        <th className="text-left py-3 px-4 text-purple-900">Component</th>
                        <th className="text-right py-3 px-4 text-purple-900">Raw Score</th>
                        <th className="text-right py-3 px-4 text-purple-900">Weight</th>
                        <th className="text-right py-3 px-4 text-purple-900">Weighted Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-900">Teaching Effectiveness</td>
                        <td className="py-3 px-4 text-right text-gray-700">{exampleCalculation.teachingEffectiveness.score}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{(exampleCalculation.teachingEffectiveness.weight * 100)}%</td>
                        <td className="py-3 px-4 text-right text-purple-600">{exampleCalculation.teachingEffectiveness.weighted}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-900">Professional Development</td>
                        <td className="py-3 px-4 text-right text-gray-700">{exampleCalculation.professionalDevelopment.score}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{(exampleCalculation.professionalDevelopment.weight * 100)}%</td>
                        <td className="py-3 px-4 text-right text-purple-600">{exampleCalculation.professionalDevelopment.weighted}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-900">School Contribution</td>
                        <td className="py-3 px-4 text-right text-gray-700">{exampleCalculation.schoolContribution.score}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{(exampleCalculation.schoolContribution.weight * 100)}%</td>
                        <td className="py-3 px-4 text-right text-purple-600">{exampleCalculation.schoolContribution.weighted}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-900">Attendance & Punctuality</td>
                        <td className="py-3 px-4 text-right text-gray-700">{exampleCalculation.attendance.score}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{(exampleCalculation.attendance.weight * 100)}%</td>
                        <td className="py-3 px-4 text-right text-purple-600">{exampleCalculation.attendance.weighted}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 text-gray-900">Innovation & Research</td>
                        <td className="py-3 px-4 text-right text-gray-700">{exampleCalculation.innovation.score}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{(exampleCalculation.innovation.weight * 100)}%</td>
                        <td className="py-3 px-4 text-right text-purple-600">{exampleCalculation.innovation.weighted}</td>
                      </tr>
                      <tr className="bg-purple-50 border-t-2 border-purple-600">
                        <td className="py-4 px-4 text-purple-900">Final KPI Score</td>
                        <td className="py-4 px-4"></td>
                        <td className="py-4 px-4 text-right text-purple-900">100%</td>
                        <td className="py-4 px-4 text-right text-purple-900">{exampleCalculation.total}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-green-900 mb-1">Performance Rating: <strong>Excellent</strong></p>
                      <p className="text-green-800 text-xs">
                        This teacher has achieved an {exampleCalculation.total}% KPI score, which falls in the "Excellent" performance category.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Rating Scale</CardTitle>
                <CardDescription>
                  KPI scores are categorized into performance ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceRatings.map((rating, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg ${rating.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-current" />
                        <span className="font-medium">{rating.rating}</span>
                      </div>
                      <span>{rating.range}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-900 mb-1">Important Note</h4>
                      <p className="text-blue-800 text-xs">
                        KPI scores are calculated automatically at the end of each evaluation period (semester). 
                        Teachers can track their progress throughout the period and request re-evaluation if they 
                        believe there are discrepancies in the data or calculations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
