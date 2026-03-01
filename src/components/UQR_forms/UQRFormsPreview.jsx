// Import all forms from the index file
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

  // Foam Imports
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

const UQRFormsPreview = () => {
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
        
        {/* Form 1: Flammability */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksFlammabilityForm />
        </FormCard>

        {/* Form 2: Hangtag Seals */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksHangtagSealsForm />
        </FormCard>

        {/* Form 3: Insert Cards */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksInsertCardsForm />
        </FormCard>

        {/* Form 4: Law Label */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksLawLabelForm />
        </FormCard>

        {/* Form 5: RFID */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksRfidForm />
        </FormCard>

        {/* Form 6: Tags & Special Labels */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksTagsSpecialForm />
        </FormCard>

        {/* Form 7: Anti Counterfeit */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksAntiCounterfeitForm />
        </FormCard>

        {/* Form 8: Belly Band */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksBellyBandForm />
        </FormCard>

        {/* Form 9: Care Composition */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksCareCompositionForm />
        </FormCard>

        {/* Form 10: Heat Transfer */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksHeatTransferForm />
        </FormCard>

        {/* Form 11: Label Main */}
        <FormCard style={{ padding: '20px' }}>
          <ArtworksLabelMainForm />
        </FormCard>

        <FormCard style={{ padding: '20px' }}><ArtworksPriceTagForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><ArtworksQcLabelsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><ArtworksSizeLabelsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><ArtworksUpcLabelForm /></FormCard>

         {/* Trims & Accessory Forms */}
         <FormCard style={{ padding: '20px' }}><TrimsBucklesForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsButtonsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsCableTiesForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsCordStopsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsFeltForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsFrTrimsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsHooksEyesForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsInterliningForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsLaceForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsMagneticClosureForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsNiwarWebbingForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsPinBarbsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsReflectiveTapesForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsRibbingForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsRingsLoopsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsRivetsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsSeamTapeForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsShoulderPadsForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsVelcroForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><TrimsZippersForm /></FormCard>

         {/* Foam Forms */}
         <FormCard style={{ padding: '20px' }}><FoamEvaForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamGelInfusedForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamHrForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamLatexForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamMemoryForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamPeEpeForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamPuForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FoamRebondedForm /></FormCard>


        <FormCard style={{ padding: '20px' }}><FiberSpecialityFillForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberWoolNaturalForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberCottonFillForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberDownAlternativeForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberDownFeatherForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberMicrofiberForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FiberPolyesterFillForm /></FormCard>

        {/* Yarn & Fabric Forms */}
        <FormCard style={{ padding: '20px' }}><YarnForm /></FormCard>
        <FormCard style={{ padding: '20px' }}><FabricForm /></FormCard>

      </div>
    </FullscreenContent>
  );
};

export default UQRFormsPreview;