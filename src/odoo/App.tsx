import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PARTNERS, 
  INITIAL_PRODUCTS, 
  INITIAL_LEADS, 
  INITIAL_SALES, 
  INITIAL_INVOICES, 
  INITIAL_STOCK_MOVES, 
  INITIAL_ADDONS 
} from './initialData';
import { 
  ResPartner, 
  ProductProduct, 
  CrmLead, 
  SaleOrder, 
  AccountInvoice, 
  StockMove, 
  CustomOdooAddon, 
  CustomOdooModel, 
  DynamicRecord 
} from './types';
import Sidebar from './components/Sidebar';
import CrmApp from './components/CrmApp';
import SalesApp from './components/SalesApp';
import InvoicesApp from './components/InvoicesApp';
import InventoryApp from './components/InventoryApp';
import StudioApp from './components/StudioApp';
import OdooAppsStore from './components/OdooAppsStore';
import DbExplorer from './components/DbExplorer';
import CustomAppRenderer from './components/CustomAppRenderer';
import PlaceholderApp from './components/PlaceholderApp';
import HrApp from './components/HrApp';
import MarketingApp from './components/MarketingApp';
import WebsiteBuilderApp from './components/WebsiteBuilderApp';
import ProductivityApp from './components/ProductivityApp';
import AiBrandAgentApp from './components/AiBrandAgentApp';
import BiApp from './components/BiApp';
import OpenaiCookbookApp from './components/OpenaiCookbookApp';
import OdooDevOpsApp from './components/OdooDevOpsApp';
import AiAgencyHqApp from './components/AiAgencyHqApp';

