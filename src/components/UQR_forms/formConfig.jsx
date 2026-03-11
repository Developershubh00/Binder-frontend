const PROCUREMENT_DATE_FIELD = {
  name: 'procurementDate',
  label: 'PROCUREMENT DATE',
  type: 'date'
};

const MATERIAL_FORM_PREFIXES = ['trims', 'foam', 'fiber'];

const shouldIncludeProcurementDate = (formKey) =>
  MATERIAL_FORM_PREFIXES.some((prefix) => formKey.startsWith(prefix)) ||
  formKey === 'yarn' ||
  formKey === 'fabric';

const insertProcurementDateField = (formConfig) => {
  const basicInfoSection = formConfig.sections?.find(
    (section) => section.title === 'Basic Information'
  );

  if (!basicInfoSection?.fields) {
    return;
  }

  const hasProcurementDate = basicInfoSection.fields.some(
    (field) => field.name === PROCUREMENT_DATE_FIELD.name
  );

  if (hasProcurementDate) {
    return;
  }

  const dateFieldIndex = basicInfoSection.fields.findIndex(
    (field) => field.name === 'date'
  );

  const insertIndex = dateFieldIndex >= 0 ? dateFieldIndex + 1 : 0;
  basicInfoSection.fields.splice(insertIndex, 0, { ...PROCUREMENT_DATE_FIELD });
};

