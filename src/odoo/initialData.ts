import { ResPartner, ProductProduct, CrmLead, SaleOrder, AccountInvoice, StockMove, CustomOdooAddon } from './types';

export const INITIAL_PARTNERS: ResPartner[] = [
  {
    id: 'res_partner_1',
    name: 'Mitchell Admin',
    email: 'admin@yourcompany.example.com',
    phone: '+1 555-0100',
    city: 'San Francisco',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_2',
    name: 'Deco Addict',
    email: 'info@decoaddict.example.com',
    phone: '+1 555-0199',
    city: 'Los Angeles',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_3',
    name: 'Azure Interior',
    email: 'contact@azure.example.com',
    phone: '+32 81 81 37 00',
    city: 'Brussels',
    country: 'Belgium',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_4',
    name: 'Gemini Space Corp',
    email: 'procurement@geminispace.example.com',
    phone: '+1 415-555-0131',
    city: 'Mountain View',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&fit=crop&q=80',
  },
  {
    id: 'res_partner_5',
    name: 'Ready Mat',
    email: 'sales@readymat.example.com',
    phone: '+1 212-555-0144',
    city: 'New York',
    country: 'United States',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop&q=80',
  }
];

export const INITIAL_PRODUCTS: ProductProduct[] = [
  {
    id: 'product_1',
    name: 'Custom Corner Desk',
    list_price: 750.00,
    standard_price: 450.00,
    qty_available: 12,
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=150&fit=crop&q=80',
    description: 'Custom engineered high-density fiberboard office desk.'
  },
  {
    id: 'product_2',
    name: 'Ergonomic Conference Chair',
    list_price: 150.00,
    standard_price: 90.00,
    qty_available: 35,
    image_url: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=150&fit=crop&q=80',
    description: 'Pneumatic height adjustment and durable lumbar support mesh.'
  },
  {
    id: 'product_3',
    name: 'Acoustic Absorption Panel',
    list_price: 45.00,
    standard_price: 20.00,
    qty_available: 120,
    image_url: 'https://images.unsplash.com/photo-1598112972234-5415c3ec2905?w=150&fit=crop&q=80',
    description: 'Noise cancelling textile-wrapped architectural acoustics asset.'
  },
  {
    id: 'product_4',
    name: 'Modular Storage Cabinet',
    list_price: 280.00,
    standard_price: 180.00,
    qty_available: 8,
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=150&fit=crop&q=80',
    description: 'Spacious four-shelf lockable wooden storage unit.'
  }
];

export const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'crm_lead_1',
    name: 'Desk Upgrades for Engineering Team',
    partner_id: 'res_partner_2', // Deco Addict
    expected_revenue: 7500.00,
    probability: 45,
    stage_id: 'qualified',
    email: 'info@decoaddict.example.com',
    phone: '+1 555-0199',
    description: 'They need dynamic sit-to-stand options or heavy-duty desks for their new designers.',
    priority: 2,
    date_deadline: '2026-06-15'
  },
  {
    id: 'crm_lead_2',
    name: 'Boardroom Refurbishment Chair Package',
    partner_id: 'res_partner_1', // Mitchell Admin
    expected_revenue: 5250.00,
    probability: 70,
    stage_id: 'proposition',
    email: 'admin@yourcompany.example.com',
    phone: '+1 555-0100',
    description: ' Mitchell requested standard pricing for 35 executive grade mesh-back custom conference chairs.',
    priority: 3,
    date_deadline: '2026-06-01'
  },
  {
    id: 'crm_lead_3',
    name: 'Xennials Tech — Hermes AI Agent Interactive Showcase (Featured)',
    partner_id: 'res_partner_4', // Gemini Space Corp
    expected_revenue: 125000.00,
    probability: 100,
    stage_id: 'won',
    email: 'contact@xennials.tech',
    phone: '+1 314-348-3944',
    description: 'Featured production deployment on xennials.tech (Netlify Site ID: d0d08609-b91b-4dfa-927d-a103ef6cd305) showcasing Hermes Agent interactive voice, multi-agent war room orchestration, and enterprise CRM automation.',
    priority: 3,
    date_deadline: '2026-08-28'
  },
  {
    id: 'crm_lead_4',
    name: 'Secondary Lobby Cabinet Accessories',
    partner_id: 'res_partner_3', // Azure Interior
    expected_revenue: 1120.00,
    probability: 15,
    stage_id: 'new',
    email: 'contact@azure.example.com',
    phone: '+32 81 81 37 00',
    description: 'Prospecting stage. Inquiry received through custom Odoo contact form.',
    priority: 1,
    date_deadline: '2026-07-20'
  }
];

export const INITIAL_SALES: SaleOrder[] = [
  {
    id: 'sale_order_1',
    name: 'SO001',
    partner_id: 'res_partner_5', // Ready Mat
    date_order: '2026-05-19',
    state: 'draft',
    amount_untaxed: 1500.00,
    amount_tax: 225.00,
    amount_total: 1725.00,
    order_line: [
      {
        id: 'sol_1',
        product_id: 'product_2', // Ergonomic Conference Chair
        product_uom_qty: 10,
        price_unit: 150.00,
        price_subtotal: 1500.00
      }
    ]
  },
  {
    id: 'sale_order_2',
    name: 'SO002',
    partner_id: 'res_partner_2', // Deco Addict
    date_order: '2026-05-20',
    state: 'sale',
    amount_untaxed: 2900.00,
    amount_tax: 435.00,
    amount_total: 3335.00,
    order_line: [
      {
        id: 'sol_2',
        product_id: 'product_1', // Custom Corner Desk
        product_uom_qty: 2,
        price_unit: 750.00,
        price_subtotal: 1500.00
      },
      {
        id: 'sol_3',
        product_id: 'product_4', // Modular Storage Cabinet
        product_uom_qty: 5,
        price_unit: 280.00,
        price_subtotal: 1400.00
      }
    ]
  }
];

export const INITIAL_INVOICES: AccountInvoice[] = [
  {
    id: 'account_invoice_1',
    name: 'INV/2026/0001',
    partner_id: 'res_partner_2', // Deco Addict
    invoice_date: '2026-05-20',
    state: 'posted',
    payment_state: 'paid',
    amount_untaxed: 2900.00,
    amount_tax: 435.00,
    amount_total: 3335.00,
    invoice_line: [
      {
        id: 'ail_1',
        product_id: 'product_1',
        product_uom_qty: 2,
        price_unit: 750.00,
        price_subtotal: 1500.00
      },
      {
        id: 'ail_2',
        product_id: 'product_4',
        product_uom_qty: 5,
        price_unit: 280.00,
        price_subtotal: 1400.00
      }
    ]
  }
];

