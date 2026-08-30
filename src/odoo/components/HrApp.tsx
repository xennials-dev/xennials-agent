import React, { useState } from 'react';
import { Users, UserPlus, Briefcase, Calendar, ShieldCheck, Mail, CheckCircle, Search, Sparkles, RefreshCw, RotateCcw, Camera, Mic, Sliders, Check, ArrowLeft } from 'lucide-react';
import { cn } from '../utils';

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  status: 'active' | 'on_leave' | 'onboarding';
  avatarConfig?: {
    hairStyle: number;
    color: string;
    transparent: number;
    shade: number;
    texture: number;
    template: string;
  };
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Walker', jobTitle: 'Software Engineer', department: 'Engineering', email: 'alice.walker@example.com', status: 'active' },
  { id: '2', name: 'David Smith', jobTitle: 'Product Manager', department: 'Product', email: 'david.smith@example.com', status: 'on_leave' },
  { id: '3', name: 'Sarah Jones', jobTitle: 'HR Specialist', department: 'Human Resources', email: 'sarah.jones@example.com', status: 'active' },
  { id: '4', name: 'Michael Chen', jobTitle: 'Marketing Director', department: 'Marketing', email: 'michael.chen@example.com', status: 'onboarding' },
  { id: '5', name: 'Elena Rostova', jobTitle: 'AI Research Lead', department: 'Artificial Intelligence', email: 'elena.rostova@example.com', status: 'active' },
  { id: '6', name: 'Marcus Vance', jobTitle: 'DevOps Architect', department: 'Infrastructure', email: 'marcus.vance@example.com', status: 'active' },
];