export const formsConfig = {

    // ═══════════════════════════════════════════════════════════
    // 1. ARTWORKS FLAMMABILITY (Already Done)
    // ═══════════════════════════════════════════════════════════
    artworksFlammability: {
      title: 'ARTWORKS FLAMMABILITY & SAFETY LABELS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN (UNIT SEQUENCE #)', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 2. ARTWORKS HANGTAG SEALS
    // ═══════════════════════════════════════════════════════════
    artworksHangtagSeals: {
      title: 'ARTWORKS HANGTAG SEALS & STRINGS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 3. ARTWORKS INSERT CARDS
    // ═══════════════════════════════════════════════════════════
    artworksInsertCards: {
      title: 'ARTWORKS INSERT CARDS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'shape', label: 'Shape', type: 'text' }, // Specific to Insert Cards
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 4. ARTWORKS LAW LABEL
    // ═══════════════════════════════════════════════════════════
    artworksLawLabel: {
      title: 'ARTWORKS LAW LABELS & CONTENT TAG',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 5. ARTWORKS RFID
    // ═══════════════════════════════════════════════════════════
    artworksRfid: {
      title: 'ARTWORKS RFID & SECURITY TAGS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'formFactor', label: 'Form Factor', type: 'text' }, // Specific to RFID
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'chipModel', label: 'Chip Model', type: 'text' }, // Specific to RFID
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 6. ARTWORKS TAGS & SPECIAL LABELS
    // ═══════════════════════════════════════════════════════════
    artworksTagsSpecial: {
      title: 'ARTWORKS TAGS & SPECIAL LABELS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' },
          { name: 'finishing', label: 'Finishing', type: 'text' } // Specific to Tags
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 7. ARTWORKS ANTI COUNTERFEIT
    // ═══════════════════════════════════════════════════════════
    artworksAntiCounterfeit: {
      title: 'ARTWORKS ANTI COUNTERFEIT & HOLOGRAMS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'security', label: 'Security', type: 'text' },
          { name: 'hologramType', label: 'Hologram Type', type: 'text' },
          { name: 'numbering', label: 'Numbering', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 8. ARTWORKS BELLY BAND WRAPPER
    // ═══════════════════════════════════════════════════════════
    artworksBellyBand: {
      title: 'ARTWORKS BELLY BAND & WRAPPER',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'durability', label: 'Durability', type: 'text' },
          { name: 'closure', label: 'Closure', type: 'text' },
          { name: 'gummingQuality', label: 'Gumming Quality', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 9. ARTWORKS CARE COMPOSITION
    // ═══════════════════════════════════════════════════════════
    artworksCareComposition: {
      title: 'ARTWORKS CARE-COMPOSITION',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 10. ARTWORKS HEAT TRANSFER
    // ═══════════════════════════════════════════════════════════
    artworksHeatTransfer: {
      title: 'ARTWORKS HEAT TRANSFER LABELS',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'base', label: 'Base', type: 'text' }, // Specific to Heat Transfer
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },
  
    // ═══════════════════════════════════════════════════════════
    // 11. ARTWORKS LABEL MAIN (Brand-Main)
    // ═══════════════════════════════════════════════════════════
    artworksLabelMain: {
      title: 'ARTWORKS LABELS (BRAND-MAIN)',
      sections: [
        {
          title: 'Basic Information',
          fields: [
            { name: 'date', label: 'DATE', type: 'date', required: true },
            { name: 'time', label: 'TIME', type: 'time' },
            { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
            { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
          ]
        },
        {
          title: 'Approval Details',
          fields: [
            { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
            { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
            { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
          ]
        },
        {
          title: 'Unit Identification',
          fields: [
            { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
            { name: 'poNo', label: 'PO NO', type: 'text' },
            { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
          ]
        },
        {
          title: 'Artwork & Result',
          fields: [
            { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
            { name: 'result', label: 'RESULT', type: 'text' },
            { name: 'remarks', label: 'REMARKS', type: 'text' }
          ]
        }
      ],
      tableConfig: {
        title: 'USN (UNIT SEQUENCE #)',
        columns: [
          { name: 'usn', label: 'USN', type: 'text' },
          { name: 'type', label: 'Type', type: 'text' },
          { name: 'material', label: 'Material', type: 'text' },
          { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
    },

      // ═══════════════════════════════════════════════════════════
  // 12. ARTWORKS PRICE TAG
  // ═══════════════════════════════════════════════════════════
  artworksPriceTag: {
    title: 'ARTWORKS PRICE TICKER & BARCODE TAG',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Artwork & Result',
        fields: [
          { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 13. ARTWORKS QC & INSPECTION LABELS
  // ═══════════════════════════════════════════════════════════
  artworksQcLabels: {
    title: 'ARTWORKS QC LABELS & INSPECTION LABELS',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Artwork & Result',
        fields: [
          { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'contentCodingSystem', label: 'Content Coding System', type: 'text' },
        { name: 'gummingQuality', label: 'Gumming Quality', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 14. ARTWORKS SIZE LABELS
  // ═══════════════════════════════════════════════════════════
  artworksSizeLabels: {
    title: 'ARTWORKS SIZE LABELS',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Artwork & Result',
        fields: [
          { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSystem', label: 'Size System', type: 'text' },
        { name: 'sizeCode', label: 'Size/Code', type: 'text' },
        { name: 'foldType', label: 'Fold Type', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' }
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 15. ARTWORKS UPC LABEL & BARCODE
  // ═══════════════════════════════════════════════════════════
  artworksUpcLabel: {
    title: 'ARTWORKS UPC LABELS & BARCODE STICKER',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Artwork & Result',
        fields: [
          { name: 'artworkApproval', label: 'ARTWORK APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'base', label: 'Base', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'adhesive', label: 'Adhesive', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' }
      ]
    }
  },


  

    // ═══════════════════════════════════════════════════════════
  // CATEGORY: TRIMS & ACCESSORY
  // ═══════════════════════════════════════════════════════════

  // 1. TRIMS BUCKLES
  trimsBuckles: {
    title: 'TRIMS BUCKLES',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'finish', label: 'Finish', type: 'text' }
      ]
    }
  },

  // 2. TRIMS BUTTONS
  trimsButtons: {
    title: 'TRIMS BUTTONS',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'holes', label: 'Holes', type: 'text' },
        { name: 'finish', label: 'Finish', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'logo', label: 'Logo(if any)', type: 'text' },
        { name: 'comments', label: 'COMMENTS', type: 'text' }
      ]
    }
  },

  // 3. TRIMS CABLE TIES
  trimsCableTies: {
    title: 'TRIMS CABLE~TIES',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'finish', label: 'Finish', type: 'text' }
      ]
    }
  },

  // 4. TRIMS CORD-STOPS
  trimsCordStops: {
    title: 'TRIMS CORD-STOPS',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' }
      ]
    }
  },

  // 5. TRIMS FELT
  trimsFelt: {
    title: 'TRIMS FELT',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'thickness', label: 'Thickness', type: 'text' },
        { name: 'stiffness', label: 'Stiffness', type: 'text' }
      ]
    }
  },

  // 6. TRIMS FR TRIMS
  trimsFrTrims: {
    title: 'TRIMS FR TRIMS',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'compliance', label: 'Compliance', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'durability', label: 'Durability', type: 'text' },
        { name: 'frComponents', label: 'FR Components', type: 'text' }
      ]
    }
  },

  // 7. TRIMS HOOKS EYES
  trimsHooksEyes: {
    title: 'TRIMS HOOKS~EYES',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'finish', label: 'Finish', type: 'text' },
        { name: 'finishType', label: 'Finish Type', type: 'text' }
      ]
    }
  },

  // 8. TRIMS INTERLINING (FUSING)
  trimsInterlining: {
    title: 'TRIMS INTERLINING (FUSING)',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'adhesiveType', label: 'Adhesive Type', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'dotDensity', label: 'Dot Density', type: 'text' },
        { name: 'stretch', label: 'Stretch', type: 'text' },
        { name: 'interliningSpec', label: 'Interlining(Fusing) Spec', type: 'text' },
        { name: 'handFeel', label: 'Hand Feel', type: 'text' }
      ]
    }
  },

  // 9. TRIMS LACE
  trimsLace: {
    title: 'TRIMS LACE',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'width', label: 'Width', type: 'text' },
        { name: 'colour', label: 'Colour', type: 'text' },
        { name: 'designReference', label: 'Design Reference', type: 'text' },
        { name: 'finishing', label: 'Finishing', type: 'text' },
        { name: 'stretch', label: 'Stretch', type: 'text' }
      ]
    }
  },

  // 10. TRIMS MAGNETIC CLOSURE
  trimsMagneticClosure: {
    title: 'TRIMS MAGNETIC CLOSURE',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'material', label: 'Material', type: 'text' },
        { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
        { name: 'polarity', label: 'Polarity', type: 'text' },
        { name: 'encasing', label: 'Encasing', type: 'text' },
        { name: 'shielding', label: 'Shielding', type: 'text' }
      ]
    }
  },


    // 11. TRIMS NIWAR WEBBING
    trimsNiwarWebbing: {
        title: 'TRIMS NIWAR~WEBBING',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'colourTabs', label: 'Colour - Tabs', type: 'text' },
            { name: 'weavePattern', label: 'Weave Pattern', type: 'text' },
            { name: 'thickness', label: 'Thickness', type: 'text' },
            { name: 'finish', label: 'Finish', type: 'text' },
            { name: 'edgeType', label: 'Edge Type', type: 'text' }
          ]
        }
      },
    
      // 12. TRIMS PIN BARBS
      trimsPinBarbs: {
        title: 'TRIMS PIN~BARBS',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'colour', label: 'Colour', type: 'text' },
            { name: 'headType', label: 'Head Type', type: 'text' },
            { name: 'magazineCartridge', label: 'Magazine/Cartridge', type: 'text' }
          ]
        }
      },
    
      // 13. TRIMS REFLECTIVE TAPES
      trimsReflectiveTapes: {
        title: 'TRIMS REFLECTIVE TAPES',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'colour', label: 'Colour', type: 'text' },
            { name: 'baseFabric', label: 'Base Fabric', type: 'text' },
            { name: 'reflectivity', label: 'Reflectivity', type: 'text' },
            { name: 'washDurability', label: 'Wash Durability', type: 'text' }
          ]
        }
      },
    
      // 14. TRIMS RIBBING
      trimsRibbing: {
        title: 'TRIMS RIBBING',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'colour', label: 'Colour', type: 'text' },
            { name: 'stretch', label: 'Stretch %', type: 'text' },
            { name: 'antiCurl', label: 'Anti-Curl', type: 'text' }
          ]
        }
      },
    
      // 15. TRIMS RINGS LOOPS
      trimsRingsLoops: {
        title: 'TRIMS RING-LOOPS',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'thicknessGauge', label: 'Thickness/Gauge', type: 'text' },
            { name: 'finishPlating', label: 'Finish/Plating', type: 'text' },
            { name: 'welded', label: 'Welded', type: 'text' }
          ]
        }
      },
    
      // 16. TRIMS RIVETS
      trimsRivets: {
        title: 'TRIMS RIVETS',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'capSize', label: 'Cap Size', type: 'text' },
            { name: 'postHeight', label: 'Post Height', type: 'text' },
            { name: 'finishPlating', label: 'Finish/Plating', type: 'text' },
            { name: 'logo', label: 'Logo(if any)', type: 'text' }
          ]
        }
      },
    
      // 17. TRIMS SEAM TAPE
      trimsSeamTape: {
        title: 'TRIMS SEAM-TAPE',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'width', label: 'Width', type: 'text' },
            { name: 'colour', label: 'Colour', type: 'text' },
            { name: 'adhesiveType', label: 'Adhesive Type', type: 'text' },
            { name: 'elasticity', label: 'Elasticity', type: 'text' },
            { name: 'breathability', label: 'Breathability', type: 'text' }
          ]
        }
      },
    
      // 18. TRIMS SHOULDER PADS
      trimsShoulderPads: {
        title: 'TRIMS SHOULDER-PADS',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'thickness', label: 'Thickness', type: 'text' },
            { name: 'shape', label: 'Shape', type: 'text' },
            { name: 'covering', label: 'Covering', type: 'text' },
            { name: 'coveringColour', label: 'Covering Colour', type: 'text' },
            { name: 'density', label: 'Density', type: 'text' }
          ]
        }
      },
    
      // 19. TRIMS VELCRO
      trimsVelcro: {
        title: 'TRIMS VELCRO',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'sizeSpec', label: 'Size Spec', type: 'text' },
            { name: 'velcroType', label: 'Type', type: 'text' },
            { name: 'colour', label: 'Colour', type: 'text' },
            { name: 'loopType', label: 'Loop Type', type: 'text' },
            { name: 'flameRetardant', label: 'Flame Retardant', type: 'text' }
          ]
        }
      },
    
      // 20. TRIMS ZIPPERS
      trimsZippers: {
        title: 'TRIMS ZIPPERS',
        sections: [
          {
            title: 'Basic Information',
            fields: [
              { name: 'date', label: 'DATE', type: 'date', required: true },
              { name: 'time', label: 'TIME', type: 'time' },
              { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
              { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
            ]
          },
          {
            title: 'Approval Details',
            fields: [
              { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
              { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
              { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
            ]
          },
          {
            title: 'Unit Identification',
            fields: [
              { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
              { name: 'poNo', label: 'PO NO', type: 'text' },
              { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
            ]
          },
          {
            title: 'Inspection Result',
            fields: [
              { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
              { name: 'result', label: 'RESULT', type: 'text' },
              { name: 'remarks', label: 'REMARKS', type: 'text' }
            ]
          }
        ],
        tableConfig: {
          title: 'USN (UNIT SEQUENCE #)',
          columns: [
            { name: 'usn', label: 'USN', type: 'text' },
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'material', label: 'Material', type: 'text' },
            { name: 'teeth', label: 'Teeth', type: 'text' },
            { name: 'puller', label: 'Puller', type: 'text' },
            { name: 'pullerType', label: 'Puller Type', type: 'text' },
            { name: 'length', label: 'Length', type: 'text' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'sliderType', label: 'Slider Type', type: 'text' },
            { name: 'finishCoating', label: 'Finish/Coating', type: 'text' }
          ]
        }
      },



        // ═══════════════════════════════════════════════════════════
  // CATEGORY: FOAM
  // ═══════════════════════════════════════════════════════════

  // 1. FOAM EVA
  foamEva: {
    title: 'FOAM EVA',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'interlocking', label: 'INTERLOCKING', type: 'text' },
        { name: 'waterResistance', label: 'WATER RESISTANCE', type: 'text' },
        { name: 'uvResistance', label: 'UV RESISTANCE', type: 'text' },
        { name: 'antiSlip', label: 'ANTI SLIP', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 2. FOAM GEL INFUSED
  foamGelInfused: {
    title: 'FOAM GEL INFUSED',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'gelType', label: 'GEL TYPE', type: 'text' },
        { name: 'gelContent', label: 'GEL CONTENT', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'coolingEffect', label: 'COOLING EFFECT', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 3. FOAM HR
  foamHr: {
    title: 'FOAM HR',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'grade', label: 'GRADE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'supportFactor', label: 'SUPPORT FACTOR', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 4. FOAM LATEX
  foamLatex: {
    title: 'FOAM LATEX',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'latexType', label: 'LATEX TYPE', type: 'text' },
        { name: 'naturalContent', label: 'NATURAL CONTENT', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'hypoallergenic', label: 'HYPOALLERGENIC', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 5. FOAM MEMORY
  foamMemory: {
    title: 'FOAM MEMORY',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'grade', label: 'GRADE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 6. FOAM PE~EPE
  foamPeEpe: {
    title: 'FOAM PE~EPE',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'lamination', label: 'LAMINATION', type: 'text' },
        { name: 'waterResistance', label: 'WATER RESISTANCE', type: 'text' },
        { name: 'thermalInsulation', label: 'THERMAL INSULATION', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 7. FOAM PU
  foamPu: {
    title: 'FOAM PU~FOAM',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM Type', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'grade', label: 'GRADE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'supportFactor', label: 'SUPPORT FACTOR', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

  // 8. FOAM REBONDED
  foamRebonded: {
    title: 'FOAM REBONDED',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certification', label: 'CERTIFICATION', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'foamType', label: 'FOAM TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'chipSource', label: 'CHIP SOURCE', type: 'text' },
        { name: 'chipSize', label: 'CHIP SIZE', type: 'text' },
        { name: 'bonding', label: 'BONDING', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'thickness', label: 'THICKNESS', type: 'text' },
        { name: 'shape', label: 'SHAPE', type: 'text' },
        { name: 'ildIfd', label: 'ILD/IFD (FIRMNESS)', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'density', label: 'DENSITY', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'length', label: 'LENGTH (CM)', type: 'number' },
        { name: 'width', label: 'WIDTH (CM)', type: 'number' },
        { name: 'shapeSizeSpec', label: 'SHAPE/SIZE SPEC', type: 'text' }
      ]
    }
  },

    // ═══════════════════════════════════════════════════════════
  // CATEGORY: FIBER
  // ═══════════════════════════════════════════════════════════

  // 1. FIBER SPECIALITY FILL
  fiberSpecialityFill: {
    title: 'FIBER SPECIALITY~FILL',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'source', label: 'SOURCE', type: 'text' },
        { name: 'properties', label: 'PROPERTIES', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'blending', label: 'BLENDING', type: 'text' },
        { name: 'biodegradable', label: 'BIODEGRADABLE', type: 'text' }
      ]
    }
  },

  // 2. FIBER WOOL NATURAL
  fiberWoolNatural: {
    title: 'FIBER WOOL NATURAL',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'woolType', label: 'WOOL TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'micron', label: 'MICRON', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'processing', label: 'PROCESSING', type: 'text' },
        { name: 'lanolinContent', label: 'LANOLIN CONTENT', type: 'text' },
        { name: 'moistureWicking', label: 'MOISTURE WICKING', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'mulesingFree', label: 'MULESING-FREE', type: 'text' }
      ]
    }
  },

  // 3. FIBER COTTON FILL
  fiberCottonFill: {
    title: 'FIBER COTTON~FILL',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'grade', label: 'GRADE', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'processing', label: 'PROCESSING', type: 'text' },
        { name: 'bonding', label: 'BONDING', type: 'text' },
        { name: 'fireRetardant', label: 'FIRE RETARDANT', type: 'text' },
        { name: 'dustTrashContent', label: 'DUST/TRASH CONTENT', type: 'text' }
      ]
    }
  },

  // 4. FIBER DOWN ALTERNATIVE
  fiberDownAlternative: {
    title: 'FIBER DOWN ALTERNATIVE',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'construction', label: 'CONSTRUCTION', type: 'text' },
        { name: 'denier', label: 'DENEIR', type: 'text' },
        { name: 'siliconized', label: 'SILICONIZED', type: 'text' },
        { name: 'loftRating', label: 'LOFT~RATING', type: 'text' },
        { name: 'waterResistance', label: 'WATER RESISTANCE', type: 'text' },
        { name: 'hypoallergenic', label: 'HYPOALLERGENIC', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'veganCrueltyFree', label: 'VEGAN/CRUELTY FREE', type: 'text' }
      ]
    }
  },

  // 5. FIBER DOWN FEATHER
  fiberDownFeather: {
    title: 'FIBER DOWN FEATHER',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'birdType', label: 'BIRDTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'origin', label: 'ORIGIN', type: 'text' },
        { name: 'downPercentage', label: 'DOWN PERCENTAGE', type: 'text' },
        { name: 'fillPower', label: 'FILL POWER', type: 'text' },
        { name: 'processing', label: 'PROCESSING', type: 'text' },
        { name: 'odor', label: 'ODOR', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'clusterSize', label: 'CLUSTER SIZE', type: 'text' }
      ]
    }
  },

  // 6. FIBER MICROFIBER
  fiberMicrofiber: {
    title: 'FIBER MICROFIBER',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'denier', label: 'DENIER', type: 'text' },
        { name: 'siliconized', label: 'SILICONIZED', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'clusterSize', label: 'CLUSTER SIZE', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'hypoallergenic', label: 'HYPOALLERGENIC', type: 'text' },
        { name: 'loftFillPower', label: 'LOFT/FILL POWER', type: 'text' },
        { name: 'handFeel', label: 'HAND FEEL', type: 'text' }
      ]
    }
  },

  // 7. FIBER POLYESTER FILL
  fiberPolyesterFill: {
    title: 'FIBER POLYESTER FILL',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'inspectedBy', label: 'INSPECTED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'approvedAgainst', label: 'APPROVED AGAINST', type: 'text' },
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Inspection Result',
        fields: [
          { name: 'certifications', label: 'CERTIFICATIONS', type: 'text' },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'subtype', label: 'SUBTYPE', type: 'text' },
        { name: 'form', label: 'FORM', type: 'text' },
        { name: 'denier', label: 'DENIER', type: 'text' },
        { name: 'siliconized', label: 'SILICONIZED', type: 'text' },
        { name: 'color', label: 'COLOR', type: 'text' },
        { name: 'bonding', label: 'BONDING', type: 'text' },
        { name: 'antiMicrobial', label: 'ANTI-MICROBIAL', type: 'text' },
        { name: 'fireRetardent', label: 'FIRE RETARDENT', type: 'text' },
        { name: 'loftFillPower', label: 'LOFT/FILL POWER', type: 'text' }
      ]
    }
  },
    // ═══════════════════════════════════════════════════════════
  // CATEGORY: YARN & FABRIC
  // ═══════════════════════════════════════════════════════════

  // 1. YARN


    // ═══════════════════════════════════════════════════════════
  // CATEGORY: YARN & FABRIC (CORRECTED - DROPDOWN IN DEFECT)
  // ═══════════════════════════════════════════════════════════

  // 1. YARN
  yarn: {
    title: 'UQR - YARN',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'qualityCheckedBy', label: 'QUALITY CHECKED BY', type: 'text' },
          { name: 'approvedBy', label: 'APPROVED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Final Metrics',
        fields: [
          { name: 'avgWeightDiff', label: 'AVG WEIGHT DIFFERENCE FOUND', type: 'text' },
          { name: 'moisturePercentage', label: 'MOISTURE %AGE', type: 'text' },
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'yarnType', label: 'YARN TYPE', type: 'text' },
        { name: 'count', label: 'COUNT', type: 'text' },
        { name: 'doubling', label: 'DOUBLING', type: 'text' },
        { name: 'ply', label: 'PLY', type: 'text' },
        { name: 'winding', label: 'WINDING', type: 'text' },
        { name: 'yarnWeightFound', label: 'YARN WEIGHT FOUND (20 MTR LACE)', type: 'text' },
        { name: 'tpi', label: 'TPI', type: 'text' },
        { name: 'twist', label: 'TWIST', type: 'text' },
        // DROPDOWN IN DEFECT
        { 
          name: 'defect', 
          label: 'DEFECT', 
          type: 'select', 
          options: ['Un-even', 'Contamination', 'Stained', 'Faded', 'Cone Damaged'] 
        },
        { name: 'major', label: 'MAJOR', type: 'number' },
        { name: 'minor', label: 'MINOR', type: 'number' },
        { name: 'findings', label: 'Findings', type: 'text' }
      ]
    }
  },

  // 2. FABRIC
  fabric: {
    title: 'UQR - FABRIC',
    sections: [
      {
        title: 'Basic Information',
        fields: [
          { name: 'date', label: 'DATE', type: 'date', required: true },
          { name: 'time', label: 'TIME', type: 'time' },
          { name: 'materialType', label: 'MATERIAL TYPE/DESCRIPTION', type: 'text' },
          { name: 'qualityCheckedBy', label: 'QUALITY CHECKED BY', type: 'text' },
          { name: 'approvedBy', label: 'APPROVED BY', type: 'text' }
        ]
      },
      {
        title: 'Approval Details',
        fields: [
          { name: 'invoiceQty', label: 'INVOICE/CHALLAN QTY', type: 'number' },
          { name: 'aqlMajorMinor', label: 'AQL MAJOR/MINOR', type: 'text' }
        ]
      },
      {
        title: 'Unit Identification',
        fields: [
          { name: 'uin', label: 'UIN (UNIT ID #)', type: 'text' },
          { name: 'poNo', label: 'PO NO', type: 'text' },
          { name: 'factoryPoCode', label: 'FACTORY PO CODE', type: 'text' }
        ]
      },
      {
        title: 'Fabric Specifications',
        fields: [
          { name: 'widthCm', label: 'WIDTH (CM)', type: 'number' },
          { name: 'certificationRequirement', label: 'CERTIFICATION REQUIREMENT', type: 'text' }
        ]
      },
      {
        title: 'Final Metrics',
        fields: [
          { name: 'moisturePercentage', label: 'MOISTURE %AGE', type: 'text' },
          { name: 'shadeApproval', label: 'SHADE APPROVAL', type: 'select', options: ['YES', 'NO', 'CONDITIONALLY APPROVED', 'MANAGEMENT'] },
          { name: 'result', label: 'RESULT', type: 'text' },
          { name: 'remarks', label: 'REMARKS', type: 'text' }
        ]
      }
    ],
    tableConfig: {
      title: 'USN (UNIT SEQUENCE #)',
      columns: [
        { name: 'usn', label: 'USN', type: 'text' },
        { name: 'fiberType', label: 'FIBER TYPE', type: 'text' },
        { name: 'fabricName', label: 'FABRIC NAME', type: 'text' },
        { name: 'composition', label: 'COMPOSITION', type: 'text' },
        { name: 'gsm', label: 'GSM', type: 'number' },
        { name: 'constructionType', label: 'CONSTRUCTION TYPE', type: 'text' },
        { name: 'weaveKnitType', label: 'WEAVE/KNIT TYPE', type: 'text' },
        { name: 'fiberCategory', label: 'FIBER CATEGORY', type: 'text' },
        { name: 'origin', label: 'ORIGIN', type: 'text' },
        { name: 'width', label: 'Width', type: 'text' },
        { name: 'defectAtMtr', label: 'Defect at MTR', type: 'text' },
        { name: 'length', label: 'Length', type: 'text' },
        // DROPDOWN IN DEFECT
        { 
          name: 'defect', 
          label: 'Defect', 
          type: 'select', 
          options: ['Fabric Damage', 'Stain', 'Stain Patch', 'Weaving Line', 'Cut/Hole'] 
        },
        { name: 'major', label: 'Major', type: 'number' },
        { name: 'minor', label: 'Minor', type: 'number' },
        { name: 'findings', label: 'Findings', type: 'text' },
        { name: 'attachRefImage', label: 'Attach Ref Image', type: 'text' }
      ]
    }
  }
  
};

Object.entries(formsConfig).forEach(([formKey, formConfig]) => {
  if (shouldIncludeProcurementDate(formKey)) {
    insertProcurementDateField(formConfig);
  }
});
