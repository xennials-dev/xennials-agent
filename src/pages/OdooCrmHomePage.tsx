import React from 'react';
import OdooApp from '../odoo/App';

/**
 * Odoo Enterprise CRM Home Page
 * Serves as the central Homepage & CRM Command Center of Hermes Agent
 */
export default function OdooCrmHomePage() {
  return (
    <div className="w-full h-full min-h-screen bg-[#0B0D10] text-[#E0E2E6]">
      <OdooApp />
    </div>
  );
}