export default function App() {
  // Local Database Persistence Wrapper for dynamic Sandbox reloadability
  const [partners, setPartners] = useState<ResPartner[]>(() => {
    const cached = localStorage.getItem('odoo_partners');
    return cached ? JSON.parse(cached) : INITIAL_PARTNERS;
  });

  const [products, setProducts] = useState<ProductProduct[]>(() => {
    const cached = localStorage.getItem('odoo_products');
    return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
  });

  const [leads, setLeads] = useState<CrmLead[]>(() => {
    const cached = localStorage.getItem('odoo_leads');
    return cached ? JSON.parse(cached) : INITIAL_LEADS;
  });

  const [sales, setSales] = useState<SaleOrder[]>(() => {
    const cached = localStorage.getItem('odoo_sales');
    return cached ? JSON.parse(cached) : INITIAL_SALES;
  });

  const [invoices, setInvoices] = useState<AccountInvoice[]>(() => {
    const cached = localStorage.getItem('odoo_invoices');
    return cached ? JSON.parse(cached) : INITIAL_INVOICES;
  });

  const [stockMoves, setStockMoves] = useState<StockMove[]>(() => {
    const cached = localStorage.getItem('odoo_stock_moves');
    return cached ? JSON.parse(cached) : INITIAL_STOCK_MOVES;
  });

  const [addons, setAddons] = useState<CustomOdooAddon[]>(() => {
    const cached = localStorage.getItem('odoo_addons');
    return cached ? JSON.parse(cached) : INITIAL_ADDONS;
  });

  const [installedAddons, setInstalledAddons] = useState<string[]>(() => {
    const cached = localStorage.getItem('odoo_installed_addons');
    return cached ? JSON.parse(cached) : [];
  });

  const [customModels, setCustomModels] = useState<CustomOdooModel[]>(() => {
    const cached = localStorage.getItem('odoo_custom_models');
    return cached ? JSON.parse(cached) : [];
  });

  const [customRecords, setCustomRecords] = useState<Record<string, DynamicRecord[]>>(() => {
    const cached = localStorage.getItem('odoo_custom_records');
    return cached ? JSON.parse(cached) : {};
  });

  // Global UX navigation params
  const [activeAppId, setActiveAppId] = useState<string>('apps'); // 'apps' | 'crm' | 'sales' | 'invoices' | 'inventory' | 'studio' | 'database' | custom addons IDs
  const [developerMode, setDeveloperMode] = useState<boolean>(false);

  // Sync state variables back to storage
  useEffect(() => {
    localStorage.setItem('odoo_partners', JSON.stringify(partners));
    localStorage.setItem('odoo_products', JSON.stringify(products));
    localStorage.setItem('odoo_leads', JSON.stringify(leads));
    localStorage.setItem('odoo_sales', JSON.stringify(sales));
    localStorage.setItem('odoo_invoices', JSON.stringify(invoices));
    localStorage.setItem('odoo_stock_moves', JSON.stringify(stockMoves));
    localStorage.setItem('odoo_addons', JSON.stringify(addons));
    localStorage.setItem('odoo_installed_addons', JSON.stringify(installedAddons));
    localStorage.setItem('odoo_custom_models', JSON.stringify(customModels));
    localStorage.setItem('odoo_custom_records', JSON.stringify(customRecords));
  }, [partners, products, leads, sales, invoices, stockMoves, addons, installedAddons, customModels, customRecords]);

  // Global warehouse transaction generator helper
  const addStockMove = (product_id: string, qty: number, type: 'in' | 'out' | 'adjust', ref: string) => {
    const newMove: StockMove = {
      id: `move_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      reference: ref,
      product_id,
      qty,
      type,
      date: new Date().toISOString().split('T')[0],
      state: 'done'
    };
    setStockMoves((prev) => [newMove, ...prev]);
  };

  // Helper routine to let Apps Store install presets directly on click
  const compileAddonOnTheFly = (addon: CustomOdooAddon) => {
    // 1. Compile custom model from custom Python code representation inside the registry
    const regexMatch = addon.python_code.match(/_name\s*=\s*['"]([^'"]+)['"]/);
    if (!regexMatch) return;
    const modelName = regexMatch[1];

    const fieldsList: Array<{ name: string; type: 'char' | 'integer' | 'float' | 'boolean'; string: string }> = [
      { name: 'name', type: 'char', string: 'Name' }
    ];

    // Generic parsing of Python Odoo fields configurations
    const lines = addon.python_code.split('\n');
    lines.forEach((line) => {
      const fieldMatch = line.match(/^\s*([a-zA-Z_0-9]+)\s*=\s*fields\.([a-zA-Z]+)\s*\((.*)\)/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1].trim();
        const fieldType = fieldMatch[2].trim();
        const argsStr = fieldMatch[3] || '';

        // Avoid duplication of name field
        if (fieldName === 'name') return;

        let resolvedType: 'char' | 'integer' | 'float' | 'boolean' = 'char';
        if (fieldType === 'Integer') resolvedType = 'integer';
        else if (fieldType === 'Float') resolvedType = 'float';
        else if (fieldType === 'Boolean') resolvedType = 'boolean';

        let stringLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ');
        const labelMatch = argsStr.match(/string\s*=\s*['"]([^'"]+)['"]/);
        if (labelMatch) {
          stringLabel = labelMatch[1];
        }

        fieldsList.push({
          name: fieldName,
          type: resolvedType,
          string: stringLabel
        });
      }
    });

    const dynamicClassName = modelName
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const compiledModel: CustomOdooModel = {
      name: modelName,
      className: dynamicClassName,
      fields: fieldsList as any
    };

    setCustomModels((prev) => {
      const filtered = prev.filter((m) => m.name !== compiledModel.name);
      return [...filtered, compiledModel];
    });

    setCustomRecords((prev) => {
      if (!prev[compiledModel.name]) {
        return { ...prev, [compiledModel.name]: [] };
      }
      return prev;
    });

    setAddons((prev) =>
      prev.map((a) => (a.id === addon.id ? { ...a, state: 'installed' } : a))
    );

    setInstalledAddons((prev) => {
      if (!prev.includes(addon.id)) return [...prev, addon.id];
      return prev;
    });

    // Auto navigate to the newly loaded app
    setActiveAppId(addon.id);
  };

  // Dynamic application router rendering sub-system
  const renderSubApp = () => {
    switch (activeAppId) {
      case 'apps':
        return (
          <OdooAppsStore 
            addons={addons}
            installedAddons={installedAddons}
            setInstalledAddons={setInstalledAddons}
            setAddons={setAddons}
            setActiveAppId={setActiveAppId}
            setCompileLogs={() => {}}
            compileAddon={compileAddonOnTheFly}
          />
        );
      case 'crm':
        return (
          <CrmApp 
            leads={leads}
            partners={partners}
            setLeads={setLeads}
          />
        );
      case 'sales':
        return (
          <SalesApp 
            sales={sales}
            partners={partners}
            products={products}
            setSales={setSales}
            setInvoices={setInvoices}
            setProducts={setProducts}
            addStockMove={addStockMove}
            setActiveAppId={setActiveAppId}
          />
        );
      case 'invoices':
        return (
          <InvoicesApp 
            invoices={invoices}
            partners={partners}
            products={products}
            setInvoices={setInvoices}
          />
        );
      case 'inventory':
        return (
          <InventoryApp 
            products={products}
            stockMoves={stockMoves}
            setProducts={setProducts}
            addStockMove={addStockMove}
          />
        );
      case 'studio':
        return (
          <StudioApp 
            addons={addons}
            setAddons={setAddons}
            customModels={customModels}
            setCustomModels={setCustomModels}
            setCustomRecords={setCustomRecords}
            setInstalledAddons={setInstalledAddons}
            installedAddons={installedAddons}
            setActiveAppId={setActiveAppId}
          />
        );
      case 'database':
        return (
          <DbExplorer 
            partners={partners}
            products={products}
            leads={leads}
            sales={sales}
            invoices={invoices}
            stockMoves={stockMoves}
            customModels={customModels}
            customRecords={customRecords}
          />
        );
      case 'hr':
        return <HrApp />;
      case 'marketing':
        return <MarketingApp />;
      case 'website_builder':
        return <WebsiteBuilderApp />;
      case 'productivity':
        return <ProductivityApp />;
      case 'ai_brand_agent':
        return <AiBrandAgentApp />;
      case 'ai_agency_hq':
        return <AiAgencyHqApp />;
      case 'bi':
        return <BiApp />;
      case 'openai_cookbook':
        return <OpenaiCookbookApp />;
      case 'odoo_devops':
        return <OdooDevOpsApp />;
      default:
        // Handle custom compiled model loaders (school_registry, estate_management)
        const activeAddon = addons.find((a) => a.id === activeAppId);
        if (activeAddon) {
          const modelMatch = activeAddon.python_code.match(/_name\s*=\s*['"]([^'"]+)['"]/);
          const modelName = modelMatch ? modelMatch[1] : '';
          const activeModel = customModels.find((m) => m.name === modelName);
          const activeRecords = customRecords[modelName] || [];

          return (
            <CustomAppRenderer 
              addon={activeAddon}
              model={activeModel}
              records={activeRecords}
              setCustomRecords={setCustomRecords}
            />
          );
        }

        // Default fallback for new AI agents and unbuilt core modules
        if (activeAppId !== 'apps') {
          return <PlaceholderApp appId={activeAppId} />;
        }

        return (
          <OdooAppsStore 
            addons={addons}
            installedAddons={installedAddons}
            setInstalledAddons={setInstalledAddons}
            setAddons={setAddons}
            setActiveAppId={setActiveAppId}
            setCompileLogs={() => {}}
            compileAddon={compileAddonOnTheFly}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0D10] font-sans" id="odoo-root-framework">
      {/* Sidebar Navigation Swapper */}
      <Sidebar 
        activeAppId={activeAppId}
        setActiveAppId={setActiveAppId}
        developerMode={developerMode}
        setDeveloperMode={setDeveloperMode}
        installedAddons={installedAddons}
      />

      {/* Primary Sub-application Screen canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderSubApp()}
      </div>
    </div>
  );
}