export const INITIAL_STOCK_MOVES: StockMove[] = [
  {
    id: 'move_1',
    reference: 'WH/IN/0001',
    product_id: 'product_1',
    qty: 12,
    type: 'in',
    date: '2026-05-10',
    state: 'done'
  },
  {
    id: 'move_2',
    reference: 'WH/IN/0002',
    product_id: 'product_2',
    qty: 35,
    type: 'in',
    date: '2026-05-11',
    state: 'done'
  },
  {
    id: 'move_3',
    reference: 'WH/IN/0003',
    product_id: 'product_3',
    qty: 120,
    type: 'in',
    date: '2026-05-12',
    state: 'done'
  },
  {
    id: 'move_4',
    reference: 'WH/IN/0004',
    product_id: 'product_4',
    qty: 8,
    type: 'in',
    date: '2026-05-13',
    state: 'done'
  }
];

export const INITIAL_ADDONS: CustomOdooAddon[] = [
  {
    id: 'addon_school',
    name: 'school_registry',
    shortdesc: 'School Registry',
    description: 'Provides tracking of active students, enrollment details, grades, GPA score indexes, and classroom allocation tables using native python-driven data schemas.',
    author: 'Odoo S.A.',
    icon: 'GraduationCap',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields, api

class SchoolStudent(models.Model):
    _name = "school.student"
    _description = "Student Profile"

    name = fields.Char(string="Student Name", required=True)
    age = fields.Integer(string="Age")
    grade = fields.Float(string="GPA Score")
    enrolled = fields.Boolean(string="Enrolled", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Student Registry">
        <field name="name"/>
        <field name="age"/>
        <field name="grade"/>
        <field name="enrolled"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_estate',
    name: 'estate_management',
    shortdesc: 'Real Estate Management',
    description: 'Track master property sales listings, expected prices versus sold prices, number of bathrooms/bedrooms, and listing availability dates.',
    author: 'Odoo S.A.',
    icon: 'Home',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Real Estate Listing"

    name = fields.Char(string="Title", required=True)
    description = fields.Char(string="Type")
    expected_price = fields.Integer(string="Asking Price ($)")
    bedrooms = fields.Integer(string="Bedrooms Required")
    active = fields.Boolean(string="Fully Active", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Real Estate Directory">
        <field name="name"/>
        <field name="description"/>
        <field name="expected_price"/>
        <field name="bedrooms"/>
        <field name="active"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_clinic',
    name: 'clinic_records',
    shortdesc: 'Medical Clinic Patients',
    description: 'Maintains comprehensive digital records of ambulatory healthcare patients, primary care stats, diagnostic identifiers, and standard medical indices.',
    author: 'DevSuite Medical',
    icon: 'FileCheck',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class ClinicPatient(models.Model):
    _name = "clinic.patient"
    _description = "Patient File"

    name = fields.Char(string="Patient Name", required=True)
    patient_age = fields.Integer(string="Patient Age")
    blood_pressure_sys = fields.Integer(string="Sys Pressure (mmHg)")
    is_vaccinated = fields.Boolean(string="Immunizations Current", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Patient Charts">
        <field name="name"/>
        <field name="patient_age"/>
        <field name="blood_pressure_sys"/>
        <field name="is_vaccinated"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_fitness',
    name: 'fitness_membership',
    shortdesc: 'Gym & Fitness Membership',
    description: 'Manages gym registrations, membership levels or years active, monthly dues structures, and active member entry status.',
    author: 'FitNetwork Inc',
    icon: 'Users',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FitnessMember(models.Model):
    _name = "fitness.member"
    _description = "Gym Member Record"

    name = fields.Char(string="Member Name", required=True)
    membership_years = fields.Integer(string="Years Enrolled")
    monthly_fee = fields.Float(string="Monthly Dues ($)")
    is_active = fields.Boolean(string="Subscription Active", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Fitness Members List">
        <field name="name"/>
        <field name="membership_years"/>
        <field name="monthly_fee"/>
        <field name="is_active"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_fleet',
    name: 'fleet_tracker',
    shortdesc: 'Fleet Vehicle Tracker',
    description: 'Logs corporate fleet transportation variables, average engine fuel ranges, mileage limits, and safety inspection milestones.',
    author: 'LogiCore Systems',
    icon: 'Container',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FleetVehicle(models.Model):
    _name = "fleet.vehicle"
    _description = "Fleet Vehicle Profile"

    name = fields.Char(string="License Plate", required=True)
    fuel_level = fields.Float(string="Fuel remaining (%)")
    mileage = fields.Integer(string="Odometer (miles)")
    certified_safe = fields.Boolean(string="Roadworthy Certified", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Corporate Fleet Log">
        <field name="name"/>
        <field name="fuel_level"/>
        <field name="mileage"/>
        <field name="certified_safe"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_restaurant',
    name: 'restaurant_booking',
    shortdesc: 'Restaurant Table Bookings',
    description: 'Tracks commercial restaurant table capacities, dining party sizes, estimated tip averages, and premium VIP priority preferences.',
    author: 'GourmetSync Labs',
    icon: 'Calendar',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class RestaurantBooking(models.Model):
    _name = "restaurant.booking"
    _description = "Restaurant Reservations"

    name = fields.Char(string="Guest Reservation Name", required=True)
    party_size = fields.Integer(string="Table Seats Required")
    tip_amount = fields.Float(string="Pre-Authorized Tip ($)")
    is_vip = fields.Boolean(string="VIP Elite Tier", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Table Reservations">
        <field name="name"/>
        <field name="party_size"/>
        <field name="tip_amount"/>
        <field name="is_vip"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_legal',
    name: 'legal_cases',
    shortdesc: 'Law Firm Case Ledger',
    description: 'Tracks legal workload structures, hourly billing rates, scheduled litigation trial margins, and settlement completion logs.',
    author: 'LexTech Associates',
    icon: 'Briefcase',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class LegalCase(models.Model):
    _name = "legal.case"
    _description = "Law Practice File"

    name = fields.Char(string="Case Reference Number", required=True)
    hourly_rate = fields.Float(string="Attorney Billing Rate ($/hr)")
    expected_hours = fields.Integer(string="Planned Hours")
    case_settled = fields.Boolean(string="Case Resolved", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Current Lawsuits Directory">
        <field name="name"/>
        <field name="hourly_rate"/>
        <field name="expected_hours"/>
        <field name="case_settled"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_charity',
    name: 'nonprofit_donations',
    shortdesc: 'Charity Donor Registry',
    description: 'Catalogs philanthropic contributions, donor details, total funds transferred, fiscal periods, and statutory tax-exempt eligibility status.',
    author: 'NonprofitSuite Inc.',
    icon: 'DollarSign',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class NonprofitDonation(models.Model):
    _name = "nonprofit.donation"
    _description = "Charitable Contribution"

    name = fields.Char(string="Philanthropist Name", required=True)
    donation_amount = fields.Float(string="Funding Level ($)")
    fiscal_year = fields.Integer(string="Tax Period Year")
    tax_deductible = fields.Boolean(string="501c3 Exempt Status", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Generous Philanthropists Log">
        <field name="name"/>
        <field name="donation_amount"/>
        <field name="fiscal_year"/>
        <field name="tax_deductible"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_farm',
    name: 'farm_crops',
    shortdesc: 'Farm Crop Management',
    description: 'Tracks agriculture metrics, land cultivation sizes, seasonal harvest target metrics, and organic production certifications.',
    author: 'AgriCorp Systems',
    icon: 'Wand2',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FarmCrop(models.Model):
    _name = "farm.crop"
    _description = "Agricultural Crop Log"

    name = fields.Char(string="Agricultural Specimen Type", required=True)
    cultivated_acres = fields.Float(string="Harvest Arable Acres")
    ton_yield_goal = fields.Integer(string="Yield Volume Target (Tons)")
    certified_organic = fields.Boolean(string="Certified Organic Flag", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Farm Harvesters Ledger">
        <field name="name"/>
        <field name="cultivated_acres"/>
        <field name="ton_yield_goal"/>
        <field name="certified_organic"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_construction',
    name: 'construction_sites',
    shortdesc: 'Construction Site Log',
    description: 'Manages construction project crews, on-site personnel headcounts, structural milestone completions, and final municipal code inspection results.',
    author: 'BuildVantage Group',
    icon: 'HardDrive',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class ConstructionSite(models.Model):
    _name = "construction.site"
    _description = "Real estate site plan"

    name = fields.Char(string="Development Plot Address", required=True)
    workforce_headcount = fields.Integer(string="Active Builders Onsite")
    progress_percentage = fields.Float(string="Erected Completion Ratio (%)")
    inspection_passed = fields.Boolean(string="Codes Clearance Signal", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Structural Site Directory">
        <field name="name"/>
        <field name="workforce_headcount"/>
        <field name="progress_percentage"/>
        <field name="inspection_passed"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_photo',
    name: 'photography_booking',
    shortdesc: 'Photography Bookings',
    description: 'Tracks creative media bookings, shoot duration hours, premium package custom pricing structures, and studio location selections.',
    author: 'PixelAperture Studio',
    icon: 'Video',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class PhotographyShoot(models.Model):
    _name = "photography.shoot"
    _description = "Media Shoot File"

    name = fields.Char(string="Client Project Name", required=True)
    shoot_duration_hr = fields.Float(string="Aperture Reserved Hours")
    package_price = fields.Integer(string="Commercial Invoice Dues ($)")
    is_studio = fields.Boolean(string="Studio Setting Involved", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Photography Bookings List">
        <field name="name"/>
        <field name="shoot_duration_hr"/>
        <field name="package_price"/>
        <field name="is_studio"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_hotel',
    name: 'hotel_rooms',
    shortdesc: 'Hotel Room Bookings',
    description: 'Covers hospitality stay reservation units, night rate calculations, maximum guest constraints, and morning gourmet breakfast options.',
    author: 'HospitalityCore LLC',
    icon: 'Home',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class HotelRoom(models.Model):
    _name = "hotel.room"
    _description = "Guest Lodge Room"

    name = fields.Char(string="Lodge Suite Identifier", required=True)
    nightly_rate = fields.Float(string="Room Rent Rate ($/Night)")
    max_guests = fields.Integer(string="Maximum Sleeping Limits")
    has_breakfast = fields.Boolean(string="Gourmet Breakfast Included", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Hospitality Chambers Profile">
        <field name="name"/>
        <field name="nightly_rate"/>
        <field name="max_guests"/>
        <field name="has_breakfast"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_brewery',
    name: 'brewery_kegs',
    shortdesc: 'Brewery & Keg Batches',
    description: 'Coordinates fermentation tank logs, output volume liters, optimum temperature limits, and age maturation checks.',
    author: 'MainBrew Craft Tech',
    icon: 'Container',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class BreweryBatch(models.Model):
    _name = "brewery.batch"
    _description = "Micro Brewery Craft Log"

    name = fields.Char(string="Batch Formulation Label", required=True)
    liters_brewed = fields.Float(string="Bulk Fermented Liters")
    temperature_c = fields.Integer(string="Silo Heat Limit (C)")
    matured = fields.Boolean(string="Taste Standard Cleared", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Brewery Barrel Lots">
        <field name="name"/>
        <field name="liters_brewed"/>
        <field name="temperature_c"/>
        <field name="matured"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_mechanic',
    name: 'auto_repairs',
    shortdesc: 'Auto Repair Workshop',
    description: 'Facilitates mechanic work schedules, expected repair duration targets, spare parts pricing structures, and vehicle check resolved switches.',
    author: 'AeroDrive Auto Works',
    icon: 'Cpu',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class AutoRepair(models.Model):
    _name = "auto.repair"
    _description = "Automotive Mechanic Job"

    name = fields.Char(string="Vehicle VIN Identifier", required=True)
    estimated_hours = fields.Float(string="Bumper Diagnostics Hours")
    quoted_parts_cost = fields.Integer(string="Machined Parts Bill ($)")
    is_resolved = fields.Boolean(string="Test Drive Approved", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Bumper Garage Jobs">
        <field name="name"/>
        <field name="estimated_hours"/>
        <field name="quoted_parts_cost"/>
        <field name="is_resolved"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_vet',
    name: 'vet_records',
    shortdesc: 'Vet Clinic Patients',
    description: 'Maintains animal clinical indexes, pet patient body weights, owner contacts, and emergency alert notices.',
    author: 'BioFauna Clinic Group',
    icon: 'FileCheck',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class VetPatient(models.Model):
    _name = "vet.patient"
    _description = "Veterinary Pet Record"

    name = fields.Char(string="Pet Name", required=True)
    animal_weight_kg = fields.Float(string="Pet Weight (kg)")
    client_age = fields.Integer(string="Pet Age (Years)")
    owner_notified = fields.Boolean(string="Owner SMS Alerted", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Veterinary Pet Charts">
        <field name="name"/>
        <field name="animal_weight_kg"/>
        <field name="client_age"/>
        <field name="owner_notified"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_saas',
    name: 'saas_subscriptions',
    shortdesc: 'SaaS Subscription Tracker',
    description: 'Logs corporate software subscription plans, recurring monthly fees, active user seats, and enterprise tiers.',
    author: 'SaaSControl Technologies',
    icon: 'Mail',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class SaasSubscription(models.Model):
    _name = "saas.subscription"
    _description = "Software License File"

    name = fields.Char(string="SaaS Account Domain", required=True)
    monthly_spend = fields.Float(string="MRR Expense ($/Month)")
    user_licence_count = fields.Integer(string="Allocated Admin Seats")
    is_enterprise = fields.Boolean(string="Premium SLA Tier", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Enterprise Tech Subscriptions">
        <field name="name"/>
        <field name="monthly_spend"/>
        <field name="user_licence_count"/>
        <field name="is_enterprise"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_catering',
    name: 'event_catering',
    shortdesc: 'Event Catering Planner',
    description: 'Assists caterers in monitoring event budgets, total attendee headcounts, food prep specifications, and deposit clearances.',
    author: 'ChefElite Management',
    icon: 'PieChart',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class EventCatering(models.Model):
    _name = "event.catering"
    _description = "Catering Event Contract"

    name = fields.Char(string="Gourmet Menu Reference", required=True)
    budget_limit = fields.Float(string="Budget Limits ($)")
    guest_count = fields.Integer(string="Attendee Count")
    deposit_paid = fields.Boolean(string="Escrow Ledger Paid", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Plated Event Registries">
        <field name="name"/>
        <field name="budget_limit"/>
        <field name="guest_count"/>
        <field name="deposit_paid"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_dropship',
    name: 'dropship_orders',
    shortdesc: 'Dropship Inventory Manager',
    description: 'Assists e-commerce dropshippers in logging manufacturer margin settings, bulk products dispatched, and active stock indicators.',
    author: 'DropRoute Global',
    icon: 'ShoppingCart',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class DropshipOrder(models.Model):
    _name = "dropship.order"
    _description = "Merchant Dropship Log"

    name = fields.Char(string="Manufacturer Part ID", required=True)
    profit_markup_pct = fields.Float(string="Margin Markup (%)")
    units_shipped = fields.Integer(string="Dispatched Items")
    inventory_in_stock = fields.Boolean(string="Supplier Available", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Global Merchant Dropships">
        <field name="name"/>
        <field name="profit_markup_pct"/>
        <field name="units_shipped"/>
        <field name="inventory_in_stock"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_dental',
    name: 'dental_patients',
    shortdesc: 'Dental Clinic Ledger',
    description: 'Reviews clinical dental care costs, patient routine follow-up treatments, and private health insurance pre-authorizations.',
    author: 'DentiCare Systems',
    icon: 'CheckCircle',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class DentalPatient(models.Model):
    _name = "dental.patient"
    _description = "Orthodontic Patient Record"

    name = fields.Char(string="Patient ID Card", required=True)
    treatment_cost = fields.Float(string="Maxillofacial Cost Estimate ($)")
    visits_remaining = fields.Integer(string="Therapy Sessions Pending")
    insurance_covered = fields.Boolean(string="Provider Preapproved", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Dentistry Treatment Charts">
        <field name="name"/>
        <field name="treatment_cost"/>
        <field name="visits_remaining"/>
        <field name="insurance_covered"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_music',
    name: 'studio_sessions',
    shortdesc: 'Music Studio Booking',
    description: 'Maintains hourly music recording schedules, total audio project counts, and audio production mixing/mastering approvals.',
    author: 'WaveFlow Acoustics',
    icon: 'MonitorPlay',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class StudioSession(models.Model):
    _name = "studio.session"
    _description = "Acoustics Studio Reservation"

    name = fields.Char(string="Track Master Title", required=True)
    studio_hourly_fee = fields.Float(string="Mixing Desk Price ($/hr)")
    scheduled_tracks = fields.Integer(string="Multitrack Stems count")
    is_mastered = fields.Boolean(string="Dynamic EQ Finalized", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Acoustic Project Schedules">
        <field name="name"/>
        <field name="studio_hourly_fee"/>
        <field name="scheduled_tracks"/>
        <field name="is_mastered"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_salon',
    name: 'salon_bookings',
    shortdesc: 'Barber & Salon Appointments',
    description: 'Optimizes beauty salon reservations, services invoices, stylist time reservations, and repeat patron loyalty markers.',
    author: 'GlowStylist ERP',
    icon: 'PenTool',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class SalonBooking(models.Model):
    _name = "salon.booking"
    _description = "Styling Salon Reservation"

    name = fields.Char(string="Patron Styling Ticket", required=True)
    service_price = fields.Float(string="Foil & Dye Rate ($)")
    time_allocated_mins = fields.Integer(string="Station Time (Mins)")
    repeat_client = fields.Boolean(string="Loyalty Member Active", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Stylist Chair Bookings">
        <field name="name"/>
        <field name="service_price"/>
        <field name="time_allocated_mins"/>
        <field name="repeat_client"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_solar',
    name: 'solar_grids',
    shortdesc: 'Solar Grid Management',
    description: 'Monitors green tech solar power grids, actual inverter efficiencies, daily active kilowatt-hour production, and live grid feeds.',
    author: 'EcoVoltaics Energy',
    icon: 'Cpu',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class SolarGrid(models.Model):
    _name = "solar.grid"
    _description = "Eco Solar Array Log"

    name = fields.Char(string="Panel Core Serial Number", required=True)
    kwh_generated = fields.Float(string="Total Kilowatts Fed-in")
    inverter_count = fields.Integer(string="Active Power Inverters")
    active_grid_feed = fields.Boolean(string="Microgrid Circuit Closed", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Eco Solar Array Records">
        <field name="name"/>
        <field name="kwh_generated"/>
        <field name="inverter_count"/>
        <field name="active_grid_feed"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_cosmetic',
    name: 'cosmetics_batches',
    shortdesc: 'Cosmetics Quality Log',
    description: 'Tracks cosmetics and batch chemical formulations, relative pH standards, raw component billing estimates, and toxicological inspections.',
    author: 'DermaPure Quality Corp',
    icon: 'Layers',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class CosmeticBatch(models.Model):
    _name = "cosmetic.batch"
    _description = "Chemical Formulation Sheet"

    name = fields.Char(string="Cream Emulsion Batch", required=True)
    ph_level = fields.Float(string="Acidity Balance Index (pH)")
    base_cost = fields.Integer(string="Base Formulation Cost ($)")
    passes_inspection = fields.Boolean(string="FDA Regulation Standard", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Chemical Formulation Sheet">
        <field name="name"/>
        <field name="ph_level"/>
        <field name="base_cost"/>
        <field name="passes_inspection"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_recycling',
    name: 'recycling_weights',
    shortdesc: 'Recycling Yard Scale',
    description: 'Reviews commercial waste reclamation metrics, total materials collected, scrap transport trucks counts, and conversion readiness markers.',
    author: 'EnviroCycle Systems',
    icon: 'Container',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class RecyclingWeight(models.Model):
    _name = "recycling.weight"
    _description = "Eco Recycling Intake"

    name = fields.Char(string="Material Classification", required=True)
    metric_tons_received = fields.Float(string="Weighed Scrap Tons")
    truck_count = fields.Integer(string="Freight Gate Inbounds")
    processed_ready = fields.Boolean(string="Sorted & Cleaned Ready", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Eco Recycling Weight Metrics">
        <field name="name"/>
        <field name="metric_tons_received"/>
        <field name="truck_count"/>
        <field name="processed_ready"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_art',
    name: 'art_gallery',
    shortdesc: 'Art Pieces Registry',
    description: 'Logs fine art items, gallery commission shares, vintage valuations, historic originations, and gallery placements.',
    author: 'LouvreArt GallerySuite',
    icon: 'Globe',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class ArtGalleryPiece(models.Model):
    _name = "art.gallery"
    _description = "Premium Painting Log"

    name = fields.Char(string="Artwork Name", required=True)
    commission_rate = fields.Float(string="Curator Royalty Percentage")
    valuation = fields.Integer(string="Collectible Valuation ($)")
    is_vintage = fields.Boolean(string="Pre-War Historical Origin", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Fine Paintings Ledger">
        <field name="name"/>
        <field name="commission_rate"/>
        <field name="valuation"/>
        <field name="is_vintage"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_theater',
    name: 'theater_auditions',
    shortdesc: 'Theatre Casting Desk',
    description: 'Reviews dramatic acting auditions scores, candidate role slots, performance marks, and ultimate casting validations.',
    author: 'BroadwayCasting Sync',
    icon: 'Share2',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class TheaterAudition(models.Model):
    _name = "theater.audition"
    _description = "Theatrical Audition Entry"

    name = fields.Char(string="Candidate Name", required=True)
    performance_score = fields.Float(string="Critique Grade Fraction")
    audition_slots = fields.Integer(string="Rehearsal Bookings Alloc")
    casting_confirmed = fields.Boolean(string="Contract Signed", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Theatrical Cast Selection">
        <field name="name"/>
        <field name="performance_score"/>
        <field name="audition_slots"/>
        <field name="casting_confirmed"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_golf',
    name: 'golf_times',
    shortdesc: 'Golf Course Tee Times',
    description: 'Coordinates golf club tee reservations, player green charges, course handicap limitations, and mobile cart availability.',
    author: 'ClubLinks Hospitality',
    icon: 'Calendar',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class GolfTime(models.Model):
    _name = "golf.time"
    _description = "Course Tee Booking"

    name = fields.Char(string="Registered Club Member", required=True)
    green_fee = fields.Float(string="Reserved Entry Tariff ($)")
    handicap_limit = fields.Integer(string="Max Course Handicap")
    cart_included = fields.Boolean(string="Battery Cart Reserved", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Course Tee Bookings">
        <field name="name"/>
        <field name="green_fee"/>
        <field name="handicap_limit"/>
        <field name="cart_included"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_pharmacy',
    name: 'pharmacy_prescriptions',
    shortdesc: 'Pharmacy Rx Queue',
    description: 'Evaluates medicine prescription records, customer copay calculations, remaining refill parameters, and clinical physician pre-approvals.',
    author: 'MedDispenser Software',
    icon: 'FileCheck',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class PharmacyRx(models.Model):
    _name = "pharmacy.rx"
    _description = "Clinical Prescription Item"

    name = fields.Char(string="Prescription Serial (Rx)", required=True)
    dispensation_cost = fields.Float(string="Insurance Copay Due ($)")
    refills_allowed = fields.Integer(string="Authorized Refills Left")
    pre_authorized = fields.Boolean(string="Doctor Verified Status", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Clinical Prescriptions Line">
        <field name="name"/>
        <field name="dispensation_cost"/>
        <field name="refills_allowed"/>
        <field name="pre_authorized"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_aviation',
    name: 'flight_logs',
    shortdesc: 'Helicopter Flight Log',
    description: 'Schedules helicopter utility flight duration hours, average aviation fuel percentages, pilot assignments, and safety check sign-offs.',
    author: 'AeroRotors Digital',
    icon: 'Globe',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FlightLog(models.Model):
    _name = "flight.log"
    _description = "Aviation Rotor Mission"

    name = fields.Char(string="Aircraft Tail Registry ID", required=True)
    flight_hours = fields.Float(string="Engaged Logged Hours")
    fuel_level_percent = fields.Integer(string="Aviation Fuel level (%)")
    preflight_approved = fields.Boolean(string="FAA Mechanics Confirmed", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Aviation Rotor Logs">
        <field name="name"/>
        <field name="flight_hours"/>
        <field name="fuel_level_percent"/>
        <field name="preflight_approved"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_publishing',
    name: 'book_contracts',
    shortdesc: 'Book Contracts Manager',
    description: 'Integrates book publishing rosters, royalties commission guidelines, planned page configurations, and print design categories.',
    author: 'Gutenberg PubSuite',
    icon: 'PenTool',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class BookContract(models.Model):
    _name = "book.contract"
    _description = "Literary Publishing Contract"

    name = fields.Char(string="Manuscript Title", required=True)
    royalty_rate_pct = fields.Float(string="Royalty Commission (%)")
    expected_pages = fields.Integer(string="Total Manuscript Pages")
    hardcover_contract = fields.Boolean(string="Smyth Sewn Hardcover", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Novel Publishing Contracts">
        <field name="name"/>
        <field name="royalty_rate_pct"/>
        <field name="expected_pages"/>
        <field name="hardcover_contract"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_laundry',
    name: 'dry_cleaning_intake',
    shortdesc: 'Dry Cleaning Tickets',
    description: 'Coordinates laundering and dry-cleaning ticket intakes, total item calculations, invoicing, and ready-to-collect flags.',
    author: 'HydroWash Commercial',
    icon: 'Layers',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class DryCleaningIntake(models.Model):
    _name = "dry.cleaning.intake"
    _description = "Cleaning Service Entry"

    name = fields.Char(string="Customer Ticket Code", required=True)
    dry_cleaning_cost = fields.Float(string="Chemical Clean Dues ($)")
    item_total = fields.Integer(string="Item Total Count")
    collection_ready = fields.Boolean(string="Pressed and Shelved", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Commercial Dry Cleaning">
        <field name="name"/>
        <field name="dry_cleaning_cost"/>
        <field name="item_total"/>
        <field name="collection_ready"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_freelancer',
    name: 'freelancer_contracts',
    shortdesc: 'Freelance Contracts Desk',
    description: 'Tracks external specialist wages structures, assignment scope weeks, scheduling markers, and contract NDA protections.',
    author: 'GlowFreelance ERP',
    icon: 'Users',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FreelancerContract(models.Model):
    _name = "freelancer.contract"
    _description = "Technical Specialist Entry"

    name = fields.Char(string="External Engineer Name", required=True)
    hourly_wage = fields.Float(string="Staffing Base Wage ($/hr)")
    planned_weeks = fields.Integer(string="Planned Sprints Alloc")
    signed_nda = fields.Boolean(string="NDA Documentation Filed", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Tech Freelancers Contracts">
        <field name="name"/>
        <field name="hourly_wage"/>
        <field name="planned_weeks"/>
        <field name="signed_nda"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_shelter',
    name: 'animal_shelter',
    shortdesc: 'Shelter Animals Log',
    description: 'Monitors pet shelter stays, weight measurements, vaccine details, medical histories, and adoption eligibility states.',
    author: 'RescueCore Humane',
    icon: 'Home',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class AnimalShelter(models.Model):
    _name = "animal.shelter"
    _description = "Humane Animal Registry"

    name = fields.Char(string="Admit Common Identifier", required=True)
    weight_lbs = fields.Float(string="Animal Live Weight (lbs)")
    days_in_care = fields.Integer(string="Kennel Occupancy Days")
    vaccinated = fields.Boolean(string="Adoption Vaccine Ready", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Admit Shelter Animals">
        <field name="name"/>
        <field name="weight_lbs"/>
        <field name="days_in_care"/>
        <field name="vaccinated"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_foodtruck',
    name: 'foodtruck_items',
    shortdesc: 'Food Truck Inventory',
    description: 'Manages ingredients, estimated portion cost limits, total stocked items counts, and organic vegan alternatives identifiers.',
    author: 'StreetGrill ERP',
    icon: 'ShoppingCart',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FoodTruckItem(models.Model):
    _name = "foodtruck.item"
    _description = "Mobile Kitchen Ingredient"

    name = fields.Char(string="Bulk Inbound Ingredient", required=True)
    cost_per_serving = fields.Float(string="Portion Cost Limit ($)")
    servings_stocked = fields.Integer(string="Est. Servings Available")
    has_vegan_option = fields.Boolean(string="Plant Based Recipe", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Mobile Food Truck Items">
        <field name="name"/>
        <field name="cost_per_serving"/>
        <field name="servings_stocked"/>
        <field name="has_vegan_option"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_vineyard',
    name: 'vineyard_batches',
    shortdesc: 'Vineyard Wine Batches',
    description: 'Coordinates winemaking data, soil acidity, sugar level tests, bottle yields forecasts, and custom organic certifications.',
    author: 'Viticulture Systems',
    icon: 'Wand2',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class VineyardBatch(models.Model):
    _name = "vineyard.batch"
    _description = "Viticulture Yield Batch"

    name = fields.Char(string="Grape Extract Varietal", required=True)
    sugar_level_brix = fields.Float(string="Sugar Level (Brix Scale)")
    expected_bottles = fields.Integer(string="Est. Bottle Output Lots")
    sulfite_free = fields.Boolean(string="Sulfite Free Guarantee", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Wine Harvest Batches">
        <field name="name"/>
        <field name="sugar_level_brix"/>
        <field name="expected_bottles"/>
        <field name="sulfite_free"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_travel',
    name: 'travel_tours',
    shortdesc: 'Travel Tour Registry',
    description: 'Manages tour holiday reservation pricing tiers, group headcounts, client subscriber records, and guided courier options.',
    author: 'WanderRoute Travel',
    icon: 'Globe',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class TravelTour(models.Model):
    _name = "travel.tour"
    _description = "Holiday Pack Schedule"

    name = fields.Char(string="Destination Site Name", required=True)
    base_ticket_pricing = fields.Float(string="Core Ticket Price ($)")
    max_subscribers = fields.Integer(string="Max Passenger Room")
    guided_assistance = fields.Boolean(string="Personal Courier Included", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="International Tour Pack">
        <field name="name"/>
        <field name="base_ticket_pricing"/>
        <field name="max_subscribers"/>
        <field name="guided_assistance"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_coworking',
    name: 'coworking_desks',
    shortdesc: 'Coworking Desk Planner',
    description: 'Schedules coworking desk occupancy rosters, monthly rates billing, office level directories, and workspace broadband connectivity status.',
    author: 'OfficesSync Group',
    icon: 'Layers',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class CoworkingDesk(models.Model):
    _name = "coworking.desk"
    _description = "Commercial Workspace Allocation"

    name = fields.Char(string="Assigned Office Tenant", required=True)
    desk_monthly_rent = fields.Float(string="Allocated Monthly Rent ($)")
    floor_number = fields.Integer(string="Building Floor Level")
    ethernet_connected = fields.Boolean(string="Gigabit LAN Hookuped", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Workspace Office Desks">
        <field name="name"/>
        <field name="desk_monthly_rent"/>
        <field name="floor_number"/>
        <field name="ethernet_connected"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_security',
    name: 'sec_pentests',
    shortdesc: 'Cybersecurity Audits Log',
    description: 'Reviews cybersecurity intrusion exercises, vulnerability exploit rates, threat payload tallies, and regulatory compliance checks.',
    author: 'ShieldWall CybSec',
    icon: 'Cpu',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class SecPentest(models.Model):
    _name = "sec.pentest"
    _description = "Cybersecurity Attack Log"

    name = fields.Char(string="Client Network Anchor", required=True)
    exploit_probability = fields.Float(string="Attack Vector Severity")
    vuln_payload_count = fields.Integer(string="Critical Exploits Found")
    compliance_clean = fields.Boolean(string="ISO Clean Compliance", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Network Security Audits">
        <field name="name"/>
        <field name="exploit_probability"/>
        <field name="vuln_payload_count"/>
        <field name="compliance_clean"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_dealership',
    name: 'car_showroom',
    shortdesc: 'Car Showroom Registry',
    description: 'Maintains vehicle reseller details, wholesale engine configurations, inventory sale prices, and manufacturer warranties.',
    author: 'ApexAuto Retail ERP',
    icon: 'DollarSign',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class CarShowroom(models.Model):
    _name = "car.showroom"
    _description = "Automobile Sales Ledger"

    name = fields.Char(string="Automobile Model Engine", required=True)
    sales_commission = fields.Float(string="Reseller Margin ($)")
    cylinder_count = fields.Integer(string="Engine Cylinder Block")
    factory_warranty = fields.Boolean(string="Active OEM Warranty", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Vehicle Reseller Directory">
        <field name="name"/>
        <field name="sales_commission"/>
        <field name="cylinder_count"/>
        <field name="factory_warranty"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_bakery',
    name: 'bakery_orders',
    shortdesc: 'Bakery Prep Ledger',
    description: 'Tracks confectionery baking dough metrics, yeast fermentation hours, oven temperatures, and bake times.',
    author: 'Sourdough Artisanal',
    icon: 'ShoppingCart',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class BakeryOrder(models.Model):
    _name = "bakery.order"
    _description = "Fresh Dough Batch Log"

    name = fields.Char(string="Recipe Formula Label", required=True)
    dough_weight_kg = fields.Float(string="Raw Batch Weight (kg)")
    bake_time_minutes = fields.Integer(string="Convection Bake Minutes")
    yeast_fermentation = fields.Boolean(string="Long Proving Fermented", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Confectionery Bake Log">
        <field name="name"/>
        <field name="dough_weight_kg"/>
        <field name="bake_time_minutes"/>
        <field name="yeast_fermentation"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_laundromat',
    name: 'laundromat_washers',
    shortdesc: 'Laundromat Machine Log',
    description: 'Logs laundries utilities, hourly machine kilowatt-hour consumption, washer drum weight limits, and active equipment status.',
    author: 'SpinnClean Systems',
    icon: 'HardDrive',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class LaundromatWasher(models.Model):
    _name = "laundromat.washer"
    _description = "Laundromat Electric Washer"

    name = fields.Char(string="Washer Device Code", required=True)
    kwh_usage_rating = fields.Float(string="Static Load KW Expense")
    max_load_lb = fields.Integer(string="Max Capacity (lbs)")
    out_of_service = fields.Boolean(string="Maintenance Flag active", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Laundromat Appliance Fleet">
        <field name="name"/>
        <field name="kwh_usage_rating"/>
        <field name="max_load_lb"/>
        <field name="out_of_service"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_janitorial',
    name: 'janitorial_tasks',
    shortdesc: 'Janitorial Daily Log',
    description: 'Logs corporate facilities maintenance layouts, sanitation surface radius, cleaning items checklist, and chemical authorizations.',
    author: 'PristineSweep Group',
    icon: 'CheckCircle',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class JanitorialTask(models.Model):
    _name = "janitorial.task"
    _description = "Commercial Sanitation Schedule"

    name = fields.Char(string="Workplace Clean Zone", required=True)
    clean_radius_sqm = fields.Float(string="Sanitized Area (sqm)")
    required_supplies_count = fields.Integer(string="Fluid Detergent Lots")
    chem_hazard_certified = fields.Boolean(string="HazMat Solutions Allowed", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Facilities Sanitation Log">
        <field name="name"/>
        <field name="clean_radius_sqm"/>
        <field name="required_supplies_count"/>
        <field name="chem_hazard_certified"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_cargo',
    name: 'cargo_pallets',
    shortdesc: 'Cargo Warehouse Pallets',
    description: 'Tracks industrial freight storage layouts, shipping weight totals, logistical dock assignments, and hazardous materials categories.',
    author: 'DockLogix Cargo',
    icon: 'Container',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class CargoPallet(models.Model):
    _name = "cargo.pallet"
    _description = "Heavy Warehousing Unit"

    name = fields.Char(string="Shipping Pallet ID", required=True)
    cargo_weight_ton = fields.Float(string="Gross Freight Weight (Tons)")
    designated_bay_code = fields.Integer(string="Storage Dock Loading Zone")
    hazardous_category = fields.Boolean(string="DGM Safety Compliant", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Cargo Pallet Log">
        <field name="name"/>
        <field name="cargo_weight_ton"/>
        <field name="designated_bay_code"/>
        <field name="hazardous_category"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_marine',
    name: 'marine_vessels',
    shortdesc: 'Marine Freight Log',
    description: 'Monitors ocean freight logistics, optimal speeds, crew complement files, and international dock approvals.',
    author: 'TeideMaritime Carriers',
    icon: 'Globe',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class MarineVessel(models.Model):
    _name = "marine.vessel"
    _description = "Sea Freight Freighter Profile"

    name = fields.Char(string="Vessel Registered Name", required=True)
    knot_speed = fields.Float(string="Average Cruising Knots")
    crew_capacity = fields.Integer(string="Full Crew Count")
    customs_docked = fields.Boolean(string="Customs Bond Cleared", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Ocean Freight Fleet">
        <field name="name"/>
        <field name="knot_speed"/>
        <field name="crew_capacity"/>
        <field name="customs_docked"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_mining',
    name: 'mining_batches',
    shortdesc: 'Mining Extraction Log',
    description: 'Indexes minerals dig volumes, density grades, geological location coordinates, and ventilation health updates.',
    author: 'ContinentalMining Group',
    icon: 'Layers',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class MiningBatch(models.Model):
    _name = "mining.batch"
    _description = "Subterranean Shaft Drill"

    name = fields.Char(string="Drill Site Location Code", required=True)
    density_g_cm3 = fields.Float(string="Mineral Density Grade (g/cm3)")
    dig_site_depth_m = fields.Integer(string="Shaft Depth Rating (Meters)")
    ventilation_fans_working = fields.Boolean(string="Safety Fans Active", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Deep Ground Mineral Lots">
        <field name="name"/>
        <field name="density_g_cm3"/>
        <field name="dig_site_depth_m"/>
        <field name="ventilation_fans_working"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_fish',
    name: 'fish_stocks',
    shortdesc: 'Fish Hatchery Stocks',
    description: 'Manages aquacultural marine environments, pH balance logs, estimated fish spawn counts, and oxygen pump operational metrics.',
    author: 'AquaHatch Hatcheries',
    icon: 'DownloadCloud',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class FishStock(models.Model):
    _name = "fish.stock"
    _description = "Hatchery Aquaculture Basin"

    name = fields.Char(string="Hatchery Basin Code", required=True)
    ph_balance = fields.Float(string="Water Acid Index (pH)")
    estimated_fish_count = fields.Integer(string="Basin Stock Population")
    oxygen_pump_running = fields.Boolean(string="Aeration Compressor signal", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Hatchery Basin Records">
        <field name="name"/>
        <field name="ph_balance"/>
        <field name="estimated_fish_count"/>
        <field name="oxygen_pump_running"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_esports',
    name: 'esports_players',
    shortdesc: 'Esports Tournament Teams',
    description: 'Monitors competitive e-sports team registers, average win-loss ratios, player rosters size indexes, and dynamic sponsorship backings.',
    author: 'GamerApex Leagues',
    icon: 'MonitorPlay',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class EsportsPlayer(models.Model):
    _name = "esports.player"
    _description = "Digital Gaming Team Profile"

    name = fields.Char(string="Team Esports Clan Handle", required=True)
    win_loss_ratio = fields.Float(string="Static Match Win-Loss Ratio")
    active_squad_size = fields.Integer(string="Roster Headcount Seats")
    sponsor_backed = fields.Boolean(string="Corporate Sponsor Sealed", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Gamer Esports Teams">
        <field name="name"/>
        <field name="win_loss_ratio"/>
        <field name="active_squad_size"/>
        <field name="sponsor_backed"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_solarlayout',
    name: 'solar_leads',
    shortdesc: 'Solar Installation Queue',
    description: 'Registers renewable home energy plans, estimated cost limits calculations, panel hardware totals, and utility credit filings.',
    author: 'GreenGrid SolarWorks',
    icon: 'PieChart',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class SolarLead(models.Model):
    _name = "solar.lead"
    _description = "Grid Installation File"

    name = fields.Char(string="Solar Client Address", required=True)
    estimated_annual_saving = fields.Float(string="Shedded Energy Expenses ($)")
    panel_quantity = fields.Integer(string="Photovoltaic Panel count")
    utility_credit_approved = fields.Boolean(string="Grid Feed Utility Cleared", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Solar Client Installations">
        <field name="name"/>
        <field name="estimated_annual_saving"/>
        <field name="panel_quantity"/>
        <field name="utility_credit_approved"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_roastery',
    name: 'roastery_roasts',
    shortdesc: 'Coffee Roast Ledger',
    description: 'Tracks coffee roastery batches, roast temperatures, raw bean loads calculations, and bag moisture sealing checks.',
    author: 'EspressoCraft Roasters',
    icon: 'Wand2',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class RoasteryRoast(models.Model):
    _name = "roastery.roast"
    _description = "Commercial Coffee Baker"

    name = fields.Char(string="Roast Blend Formulation", required=True)
    heat_temperature_c = fields.Float(string="Optimum Drum Temperature (C)")
    green_beans_kg = fields.Integer(string="Raw Green Load Input (kg)")
    moisture_sealed = fields.Boolean(string="Foil Valve Bag Sealed", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Industrial Beans Roast">
        <field name="name"/>
        <field name="heat_temperature_c"/>
        <field name="green_beans_kg"/>
        <field name="moisture_sealed"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_jewelry',
    name: 'jewelry_diamonds',
    shortdesc: 'Jewelry & Diamond Ledger',
    description: 'Registers carat fractions, diamond grading criteria, wholesale valuations lists, and GIA authenticity certifications.',
    author: 'GildedCarat Gems ERP',
    icon: 'DollarSign',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class JewelryDiamond(models.Model):
    _name = "jewelry.diamond"
    _description = "Premium Gemstone Profile"

    name = fields.Char(string="Jewelry Style Identifier", required=True)
    carat_fraction = fields.Float(string="Diamond Carat Rating")
    cut_clarity_grade = fields.Integer(string="Symmetric Finish Index")
    gia_certified = fields.Boolean(string="GIA Lab Certified Document", default=True)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Gemstone Jewelry Ledger">
        <field name="name"/>
        <field name="carat_fraction"/>
        <field name="cut_clarity_grade"/>
        <field name="gia_certified"/>
    </tree>
</odoo>`
  },
  {
    id: 'addon_corplaw',
    name: 'corporate_bills',
    shortdesc: 'Corporate Law Billing',
    description: 'Combines legal retainer valuations records, litigation rounds indexes, scheduling files, and statutory appeal windows active.',
    author: 'MergerShield Legals',
    icon: 'FileCheck',
    state: 'uninstalled',
    python_code: `# -*- coding: utf-8 -*-
from odoo import models, fields

class CorporateBill(models.Model):
    _name = "corporate.bill"
    _description = "Client Corporation Ledger"

    name = fields.Char(string="Corporate Client Identifier", required=True)
    retained_value_m = fields.Float(string="Client Valuation Assets ($M)")
    arbitration_rounds = fields.Integer(string="Hearings & Negotiations")
    appeal_window_active = fields.Boolean(string="Statutory Filing Period", default=False)
`,
    xml_view_code: `<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <tree string="Corporate Litigations Desk">
        <field name="name"/>
        <field name="retained_value_m"/>
        <field name="arbitration_rounds"/>
        <field name="appeal_window_active"/>
    </tree>
</odoo>`
  }
];
