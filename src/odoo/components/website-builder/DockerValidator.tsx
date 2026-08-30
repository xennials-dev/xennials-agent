import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  ShieldAlert, 
  FileCode, 
  Layers, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '../../utils';

export default function DockerValidator() {
  const defaultCompose = `version: '3.8'

services:
  odoo_web:
    image: odoo:16.0
    depends_on:
      - odoo_db
    ports:
      # CRITICAL WARNING: Do not bind to host port 3000, 
      # since port 3000 is occupied by our Live Reverse Proxy!
      - "8069:8069"
    environment:
      - HOST=odoo_db
      - USER=odoo
      - PASSWORD=odoo_secure_password
    volumes:
      - odoo-web-data:/var/lib/odoo

  odoo_db:
    image: postgres:15
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo_secure_password
    volumes:
      - odoo-db-data:/var/lib/postgresql/data

volumes:
  odoo-web-data:
  odoo-db-data:
`;

  const [dockerComposeText, setDockerComposeText] = useState(defaultCompose);
  const [warnings, setWarnings] = useState<Array<{ type: 'error' | 'warning' | 'success', msg: string, fix?: string }>>([]);
  const [isSimulatingContainers, setIsSimulatingContainers] = useState(false);
  const [containerLogs, setContainerLogs] = useState<string[]>([]);
  const [validationDone, setValidationDone] = useState(false);

  const handleValidateDocker = () => {
    const list: typeof warnings = [];
    const lowerContent = dockerComposeText.toLowerCase();

    // Rule 1: Port conflict checking
    // Match strings like "3000:8069" or "3000:3000" or just matching ":3000"
    const port3000Regex = /["'](?:0\.0\.0\.0:)?3000:([0-9]+)["']/;
    if (port3000Regex.test(lowerContent) || lowerContent.includes('"3000"') || lowerContent.includes(' 3000:')) {
      list.push({
        type: 'error',
        msg: "Port Conflict: Host port 3000 is occupied by AI Studio's reverse proxy!",
        fix: "Modify your mapping to another port (e.g., - \"8069:8069\"). Leaving 3000 for your container will completely block external preview routing ingress."
      });
    } else {
      list.push({
        type: 'success',
        msg: "Port Mapping validated. Container host port 3000 is kept free for reverse proxy routing."
      });
    }

    // Rule 2: DB password security
    if (lowerContent.includes('password=odoo') || lowerContent.includes('password=postgres') || lowerContent.includes('password=admin')) {
      list.push({
        type: 'warning',
        msg: "Plaintext insecure default password detected inside DB context.",
        fix: "Substitute 'odoo_secure_password' with randomized keys or load credentials securely using Docker Secrets (.env)."
      });
    }

    // Rule 3: Volume persistence
    if (!lowerContent.includes('volumes:') || lowerContent.split('volumes:').length < 3) {
      list.push({
        type: 'warning',
        msg: "Missing local persistent Docker named volumes configurations.",
        fix: "If you do not map '/var/lib/postgresql/data' to a persistent host volume, restart cycles will eradicate all Odoo model structures, custom school registries, and lead rows!"
      });
    } else {
      list.push({
        type: 'success',
        msg: "Volume block parsed. Persistent database directories verified successfully."
      });
    }

    // Rule 4: Standard health check
    if (!lowerContent.includes('healthcheck') && !lowerContent.includes('depends_on')) {
      list.push({
        type: 'warning',
        msg: "Database service startup delay check absent.",
        fix: "Add 'depends_on: odoo_db' with service_healthy configurations to prevent the Odoo web service from crashing before Postgres table ports initialize."
      });
    }

    setWarnings(list);
    setValidationDone(true);
  };

  const simulateUp = () => {
    if (warnings.some(w => w.type === 'error')) {
      alert('Please fix key port and layout errors before attempting Docker Compose spin-up.');
      return;
    }

    setIsSimulatingContainers(true);
    setContainerLogs([
      "[SYSTEM] Loading Docker Compose runtime stack...",
      "[DOCKER] Resolving local image caches...",
      "[DOCKER] pulling image 'postgres:15' ... [OK]",
      "[DOCKER] pulling image 'odoo:16.0' ... [OK]",
      "[DOCKER] Creating virtual network 'odoo_default' ... [SUCCESS]",
      "[DOCKER] Creating local persistence volume 'odoo-db-data' ... [OK]",
      "[DOCKER] Creating local persistence volume 'odoo-web-data' ... [OK]",
      "[DOCKER] Booting container: odoo_db_1 ...",
      "[POSTGRES] PostgreSQL database engine initialized. Port binding 5432 verified.",
      "[POSTGRES] Database system is ready to accept connections on port 5432.",
      "[DOCKER] Booting container: odoo_web_1 ...",
      "[ODOO] Odoo version 16.0 loading. Preparing default config parameters.",
      "[ODOO] Handshaking database 'odoo_db' ... Connection success! tables loaded.",
      "[ODOO] Registering custom school registry and real_estate addon models... Done.",
      "[ODOO] HTTP Server running. Open Odoo locally at http://localhost:8069."
    ]);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden text-sm bg-[#0E1218]" id="docker-validator-root">
      
      {/* Docker-compose yaml code editor on left */}
      <div className="flex-1 flex flex-col border-r border-[#1C222A] bg-[#0E1217] h-full overflow-hidden shrink-0 select-none">
        <div className="px-4.5 py-3.5 border-b border-[#1C222A] flex justify-between items-center bg-[#0E1217] shrink-0">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">docker-compose.yml Specifications</span>
          </div>
          <button
            onClick={handleValidateDocker}
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-mono font-bold px-3.5 py-1.5 rounded uppercase transition shadow-cyan-550/15"
          >
            Validate Code
          </button>
        </div>

        <div className="flex-1 overflow-auto p-1 bg-black/40">
          <textarea
            value={dockerComposeText}
            onChange={(e) => {
              setDockerComposeText(e.target.value);
              setValidationDone(false);
            }}
            rows={25}
            className="w-full h-full bg-transparent text-cyan-150 p-4 font-mono text-[11px] focus:outline-none focus:ring-0 leading-relaxed resize-none scrollbar-thin select-text selection:bg-cyan-500/20"
          />
        </div>
      </div>

      {/* Validation reports and simulation outputs on right */}
      <div className="w-full lg:w-[480px] bg-[#090C10] flex flex-col h-full overflow-hidden">
        
        {/* Upper warnings block */}
        <div className="p-4 border-b border-[#1C222A] bg-[#0E1217] flex-1 flex flex-col overflow-y-auto space-y-3 scrollbar-thin select-none">
          <h5 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-405" />
            <span>Deployment / Validation Report</span>
          </h5>

          {!validationDone ? (
            <div className="text-center p-8 text-xs text-gray-500 font-mono flex-1 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-8 h-8 text-gray-800 animate-spin" />
              <p>Click 'VALIDATE CODE' to parse container specs and audit network ports.</p>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in flex-1">
              {warnings.map((w, idx) => {
                let alertColor = "border-emerald-500/25 bg-emerald-500/5 text-emerald-300";
                let badge = "PASSED";
                let icon = <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;

                if (w.type === 'error') {
                  alertColor = "border-rose-500/25 bg-rose-500/5 text-rose-300";
                  badge = "FAILED CRITICAL";
                  icon = <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
                } else if (w.type === 'warning') {
                  alertColor = "border-amber-400/20 bg-amber-500/5 text-amber-200";
                  badge = "WARN";
                  icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />;
                }

                return (
                  <div key={idx} className={cn("p-3 rounded-lg border text-[11px] font-mono flex gap-2.5 items-start leading-snug", alertColor)}>
                    {icon}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-[9px] uppercase font-black tracking-widest px-1 bg-black/25 rounded">
                          {badge}
                        </span>
                        <span>{w.msg}</span>
                      </div>
                      {w.fix && <p className="text-[10px] text-gray-400 whitespace-pre-line">{w.fix}</p>}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 text-center select-none">
                <button
                  onClick={simulateUp}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold uppercase py-2 px-5 rounded-lg text-xs tracking-wider transition shadow-lg shadow-emerald-950/20 flex items-center gap-1.5 mx-auto"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Spin up Compose Containers</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Runtime simulator console logs on bottom */}
        <div className="h-56 border-t border-[#1C222A] bg-[#050608] p-4 flex flex-col overflow-hidden select-text font-mono text-[10.5px]">
          <div className="flex justify-between items-center text-[9px] text-[#8E95A3] uppercase tracking-widest border-b border-white/5 pb-1 mb-2 select-none shrink-0">
            <span>Compose runtime terminals</span>
            <span className={isSimulatingContainers ? "text-emerald-400 animate-pulse" : "text-gray-600"}>
              {isSimulatingContainers ? "● STACK LIVE" : "● OFFLINE"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 selection:bg-emerald-500/25 text-[#96A4B9] pr-1 scrollbar-thin">
            {containerLogs.length === 0 ? (
              <p className="text-gray-600 italic select-none">Awaiting simulated network load sequence trigger...</p>
            ) : (
              containerLogs.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
