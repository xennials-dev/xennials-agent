import { CustomOdooModel, CustomField } from './types';

// Utility class name joiner
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

// Odoo currency and date format Helpers
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Custom light-weight regex engine that parses Odoo Python models on the client side.
 * Converts Odoo class schemas into a structure we can dynamically create database tables for!
 */
export function parseOdooPython(code: string): CustomOdooModel | null {
  try {
    // 1. Core Model Name
    const nameMatch = code.match(/_name\s*=\s*['"]([^'"]+)['"]/);
    if (!nameMatch) return null;
    const modelName = nameMatch[1];

    // 2. Class Name
    const classMatch = code.match(/class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'CustomModel';

    // 3. Extracted fields
    const fieldsList: CustomField[] = [];
    const lines = code.split('\n');

    for (const line of lines) {
      // Look for field matches (e.g. name = fields.Char(string='Name', required=True))
      const fieldMatch = line.match(/^\s*(\w+)\s*=\s*fields\.(\w+)\(([\s\S]*?)\)/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const rawFieldType = fieldMatch[2].toLowerCase();
        const fieldArgs = fieldMatch[3];

        // Ensure we omit private model definitions like _name, _description
        if (fieldName.startsWith('_')) continue;

        // Map field types
        let finalType: 'char' | 'integer' | 'boolean' | 'float' = 'char';
        if (rawFieldType === 'integer') finalType = 'integer';
        else if (rawFieldType === 'boolean') finalType = 'boolean';
        else if (rawFieldType === 'float' || rawFieldType === 'monetary') finalType = 'float';

        // Extract "string" parameter value (e.g. string="Name" or string='Name')
        let stringLabel = fieldName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        const labelMatch = fieldArgs.match(/string\s*=\s*['"]([^'"]+)['"]/);
        if (labelMatch) {
          stringLabel = labelMatch[1];
        }

        fieldsList.push({
          name: fieldName,
          type: finalType,
          string: stringLabel,
        });
      }
    }

    // Always ensure an ID is implicit
    return {
      name: modelName,
      className,
      fields: fieldsList,
    };
  } catch (error) {
    console.error('Error parsing simulated Odoo Python code:', error);
    return null;
  }
}

/**
 * Custom regex XML view parser to determine which fields from Python are visible in tree/list views.
 */
export function parseOdooXML(xmlCode: string): string[] {
  try {
    const visibleFields: string[] = [];
    // Match <field name="fieldName"/>
    const regex = /<field\s+name\s*=\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(xmlCode)) !== null) {
      if (!visibleFields.includes(match[1])) {
        visibleFields.push(match[1]);
      }
    }
    return visibleFields;
  } catch (error) {
    console.error('Error parsing simulated Odoo XML view:', error);
    return [];
  }
}