const HAIR_STYLES = [
  { id: 1, name: 'Long Wavy', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Textured Cap', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Sleek Bob', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Curly Waves', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'Cropped Fade', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 6, name: 'Dreadlocks', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
  { id: 7, name: 'High Top', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
  { id: 8, name: 'Messy Copper', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
];

const COLOR_PALETTE = [
  '#0055FF', '#2563EB', '#7C3AED', '#DB2777', '#E11D48', '#EA580C', '#D97706', '#CA8A04', '#65A30D', '#16A34A',
  '#0D9488', '#0284C7', '#4F46E5', '#9333EA', '#C026D3', '#F43F5E', '#FB923C', '#FACC15', '#4ADE80', '#2DD4BF'
];

const TEMPLATES = [
  { name: 'Satsu Waskin', role: 'Cyber Security', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Cyberborg', role: 'Neural Architect', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Jemmy Sumil', role: 'Operations Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
];

const RANDOM_NAMES = [
  'Alex Rivers', 'Jordan Taylor', 'Morgan Blake', 'Taylor Reed', 'Casey Vance', 
  'Samira Khan', 'Liam O\'Connor', 'Zoe Sterling', 'Dante Morales', 'Aria Chen'
];

const RANDOM_TITLES = [
  'Senior AI Engineer', 'Product Strategist', 'UI/UX Designer', 'Cloud Specialist', 
  'Data Scientist', 'Security Analyst', 'Full Stack Developer', 'Operations Manager'
];

const RANDOM_DEPARTMENTS = [
  'Engineering', 'Product', 'Human Resources', 'Marketing', 'Artificial Intelligence', 'Infrastructure', 'Finance'
];

export default function HrApp() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activeTab, setActiveTab] = useState<'employees' | 'recruitment'>('employees');
  const [isCreatingEmployee, setIsCreatingEmployee] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Avatar customization states
  const [empName, setEmpName] = useState<string>('Alex Rivers');
  const [empTitle, setEmpTitle] = useState<string>('Senior AI Engineer');
  const [empDepartment, setEmpDepartment] = useState<string>('Engineering');
  const [empEmail, setEmpEmail] = useState<string>('alex.rivers@example.com');
  const [empStatus, setEmpStatus] = useState<'active' | 'on_leave' | 'onboarding'>('active');

  const [selectedHair, setSelectedHair] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('#7C3AED');
  const [transparentVal, setTransparentVal] = useState<number>(30);
  const [shadeVal, setShadeVal] = useState<number>(20);
  const [textureVal, setTextureVal] = useState<number>(75);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Satsu Waskin');
  const [isRotating360, setIsRotating360] = useState<boolean>(true);

  // Auto-generate random employee
  const handleAutoGenerate = () => {
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const randomTitle = RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)];
    const randomDept = RANDOM_DEPARTMENTS[Math.floor(Math.random() * RANDOM_DEPARTMENTS.length)];
    const emailSlug = randomName.toLowerCase().replace(' ', '.');
    
    setEmpName(randomName);
    setEmpTitle(randomTitle);
    setEmpDepartment(randomDept);
    setEmpEmail(`${emailSlug}@example.com`);
    setSelectedHair(Math.floor(Math.random() * HAIR_STYLES.length) + 1);
    setSelectedColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
    setTransparentVal(Math.floor(Math.random() * 50) + 10);
    setShadeVal(Math.floor(Math.random() * 40) + 10);
    setTextureVal(Math.floor(Math.random() * 60) + 30);
  };

  const handleSaveEmployee = () => {
    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      name: empName,
      jobTitle: empTitle,
      department: empDepartment,
      email: empEmail,
      status: empStatus,
      avatarConfig: {
        hairStyle: selectedHair,
        color: selectedColor,
        transparent: transparentVal,
        shade: shadeVal,
        texture: textureVal,
        template: selectedTemplate
      }
    };
    setEmployees([newEmp, ...employees]);
    setIsCreatingEmployee(false);
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreatingEmployee) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#EBF0F6] text-[#1E232B] overflow-y-auto font-sans select-none">
        {/* Top Navbar */}
        <div className="bg-[#D8E2EC]/90 backdrop-blur border-b border-[#C5D3E2] px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCreatingEmployee(false)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-black bg-white/80 border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to HR Employees
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md">
                W
              </div>
              <span className="font-extrabold text-sm tracking-wide text-gray-900">Wemind® Avatar Studio</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-600 ml-6">
              <span className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 cursor-pointer">Avatar Studio</span>
              <span className="hover:text-gray-900 cursor-pointer transition">Costume Library</span>
              <span className="hover:text-gray-900 cursor-pointer transition">Creators</span>
              <span className="hover:text-gray-900 cursor-pointer transition">Trending Styles</span>
              <span className="hover:text-gray-900 cursor-pointer transition">News & Updates</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleAutoGenerate}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Auto-Generate
            </button>
            <button 
              onClick={handleSaveEmployee}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Save Employee
            </button>
          </div>
        </div>

        {/* Main Content (image.png layout concept) */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Style Controls (Hair, Colors, Sliders) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Header info */}
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">COSTUMIZE AVATAR</h1>
              <p className="text-xs text-gray-600 mt-0.5">Costume look and style your character</p>
            </div>

            {/* Employee Basic Info Form Card */}
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">Employee Credentials</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={empName} 
                    onChange={e => setEmpName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={empTitle} 
                    onChange={e => setEmpTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Department</label>
                  <select 
                    value={empDepartment}
                    onChange={e => setEmpDepartment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {RANDOM_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold block mb-1">Status</label>
                  <select 
                    value={empStatus}
                    onChange={e => setEmpStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="onboarding">Onboarding</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hair Style Section */}
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-gray-800 tracking-wider font-mono">Hair Style</span>
                <span className="text-gray-400 text-xs font-bold cursor-pointer">...</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {HAIR_STYLES.map(hair => (
                  <button 
                    key={hair.id}
                    onClick={() => setSelectedHair(hair.id)}
                    className={cn(
                      "rounded-xl overflow-hidden border-2 transition relative aspect-square bg-gray-100",
                      selectedHair === hair.id ? "border-blue-600 shadow-md ring-2 ring-blue-500/20" : "border-gray-200 hover:border-gray-400"
                    )}
                  >
                    <img src={hair.img} alt={hair.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Style Section */}
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-gray-800 tracking-wider font-mono">Color Style</span>
                <span className="text-gray-400 text-xs font-bold cursor-pointer">...</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {COLOR_PALETTE.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={cn(
                      "w-full aspect-square rounded-full transition shadow-sm",
                      selectedColor === hex ? "ring-2 ring-offset-2 ring-blue-600 scale-110" : "hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Texture Stats Sliders */}
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Transparent</span>
                  <span className="font-mono">{transparentVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={transparentVal} 
                  onChange={e => setTransparentVal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Shade</span>
                  <span className="font-mono">{shadeVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={shadeVal} 
                  onChange={e => setShadeVal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Texture/Detail</span>
                  <span className="font-mono">{textureVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={textureVal} 
                  onChange={e => setTextureVal(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>
            </div>

          </div>

          {/* Center Column: Live 360 Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[520px]">
            {/* Background decorative grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20 rounded-3xl border border-white/60 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Avatar Render Character Portrait */}
            <div className="relative z-10 w-full max-w-md aspect-[3/4] flex items-center justify-center p-4">
              <div className={cn(
                "w-full h-full rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white/80 transition-transform duration-500",
                isRotating360 && "animate-pulse"
              )}>
                <img 
                  src={HAIR_STYLES.find(h => h.id === selectedHair)?.img || HAIR_STYLES[0].img} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover filter contrast-105 saturate-105"
                  style={{ borderColor: selectedColor }}
                />
                
                {/* Live Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE 360° RENDER
                </div>

                {/* Name Overlay Tag */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/85 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm">{empName}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{empTitle} • {empDepartment}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: selectedColor }}>
                    {empName.charAt(0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 mt-4 flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 px-4 py-2 rounded-2xl shadow-md">
              <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition">
                <Mic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsRotating360(!isRotating360)}
                className={cn(
                  "px-4 h-10 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition",
                  isRotating360 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <RotateCcw className="w-3.5 h-3.5" /> 360°
              </button>
              <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition">
                <Camera className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Templates & File Info */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-black uppercase text-gray-800 tracking-wider font-mono mb-3 block">TEMPLATE</span>
              <div className="space-y-3">
                {TEMPLATES.map(tmpl => (
                  <div 
                    key={tmpl.name}
                    onClick={() => {
                      setSelectedTemplate(tmpl.name);
                      setEmpTitle(tmpl.role);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition",
                      selectedTemplate === tmpl.name ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <img src={tmpl.img} alt={tmpl.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-gray-900">{tmpl.name}</h5>
                      <p className="text-[11px] text-gray-500">{tmpl.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Info */}
            <div className="bg-white/90 backdrop-blur border border-gray-200/80 rounded-2xl p-4 shadow-sm space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center text-gray-600">
                <span>File Weight:</span>
                <span className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">321.6 MB</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Avatar Format:</span>
                <span className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">.GLB / .FBX</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Poly Count:</span>
                <span className="text-gray-900 font-bold bg-gray-100 px-2 py-0.5 rounded">48,250</span>
              </div>
            </div>

            {/* Action Save Button */}
            <div className="pt-2">
              <button 
                onClick={handleSaveEmployee}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Check className="w-4 h-4" /> Save & Add to HR Department
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA]">
      {/* Top Navbar */}
      <div className="bg-white border-b border-[#E0E0E0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-pink-600 text-white p-2 rounded-lg shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#3B3B3B]">Human Resources</h1>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => setActiveTab('employees')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'employees' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Employees ({employees.length})
            </button>
            <button 
              onClick={() => setActiveTab('recruitment')}
              className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", activeTab === 'recruitment' ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50")}
            >
              Recruitment
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCreatingEmployee(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> New Employee
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'employees' ? (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employees or agents..." 
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded">Filter</button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded">Group By</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEmployees.map(emp => (
                <div key={emp.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-20 bg-gradient-to-r from-pink-50 via-rose-50 to-blue-50 flex items-start justify-between p-2.5">
                    <span className={cn(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                      emp.status === 'active' ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                      emp.status === 'onboarding' ? "bg-amber-50 border-amber-200 text-amber-700" :
                      "bg-blue-50 border-blue-200 text-blue-700"
                    )}>
                      {emp.status.replace('_', ' ')}
                    </span>
                    {emp.avatarConfig && (
                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        3D Avatar
                      </span>
                    )}
                  </div>
                  <div className="px-4 py-3 relative flex-1 flex flex-col">
                    <div className="absolute -top-10 left-4 w-16 h-16 bg-white rounded-xl border border-gray-200 p-1 shadow-sm overflow-hidden">
                      {emp.avatarConfig ? (
                        <div 
                          className="w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: emp.avatarConfig.color }}
                        >
                          {emp.name.charAt(0)}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold text-xl">
                          {emp.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-gray-900 font-bold text-base truncate">{emp.name}</h3>
                      <p className="text-emerald-700 text-sm font-medium truncate mb-2">{emp.jobTitle}</p>
                      
                      <div className="space-y-1.5 mt-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{emp.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-900 font-medium text-lg mb-1">Recruitment Pipeline</h3>
              <p className="text-gray-500 text-sm mb-4">You have no active job positions published.</p>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                Create Job Position
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

