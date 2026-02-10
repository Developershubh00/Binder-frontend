import SearchableDropdown from './SearchableDropdown';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const defaultDropdownClass = (error) =>
  `border border-input rounded-md bg-background text-foreground h-11 w-full text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none${error ? ' border-red-600' : ''}`;
const noError = () => false;
const advancedSpecGridClass =
  "col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4";

export const ZippersAdvancedSpec = ({ material, handleChange, dropdownClass, hasError }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
    <Field label="SLIDER TYPE" width="sm">
      <SearchableDropdown
        value={material.zipSliderType || ''}
        onChange={(selectedValue) => handleChange('zipSliderType', selectedValue)}
        options={['Auto-lock', 'Non-lock', 'Reverse lock', 'Two-way']}
        placeholder="Select or type"
        className={dropdownClass(hasError('zipSliderType'))}
      />
    </Field>
    <Field label="FINISH / COATING" width="sm">
      <SearchableDropdown
        value={material.zipFinish || ''}
        onChange={(selectedValue) => handleChange('zipFinish', selectedValue)}
        options={['Nickel', 'Brass', 'Antique', 'Black Oxide', 'DTM (Puller)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('zipFinish'))}
      />
    </Field>
    <Field label="LENGTH TOLERANCE" width="sm">
      <Input
        type="text"
        value={material.zipLengthTolerance || ''}
        onChange={(e) => handleChange('zipLengthTolerance', e.target.value)}
        placeholder="e.g., ±3mm, ±5mm"
      />
    </Field>
  </div>
);

export const ButtonsAdvancedSpec = ({ material, handleChange, dropdownClass, hasError }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
    <Field label="ATTACHMENT" width="sm">
      <SearchableDropdown
        value={material.buttonAttachment || ''}
        onChange={(selectedValue) => handleChange('buttonAttachment', selectedValue)}
        options={['Machine Sew', 'Hand Sew (Shank)', 'Pneumatic Press (Snaps)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('buttonAttachment'))}
      />
    </Field>
    <Field label="FUNCTION" width="sm">
      <SearchableDropdown
        value={material.buttonFunction || ''}
        onChange={(selectedValue) => handleChange('buttonFunction', selectedValue)}
        options={['Functional (Closure)', 'Decorative', 'Dual Purpose']}
        placeholder="Select or type"
        className={dropdownClass(hasError('buttonFunction'))}
      />
    </Field>
    <Field label="LOGO" width="sm">
      <SearchableDropdown
        value={material.buttonLogo || ''}
        onChange={(selectedValue) => handleChange('buttonLogo', selectedValue)}
        options={['Plain', 'Embossed', 'Engraved', 'Laser Engraved', 'Custom']}
        placeholder="Select or type"
        className={dropdownClass(hasError('buttonLogo'))}
      />
    </Field>
  </div>
);

export const VelcroAdvancedSpec = ({
  material,
  handleChange,
  materialIndex = 0,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.velcroColour || ''}
        onChange={(selectedValue) => handleChange('velcroColour', selectedValue)}
        options={['DTM', 'White', 'Black', 'Beige', 'Grey', 'Navy']}
        placeholder="Select or type"
        className={dropdownClass(hasError('velcroColour'))}
      />
    </Field>
    <Field label="COLOR REFERENCE" width="sm">
      <div className="flex items-center gap-3">
        <input
          type="file"
          onChange={(e) => handleChange('velcroColorReference', e.target.files[0])}
          className="hidden"
          id={`upload-velcro-color-${materialIndex}`}
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 w-full"
          onClick={() => document.getElementById(`upload-velcro-color-${materialIndex}`)?.click()}
        >
          {material.velcroColorReference ? 'UPLOADED' : 'UPLOAD'}
        </Button>
      </div>
    </Field>
    <Field label="HOOK DENSITY" width="sm">
      <SearchableDropdown
        value={material.velcroHookDensity || ''}
        onChange={(selectedValue) => handleChange('velcroHookDensity', selectedValue)}
        options={['Standard', 'High Density (stronger grip)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('velcroHookDensity'))}
      />
    </Field>
    <Field label="LOOP TYPE" width="sm">
      <SearchableDropdown
        value={material.velcroLoopType || ''}
        onChange={(selectedValue) => handleChange('velcroLoopType', selectedValue)}
        options={['Woven', 'Knitted', 'Non-woven']}
        placeholder="Select or type"
        className={dropdownClass(hasError('velcroLoopType'))}
      />
    </Field>
    <Field label="CYCLE LIFE" width="sm">
      <SearchableDropdown
        value={material.velcroCycleLife || ''}
        onChange={(selectedValue) => handleChange('velcroCycleLife', selectedValue)}
        options={['Standard: 1,000+', 'Heavy Duty: 5,000+', 'Industrial: 10,000+']}
        placeholder="Select or type"
        className={dropdownClass(hasError('velcroCycleLife'))}
      />
    </Field>
    <Field label="FLAME RETARDANT" width="sm">
      <SearchableDropdown
        value={material.velcroFlameRetardant || ''}
        onChange={(selectedValue) => handleChange('velcroFlameRetardant', selectedValue)}
        options={['Standard', 'FR Treated', 'Inherently FR']}
        placeholder="Select or type"
        className={dropdownClass(hasError('velcroFlameRetardant'))}
      />
    </Field>
  </div>
);

export const RivetAdvancedSpec = ({ material, handleChange, dropdownClass, hasError }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
    <Field label="LOGO" width="sm">
      <SearchableDropdown
        value={material.rivetLogo || ''}
        onChange={(selectedValue) => handleChange('rivetLogo', selectedValue)}
        options={['Plain', 'Embossed', 'Custom', 'Laser Engraved']}
        placeholder="Select or type"
        className={dropdownClass(hasError('rivetLogo'))}
      />
    </Field>
    <Field label="SETTING" width="sm">
      <SearchableDropdown
        value={material.rivetSetting || ''}
        onChange={(selectedValue) => handleChange('rivetSetting', selectedValue)}
        options={['Machine Applied (specific die)', 'Hand Press']}
        placeholder="Select or type"
        className={dropdownClass(hasError('rivetSetting'))}
      />
    </Field>
  </div>
);

export const NiwarAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="THICKNESS" width="sm">
      <SearchableDropdown
        value={material.niwarThickness || ''}
        onChange={(selectedValue) => handleChange('niwarThickness', selectedValue)}
        options={['Thin', 'Medium', 'Heavy-duty (1mm, 1.5mm, 2mm)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('niwarThickness'))}
      />
    </Field>
    <Field label="FINISH" width="sm">
      <SearchableDropdown
        value={material.niwarFinish || ''}
        onChange={(selectedValue) => handleChange('niwarFinish', selectedValue)}
        options={['Soft', 'Stiff', 'Water Repellent', 'UV Resistant', 'Fire Retardant']}
        placeholder="Select or type"
        className={dropdownClass(hasError('niwarFinish'))}
      />
    </Field>
    <Field label="TENSILE STRENGTH" width="sm">
      <Input
        type="text"
        value={material.niwarTensileStrength || ''}
        onChange={(e) => handleChange('niwarTensileStrength', e.target.value)}
        placeholder="Breaking Strength (N) or Kg"
        aria-invalid={hasError('niwarTensileStrength')}
      />
    </Field>
    <Field label="EDGE TYPE" width="sm">
      <SearchableDropdown
        value={material.niwarEdgeType || ''}
        onChange={(selectedValue) => handleChange('niwarEdgeType', selectedValue)}
        options={['Selvage', 'Cut & Sealed', 'Bound Edge']}
        placeholder="Select or type"
        className={dropdownClass(hasError('niwarEdgeType'))}
      />
    </Field>
  </div>
);

export const LaceAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="FINISHING" width="sm">
      <SearchableDropdown
        value={material.laceFinishing || ''}
        onChange={(selectedValue) => handleChange('laceFinishing', selectedValue)}
        options={['Starch (Stiff)', 'Soft', 'Mercerized', 'Scalloped Edge', 'Eyelash Edge']}
        placeholder="Select or type"
        className={dropdownClass(hasError('laceFinishing'))}
      />
    </Field>
    <Field label="STRETCH" width="sm">
      <SearchableDropdown
        value={material.laceStretch || ''}
        onChange={(selectedValue) => handleChange('laceStretch', selectedValue)}
        options={['Non-Stretch', '2-Way Stretch', '4-Way Stretch']}
        placeholder="Select or type"
        className={dropdownClass(hasError('laceStretch'))}
      />
    </Field>
    <Field label="PATTERN TYPE" width="sm">
      <SearchableDropdown
        value={material.lacePatternType || ''}
        onChange={(selectedValue) => handleChange('lacePatternType', selectedValue)}
        options={['Floral', 'Geometric', 'Abstract', 'Traditional', 'Scallop']}
        placeholder="Select or type"
        className={dropdownClass(hasError('lacePatternType'))}
      />
    </Field>
  </div>
);

export const FeltAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="THICKNESS" width="sm">
      <SearchableDropdown
        value={material.feltThickness || ''}
        onChange={(selectedValue) => handleChange('feltThickness', selectedValue)}
        options={['1mm', '2mm', '3mm', '5mm', '1/8 inch', '1/4 inch']}
        placeholder="Select or type"
        className={dropdownClass(hasError('feltThickness'))}
      />
    </Field>
    <Field label="FINISH/FORM" width="sm">
      <SearchableDropdown
        value={material.feltFinishForm || ''}
        onChange={(selectedValue) => handleChange('feltFinishForm', selectedValue)}
        options={['Rolls', 'Sheets', 'Die-Cut Shapes', 'Adhesive Backed', 'Plain']}
        placeholder="Select or type"
        className={dropdownClass(hasError('feltFinishForm'))}
      />
    </Field>
    <Field label="APPLICATION" width="sm">
      <SearchableDropdown
        value={material.feltApplication || ''}
        onChange={(selectedValue) => handleChange('feltApplication', selectedValue)}
        options={['Padding', 'Interlining', 'Craft', 'Insulation', 'Acoustic']}
        placeholder="Select or type"
        className={dropdownClass(hasError('feltApplication'))}
      />
    </Field>
    <Field label="STIFFNESS" width="sm">
      <SearchableDropdown
        value={material.feltStiffness || ''}
        onChange={(selectedValue) => handleChange('feltStiffness', selectedValue)}
        options={['Soft', 'Medium', 'Stiff', 'Extra Stiff']}
        placeholder="Select or type"
        className={dropdownClass(hasError('feltStiffness'))}
      />
    </Field>
  </div>
);

export const InterliningAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="DOT DENSITY" width="sm">
      <SearchableDropdown
        value={material.interliningDotDensity || ''}
        onChange={(selectedValue) => handleChange('interliningDotDensity', selectedValue)}
        options={['Light', 'Medium', 'Heavy (affects bond & hand)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('interliningDotDensity'))}
      />
    </Field>
    <Field label="STRETCH" width="sm">
      <SearchableDropdown
        value={material.interliningStretch || ''}
        onChange={(selectedValue) => handleChange('interliningStretch', selectedValue)}
        options={['Non-Stretch', 'Warp Stretch', 'Bi-Stretch (2-way)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('interliningStretch'))}
      />
    </Field>
    <Field label="INTERLINING(FUSING) SPEC" width="md">
      <SearchableDropdown
        value={material.interliningFusingSpec || ''}
        onChange={(selectedValue) => handleChange('interliningFusingSpec', selectedValue)}
        options={['Temperature (±5°C)', 'Pressure (±0.5 Bar)', 'Time (±1 sec)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('interliningFusingSpec'))}
      />
    </Field>
    <Field label="HAND FEEL" width="sm">
      <SearchableDropdown
        value={material.interliningHandFeel || ''}
        onChange={(selectedValue) => handleChange('interliningHandFeel', selectedValue)}
        options={['Soft', 'Medium', 'Crisp', 'Firm']}
        placeholder="Select or type"
        className={dropdownClass(hasError('interliningHandFeel'))}
      />
    </Field>
  </div>
);

export const HookEyeAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="STRENGTH" width="sm">
      <SearchableDropdown
        value={material.hookEyeStrength || ''}
        onChange={(selectedValue) => handleChange('hookEyeStrength', selectedValue)}
        options={['Holding Power (force to pull apart)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('hookEyeStrength'))}
      />
    </Field>
    <Field label="APPLICATION" width="sm">
      <SearchableDropdown
        value={material.hookEyeApplication || ''}
        onChange={(selectedValue) => handleChange('hookEyeApplication', selectedValue)}
        options={['Waistband', 'Bra/Lingerie', 'Neckline', 'Fur Coat']}
        placeholder="Select or type"
        className={dropdownClass(hasError('hookEyeApplication'))}
      />
    </Field>
  </div>
);

export const BucklesAdvancedSpec = ({ material, handleChange, dropdownClass, hasError }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
    <Field label="FUNCTION" width="sm">
      <SearchableDropdown
        value={material.bucklesFunction || ''}
        onChange={(selectedValue) => handleChange('bucklesFunction', selectedValue)}
        options={['Load Bearing', 'Decorative', 'Quick Release', 'Adjustable', 'Auto-Lock', 'Swivel']}
        placeholder="Select or type"
        className={dropdownClass(hasError('bucklesFunction'))}
      />
    </Field>
    <Field label="TENSILE STRENGTH" width="sm">
      <SearchableDropdown
        value={material.bucklesTensileStrength || ''}
        onChange={(selectedValue) => handleChange('bucklesTensileStrength', selectedValue)}
        options={['Break Strength (100kg)', 'Break Strength (500N)', 'Light Duty (<50 kg)', 'Standard (50-150 kg)', 'Heavy Duty (150-500 kg)', 'Safety (>500 kg)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('bucklesTensileStrength'))}
      />
    </Field>
    <Field label="SAFETY" width="sm">
      <SearchableDropdown
        value={material.bucklesSafety || ''}
        onChange={(selectedValue) => handleChange('bucklesSafety', selectedValue)}
        options={['Standard', 'Child-Safe', 'Breakaway (safety release)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('bucklesSafety'))}
      />
    </Field>
    <Field label="WIDTH" width="sm">
      <Input
        type="text"
        value={material.bucklesWidth || ''}
        onChange={(e) => handleChange('bucklesWidth', e.target.value)}
        placeholder="e.g., 15mm, 20mm"
      />
    </Field>
    <Field label="COLOUR" width="sm">
      <SearchableDropdown
        value={material.bucklesColour || ''}
        onChange={(selectedValue) => handleChange('bucklesColour', selectedValue)}
        options={['Black', 'White', 'Navy', 'Grey', 'DTM', 'Custom']}
        placeholder="Select or type"
        className={dropdownClass(hasError('bucklesColour'))}
      />
    </Field>
  </div>
);

export const RibbingAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="STRETCH %" width="sm">
      <SearchableDropdown
        value={material.ribbingStretchPercent || ''}
        onChange={(selectedValue) => handleChange('ribbingStretchPercent', selectedValue)}
        options={['Elongation (80% minimum)', 'Recovery %']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ribbingStretchPercent'))}
      />
    </Field>
    <Field label="CUTTING" width="sm">
      <SearchableDropdown
        value={material.ribbingCutting || ''}
        onChange={(selectedValue) => handleChange('ribbingCutting', selectedValue)}
        options={['Cut Open (flat)', 'Tubular (continuous)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ribbingCutting'))}
      />
    </Field>
    <Field label="SPANDEX CONTENT" width="sm">
      <SearchableDropdown
        value={material.ribbingSpandexContent || ''}
        onChange={(selectedValue) => handleChange('ribbingSpandexContent', selectedValue)}
        options={['0%', '3%', '5%', '7%', '10%']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ribbingSpandexContent'))}
      />
    </Field>
    <Field label="ANTI-CURL" width="sm">
      <SearchableDropdown
        value={material.ribbingAntiCurl || ''}
        onChange={(selectedValue) => handleChange('ribbingAntiCurl', selectedValue)}
        options={['Standard', 'Anti-Curl Treatment']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ribbingAntiCurl'))}
      />
    </Field>
  </div>
);

export const CableTieAdvancedSpec = ({ material, handleChange, dropdownClass, hasError }) => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4">
    <Field label="TENSILE STRENGTH" width="sm">
      <SearchableDropdown
        value={material.cableTieTensileStrength || ''}
        onChange={(selectedValue) => handleChange('cableTieTensileStrength', selectedValue)}
        options={['Holding Force (8kg)', 'Holding Force (18kg)', 'Holding Force (22kg)', 'Holding Force (55kg)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('cableTieTensileStrength'))}
      />
    </Field>
    <Field label="FINISH" width="sm">
      <SearchableDropdown
        value={material.cableTieFinish || ''}
        onChange={(selectedValue) => handleChange('cableTieFinish', selectedValue)}
        options={['Smooth Edge', 'Rounded Head']}
        placeholder="Select or type"
        className={dropdownClass(hasError('cableTieFinish'))}
      />
    </Field>
    <Field label="UV RESISTANCE" width="sm">
      <SearchableDropdown
        value={material.cableTieUvResistance || ''}
        onChange={(selectedValue) => handleChange('cableTieUvResistance', selectedValue)}
        options={['Standard (Indoor)', 'UV Stabilized (Outdoor)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('cableTieUvResistance'))}
      />
    </Field>
  </div>
);

export const SeamTapeAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="APPLICATION SPEC" width="sm">
      <SearchableDropdown
        value={material.seamTapeApplicationSpec || ''}
        onChange={(selectedValue) => handleChange('seamTapeApplicationSpec', selectedValue)}
        options={['Temperature (±5°C)', 'Speed (m/min)', 'Pressure (Bar)', 'Waterproof Sealing', 'Stretch Seam Support', 'Edge Stabilization', 'Hem Tape', 'Shoulder Tape']}
        placeholder="Select or type"
        className={dropdownClass(hasError('seamTapeApplicationSpec'))}
      />
    </Field>
    <Field label="ELASTICITY" width="sm">
      <SearchableDropdown
        value={material.seamTapeElasticity || ''}
        onChange={(selectedValue) => handleChange('seamTapeElasticity', selectedValue)}
        options={['Stretch % (must match fabric)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('seamTapeElasticity'))}
      />
    </Field>
    <Field label="BREATHABILITY" width="sm">
      <SearchableDropdown
        value={material.seamTapeBreathability || ''}
        onChange={(selectedValue) => handleChange('seamTapeBreathability', selectedValue)}
        options={['Breathable (MVTR rating)', 'Non-Breathable']}
        placeholder="Select or type"
        className={dropdownClass(hasError('seamTapeBreathability'))}
      />
    </Field>
  </div>
);

export const ReflectiveTapeAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="CERTIFICATION" width="sm">
      <SearchableDropdown
        value={material.reflectiveTapeCertification || ''}
        onChange={(selectedValue) => handleChange('reflectiveTapeCertification', selectedValue)}
        options={['ISO 20471', 'ANSI/ISEA 107', 'EN 469', 'EN 1150']}
        placeholder="Select or type"
        className={dropdownClass(hasError('reflectiveTapeCertification'))}
      />
    </Field>
    <Field label="WASH DURABILITY" width="sm">
      <SearchableDropdown
        value={material.reflectiveTapeWashDurability || ''}
        onChange={(selectedValue) => handleChange('reflectiveTapeWashDurability', selectedValue)}
        options={['Wash cycles maintaining reflectivity (25, 50, Industrial)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('reflectiveTapeWashDurability'))}
      />
    </Field>
    <Field label="REFLECTIVITY" width="sm">
      <SearchableDropdown
        value={material.reflectiveTapeReflectivity || ''}
        onChange={(selectedValue) => handleChange('reflectiveTapeReflectivity', selectedValue)}
        options={['Retro-reflection Coefficient (cd/lux/m²) - Class 1, 2']}
        placeholder="Select or type"
        className={dropdownClass(hasError('reflectiveTapeReflectivity'))}
      />
    </Field>
  </div>
);

export const FrTrimsAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="DURABILITY" width="sm">
      <SearchableDropdown
        value={material.frTrimsDurability || ''}
        onChange={(selectedValue) => handleChange('frTrimsDurability', selectedValue)}
        options={['Inherently FR (natural)', 'Treated FR (chemical, limited life)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('frTrimsDurability'))}
      />
    </Field>
    <Field label="FR COMPONENTS" width="sm">
      <SearchableDropdown
        value={material.frTrimsFrComponents || ''}
        onChange={(selectedValue) => handleChange('frTrimsFrComponents', selectedValue)}
        options={['All components must be FR (teeth, tape, thread)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('frTrimsFrComponents'))}
      />
    </Field>
    <Field label="LOI" width="sm">
      <SearchableDropdown
        value={material.frTrimsLoi || ''}
        onChange={(selectedValue) => handleChange('frTrimsLoi', selectedValue)}
        options={['Limiting Oxygen Index (>28% for self-extinguishing)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('frTrimsLoi'))}
      />
    </Field>
    <Field label="CHAR LENGTH" width="sm">
      <SearchableDropdown
        value={material.frTrimsCharLength || ''}
        onChange={(selectedValue) => handleChange('frTrimsCharLength', selectedValue)}
        options={['Maximum char length in vertical flame test']}
        placeholder="Select or type"
        className={dropdownClass(hasError('frTrimsCharLength'))}
      />
    </Field>
  </div>
);

export const CordStopAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="FUNCTION" width="sm">
      <SearchableDropdown
        value={material.cordStopFunction || ''}
        onChange={(selectedValue) => handleChange('cordStopFunction', selectedValue)}
        options={['Adjustment', 'Decoration', "Safety Breakaway (children's wear)"]}
        placeholder="Select or type"
        className={dropdownClass(hasError('cordStopFunction'))}
      />
    </Field>
    <Field label="BREAKAWAY" width="sm">
      <SearchableDropdown
        value={material.cordStopBreakaway || ''}
        onChange={(selectedValue) => handleChange('cordStopBreakaway', selectedValue)}
        options={['Standard', 'Safety Breakaway (child safety)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('cordStopBreakaway'))}
      />
    </Field>
  </div>
);

export const RingsLoopsAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="LOAD RATING" width="sm">
      <SearchableDropdown
        value={material.ringsLoopsLoadRating || ''}
        onChange={(selectedValue) => handleChange('ringsLoopsLoadRating', selectedValue)}
        options={['Breaking Strength', 'Working Load Limit (WLL)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ringsLoopsLoadRating'))}
      />
    </Field>
    <Field label="WELDED" width="sm">
      <SearchableDropdown
        value={material.ringsLoopsWelded || ''}
        onChange={(selectedValue) => handleChange('ringsLoopsWelded', selectedValue)}
        options={['Welded (stronger)', 'Non-Welded (lighter)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ringsLoopsWelded'))}
      />
    </Field>
    <Field label="APPLICATION" width="sm">
      <SearchableDropdown
        value={material.ringsLoopsApplication || ''}
        onChange={(selectedValue) => handleChange('ringsLoopsApplication', selectedValue)}
        options={['Strap Attachment', 'Hanging Point', 'Decoration']}
        placeholder="Select or type"
        className={dropdownClass(hasError('ringsLoopsApplication'))}
      />
    </Field>
  </div>
);

export const PinBarbAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="TENSILE STRENGTH" width="sm">
      <SearchableDropdown
        value={material.pinBarbTensileStrength || ''}
        onChange={(selectedValue) => handleChange('pinBarbTensileStrength', selectedValue)}
        options={['Holding Power (prevents tag removal)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('pinBarbTensileStrength'))}
      />
    </Field>
    <Field label="APPLICATION" width="sm">
      <SearchableDropdown
        value={material.pinBarbApplication || ''}
        onChange={(selectedValue) => handleChange('pinBarbApplication', selectedValue)}
        options={['Price Tagging', 'Securing Folds', 'Temporary Attachment', 'Sample Pinning']}
        placeholder="Select or type"
        className={dropdownClass(hasError('pinBarbApplication'))}
      />
    </Field>
    <Field label="MAGAZINE/CARTRIDGE" width="sm">
      <SearchableDropdown
        value={material.pinBarbMagazineCartridge || ''}
        onChange={(selectedValue) => handleChange('pinBarbMagazineCartridge', selectedValue)}
        options={['Compatible magazine for tagging guns']}
        placeholder="Select or type"
        className={dropdownClass(hasError('pinBarbMagazineCartridge'))}
      />
    </Field>
  </div>
);

export const MagneticClosureAdvancedSpec = ({
  material,
  handleChange,
  dropdownClass = defaultDropdownClass,
  hasError = noError,
}) => (
  <div className={advancedSpecGridClass}>
    <Field label="STRENGTH" width="sm">
      <SearchableDropdown
        value={material.magneticClosureStrength || ''}
        onChange={(selectedValue) => handleChange('magneticClosureStrength', selectedValue)}
        options={['Pull Force (Newtons)', 'Pull Force (Kilograms)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('magneticClosureStrength'))}
      />
    </Field>
    <Field label="POLARITY" width="sm">
      <SearchableDropdown
        value={material.magneticClosurePolarity || ''}
        onChange={(selectedValue) => handleChange('magneticClosurePolarity', selectedValue)}
        options={['North/South Orientation (must be consistent for mating pairs)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('magneticClosurePolarity'))}
      />
    </Field>
    <Field label="APPLICATION" width="sm">
      <SearchableDropdown
        value={material.magneticClosureApplication || ''}
        onChange={(selectedValue) => handleChange('magneticClosureApplication', selectedValue)}
        options={['Hidden Closure', 'Quick-Attach Flap', 'Bag Closure', 'Garment Closure']}
        placeholder="Select or type"
        className={dropdownClass(hasError('magneticClosureApplication'))}
      />
    </Field>
    <Field label="ENCASING" width="sm">
      <SearchableDropdown
        value={material.magneticClosureEncasing || ''}
        onChange={(selectedValue) => handleChange('magneticClosureEncasing', selectedValue)}
        options={['PVC Covered', 'Fabric Covered', 'Metal Shell', 'Plastic Shell']}
        placeholder="Select or type"
        className={dropdownClass(hasError('magneticClosureEncasing'))}
      />
    </Field>
    <Field label="SHIELDING" width="sm">
      <SearchableDropdown
        value={material.magneticClosureShielding || ''}
        onChange={(selectedValue) => handleChange('magneticClosureShielding', selectedValue)}
        options={['Standard', 'RF-Shielded (if near RFID)']}
        placeholder="Select or type"
        className={dropdownClass(hasError('magneticClosureShielding'))}
      />
    </Field>
  </div>
);
