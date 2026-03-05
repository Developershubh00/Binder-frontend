// Import all forms and config
import { formsConfig } from './formConfig';
import {
  ArtworksFlammabilityForm,
  ArtworksHangtagSealsForm,
  ArtworksInsertCardsForm,
  ArtworksLawLabelForm,
  ArtworksRfidForm,
  ArtworksTagsSpecialForm,
  ArtworksAntiCounterfeitForm,
  ArtworksBellyBandForm,
  ArtworksCareCompositionForm,
  ArtworksHeatTransferForm,
  ArtworksLabelMainForm,
  ArtworksPriceTagForm,
  ArtworksQcLabelsForm,
  ArtworksSizeLabelsForm,
  ArtworksUpcLabelForm,
  TrimsBucklesForm,
  TrimsButtonsForm,
  TrimsCableTiesForm,
  TrimsCordStopsForm,
  TrimsFeltForm,
  TrimsFrTrimsForm,
  TrimsHooksEyesForm,
  TrimsInterliningForm,
  TrimsLaceForm,
  TrimsMagneticClosureForm,
  TrimsNiwarWebbingForm,
  TrimsPinBarbsForm,
  TrimsReflectiveTapesForm,
  TrimsRibbingForm,
  TrimsRingsLoopsForm,
  TrimsRivetsForm,
  TrimsSeamTapeForm,
  TrimsShoulderPadsForm,
  TrimsVelcroForm,
  TrimsZippersForm,
  FoamEvaForm,
  FoamGelInfusedForm,
  FoamHrForm,
  FoamLatexForm,
  FoamMemoryForm,
  FoamPeEpeForm,
  FoamPuForm,
  FoamRebondedForm,
  FiberSpecialityFillForm,
  FiberWoolNaturalForm,
  FiberCottonFillForm,
  FiberDownAlternativeForm,
  FiberDownFeatherForm,
  FiberMicrofiberForm,
  FiberPolyesterFillForm,
  YarnForm,
  FabricForm
} from './index';

import { FullscreenContent, FormCard } from '@/components/ui/form-layout';
import { useState, useMemo } from 'react';

// Category → form key → Component registry
const CATEGORIES = [
  { id: 'artworks', label: 'Artworks' },
  { id: 'trims', label: 'Trims & Accessory' },
  { id: 'foam', label: 'Foam' },
  { id: 'fiber', label: 'Fiber' },
  { id: 'yarn', label: 'Yarn' },
  { id: 'fabric', label: 'Fabric' }
];

