export interface ResPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  image_url: string;
}

export interface ProductProduct {
  id: string;
  name: string;
  list_price: number;
  standard_price: number;
  qty_available: number;
  image_url: string;
  description: string;
}

export interface CrmLead {
  id: string;
  name: string;
  partner_id: string; // ResPartner ID
  expected_revenue: number;
  probability: number;
  stage_id: 'new' | 'qualified' | 'proposition' | 'won';
  email: string;
  phone: string;
  description: string;
  priority: 1 | 2 | 3;
  date_deadline: string;
}

export interface SaleOrderLine {
  id: string;
  product_id: string;
  product_uom_qty: number;
  price_unit: number;
  price_subtotal: number;
}

export interface SaleOrder {
  id: string;
  name: string; // e.g., SO001
  partner_id: string;
  date_order: string;
  state: 'draft' | 'sent' | 'sale' | 'cancel';
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  order_line: SaleOrderLine[];
}

export interface AccountInvoiceLine {
  id: string;
  product_id: string;
  product_uom_qty: number;
  price_unit: number;
  price_subtotal: number;
}

export interface AccountInvoice {
  id: string;
  name: string; // e.g., INV/2026/0001
  partner_id: string;
  invoice_date: string;
  state: 'draft' | 'posted' | 'cancel';
  payment_state: 'not_paid' | 'paid';
  amount_untaxed: number;
  amount_tax: number;
  amount_total: number;
  invoice_line: AccountInvoiceLine[];
}

export interface StockMove {
  id: string;
  reference: string;
  product_id: string;
  qty: number;
  type: 'in' | 'out' | 'adjust';
  date: string;
  state: 'done';
}

export interface CustomField {
  name: string;
  type: 'char' | 'integer' | 'boolean' | 'float';
  string: string;
}

export interface CustomOdooModel {
  name: string; // e.g., 'school.student'
  className: string; // e.g., 'SchoolStudent'
  fields: CustomField[];
}

export interface DynamicRecord {
  id: string;
  [key: string]: any;
}

export interface CustomOdooAddon {
  id: string;
  name: string; // Technical name e.g. "school_registry"
  shortdesc: string; // UI name e.g. "School Registry"
  description: string;
  author: string;
  icon: string;
  state: 'uninstalled' | 'installed';
  python_code: string;
  xml_view_code: string;
}

export interface OdooState {
  partners: ResPartner[];
  products: ProductProduct[];
  leads: CrmLead[];
  sales: SaleOrder[];
  invoices: AccountInvoice[];
  stockMoves: StockMove[];
  addons: CustomOdooAddon[];
  customModels: CustomOdooModel[];
  customRecords: Record<string, DynamicRecord[]>; // Key is model name
  activeAppId: string; // 'crm' | 'sales' | 'invoices' | 'inventory' | 'studio' | 'apps' | 'database'
  developerMode: boolean;
}