const FORM_REGISTRY = [
  { categoryId: 'artworks', formKey: 'artworksFlammability', Form: ArtworksFlammabilityForm },
  { categoryId: 'artworks', formKey: 'artworksHangtagSeals', Form: ArtworksHangtagSealsForm },
  { categoryId: 'artworks', formKey: 'artworksInsertCards', Form: ArtworksInsertCardsForm },
  { categoryId: 'artworks', formKey: 'artworksLawLabel', Form: ArtworksLawLabelForm },
  { categoryId: 'artworks', formKey: 'artworksRfid', Form: ArtworksRfidForm },
  { categoryId: 'artworks', formKey: 'artworksTagsSpecial', Form: ArtworksTagsSpecialForm },
  { categoryId: 'artworks', formKey: 'artworksAntiCounterfeit', Form: ArtworksAntiCounterfeitForm },
  { categoryId: 'artworks', formKey: 'artworksBellyBand', Form: ArtworksBellyBandForm },
  { categoryId: 'artworks', formKey: 'artworksCareComposition', Form: ArtworksCareCompositionForm },
  { categoryId: 'artworks', formKey: 'artworksHeatTransfer', Form: ArtworksHeatTransferForm },
  { categoryId: 'artworks', formKey: 'artworksLabelMain', Form: ArtworksLabelMainForm },
  { categoryId: 'artworks', formKey: 'artworksPriceTag', Form: ArtworksPriceTagForm },
  { categoryId: 'artworks', formKey: 'artworksQcLabels', Form: ArtworksQcLabelsForm },
  { categoryId: 'artworks', formKey: 'artworksSizeLabels', Form: ArtworksSizeLabelsForm },
  { categoryId: 'artworks', formKey: 'artworksUpcLabel', Form: ArtworksUpcLabelForm },
  { categoryId: 'trims', formKey: 'trimsBuckles', Form: TrimsBucklesForm },
  { categoryId: 'trims', formKey: 'trimsButtons', Form: TrimsButtonsForm },
  { categoryId: 'trims', formKey: 'trimsCableTies', Form: TrimsCableTiesForm },
  { categoryId: 'trims', formKey: 'trimsCordStops', Form: TrimsCordStopsForm },
  { categoryId: 'trims', formKey: 'trimsFelt', Form: TrimsFeltForm },
  { categoryId: 'trims', formKey: 'trimsFrTrims', Form: TrimsFrTrimsForm },
  { categoryId: 'trims', formKey: 'trimsHooksEyes', Form: TrimsHooksEyesForm },
  { categoryId: 'trims', formKey: 'trimsInterlining', Form: TrimsInterliningForm },
  { categoryId: 'trims', formKey: 'trimsLace', Form: TrimsLaceForm },
  { categoryId: 'trims', formKey: 'trimsMagneticClosure', Form: TrimsMagneticClosureForm },
  { categoryId: 'trims', formKey: 'trimsNiwarWebbing', Form: TrimsNiwarWebbingForm },
  { categoryId: 'trims', formKey: 'trimsPinBarbs', Form: TrimsPinBarbsForm },
  { categoryId: 'trims', formKey: 'trimsReflectiveTapes', Form: TrimsReflectiveTapesForm },
  { categoryId: 'trims', formKey: 'trimsRibbing', Form: TrimsRibbingForm },
  { categoryId: 'trims', formKey: 'trimsRingsLoops', Form: TrimsRingsLoopsForm },
  { categoryId: 'trims', formKey: 'trimsRivets', Form: TrimsRivetsForm },
  { categoryId: 'trims', formKey: 'trimsSeamTape', Form: TrimsSeamTapeForm },
  { categoryId: 'trims', formKey: 'trimsShoulderPads', Form: TrimsShoulderPadsForm },
  { categoryId: 'trims', formKey: 'trimsVelcro', Form: TrimsVelcroForm },
  { categoryId: 'trims', formKey: 'trimsZippers', Form: TrimsZippersForm },
  { categoryId: 'foam', formKey: 'foamEva', Form: FoamEvaForm },
  { categoryId: 'foam', formKey: 'foamGelInfused', Form: FoamGelInfusedForm },
  { categoryId: 'foam', formKey: 'foamHr', Form: FoamHrForm },
  { categoryId: 'foam', formKey: 'foamLatex', Form: FoamLatexForm },
  { categoryId: 'foam', formKey: 'foamMemory', Form: FoamMemoryForm },
  { categoryId: 'foam', formKey: 'foamPeEpe', Form: FoamPeEpeForm },
  { categoryId: 'foam', formKey: 'foamPu', Form: FoamPuForm },
  { categoryId: 'foam', formKey: 'foamRebonded', Form: FoamRebondedForm },
  { categoryId: 'fiber', formKey: 'fiberSpecialityFill', Form: FiberSpecialityFillForm },
  { categoryId: 'fiber', formKey: 'fiberWoolNatural', Form: FiberWoolNaturalForm },
  { categoryId: 'fiber', formKey: 'fiberCottonFill', Form: FiberCottonFillForm },
  { categoryId: 'fiber', formKey: 'fiberDownAlternative', Form: FiberDownAlternativeForm },
  { categoryId: 'fiber', formKey: 'fiberDownFeather', Form: FiberDownFeatherForm },
  { categoryId: 'fiber', formKey: 'fiberMicrofiber', Form: FiberMicrofiberForm },
  { categoryId: 'fiber', formKey: 'fiberPolyesterFill', Form: FiberPolyesterFillForm },
  { categoryId: 'yarn', formKey: 'yarn', Form: YarnForm },
  { categoryId: 'fabric', formKey: 'fabric', Form: FabricForm }
];

const dropdownStyle = {
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fff',
  minWidth: '200px',
  cursor: 'pointer'
};

const UQRFormsPreview = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedFormKey, setSelectedFormKey] = useState('');

  const formsInCategory = useMemo(
    () => FORM_REGISTRY.filter((f) => f.categoryId === selectedCategory),
    [selectedCategory]
  );

  const selectedEntry = useMemo(
    () => FORM_REGISTRY.find((f) => f.formKey === selectedFormKey),
    [selectedFormKey]
  );

  const FormComponent = selectedEntry?.Form;

  const handleCategoryChange = (e) => {
    const next = e.target.value;
    setSelectedCategory(next);
    const firstInCategory = FORM_REGISTRY.find((f) => f.categoryId === next);
    setSelectedFormKey(firstInCategory ? firstInCategory.formKey : '');
  };

  const handleFormChange = (e) => {
    setSelectedFormKey(e.target.value || '');
  };

  return (
    <FullscreenContent style={{ overflowY: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}
        >
          <label style={{ fontWeight: 600, color: '#333' }}>Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={dropdownStyle}
            aria-label="Select category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: 600, color: '#333', marginLeft: '8px' }}>Form</label>
          <select
            value={selectedFormKey}
            onChange={handleFormChange}
            style={{ ...dropdownStyle, minWidth: '320px' }}
            aria-label="Select form"
          >
            <option value="">Select a form…</option>
            {formsInCategory.map(({ formKey }) => (
              <option key={formKey} value={formKey}>
                {formsConfig[formKey]?.title ?? formKey}
              </option>
            ))}
          </select>
        </div>

        {FormComponent ? (
          <FormCard style={{ padding: '20px' }}>
            <FormComponent />
          </FormCard>
        ) : (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '15px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '1px dashed #dee2e6'
            }}
          >
            Select a category, then choose a form from the list to open it.
          </div>
        )}
      </div>
    </FullscreenContent>
  );
};

export default UQRFormsPreview;
