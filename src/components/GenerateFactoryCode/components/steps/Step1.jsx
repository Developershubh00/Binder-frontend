import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PercentInput } from '@/components/ui/percent-input';
import { cn } from '@/lib/utils';

const Step1 = ({
  formData,
  errors,
  addComponent,
  removeComponent,
  handleComponentChange,
  handleComponentCuttingSizeChange,
  handleComponentSewSizeChange
}) => {
  const selectBaseClass =
    "border-input h-11 w-full min-w-0 rounded-md border bg-white text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="w-full">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-1">PART-1 CUT &amp; SEW SPEC</h2>
        <p className="text-sm text-muted-foreground">Enter cutting and sewing specifications for components</p>
      </div>

      {/* Components Section - Work with first product's components */}
      {formData.products && formData.products.length > 0 && formData.products[0] && (
        <div
          className="rounded-2xl border border-border bg-muted"
          style={{ padding: '24px 20px', marginBottom: '24px' }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h3 className="text-lg font-semibold text-foreground/90">Components</h3>
          </div>

          {/* Components List */}
          {formData.products[0].components.map((component, componentIndex) => (
              <div
                key={componentIndex}
                id={`component-0-${componentIndex}`}
                className="bg-card rounded-xl border border-border"
                style={{ padding: '20px 18px', marginBottom: '16px' }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                  <h4 className="text-sm font-semibold text-foreground/80">COMPONENT {component.srNo}</h4>
                  {formData.products[0].components.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeComponent(0, componentIndex)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {/* Component Details */}
                <div className="flex flex-wrap items-start gap-4" style={{ marginBottom: '20px' }}>
                  <Field
                    label="NAME"
                    required
                    error={errors[`product_0_component_${componentIndex}_productComforter`]}
                    width="sm"
                  >
                    <Input
                      type="text"
                      value={component.productComforter}
                      onChange={(e) => handleComponentChange(0, componentIndex, 'productComforter', e.target.value)}
                      placeholder="e.g., Top Panel"
                      aria-invalid={errors[`product_0_component_${componentIndex}_productComforter`] ? true : undefined}
                      required
                    />
                  </Field>

                  <Field
                    label="UNIT"
                    required
                    error={errors[`product_0_component_${componentIndex}_unit`]}
                    width="sm"
                  >
                    <select
                      value={component.unit}
                      onChange={(e) => handleComponentChange(0, componentIndex, 'unit', e.target.value)}
                      className={cn(
                        selectBaseClass,
                        errors[`product_0_component_${componentIndex}_unit`] && "aria-invalid border-destructive"
                      )}
                      style={{ paddingLeft: '1.25rem', paddingRight: '0.75rem' }}
                      aria-invalid={errors[`product_0_component_${componentIndex}_unit`] ? true : undefined}
                      required
                    >
                      <option value="">Select</option>
                      <option value="CM">CM</option>
                      <option value="KGS">KGS</option>
                    </select>
                  </Field>

                  <Field
                    label="GSM"
                    required
                    error={errors[`product_0_component_${componentIndex}_gsm`]}
                    width="sm"
                  >
                    <Input
                      type="number"
                      value={component.gsm || ''}
                      onChange={(e) => handleComponentChange(0, componentIndex, 'gsm', e.target.value)}
                      placeholder="e.g., 200"
                      aria-invalid={errors[`product_0_component_${componentIndex}_gsm`] ? true : undefined}
                      required
                    />
                  </Field>

                  <Field
                    label="WASTAGE %"
                    required
                    error={errors[`product_0_component_${componentIndex}_wastage`]}
                    width="sm"
                  >
                    <PercentInput
                      value={component.wastage || ''}
                      onChange={(e) => handleComponentChange(0, componentIndex, 'wastage', e.target.value)}
                      placeholder="e.g., 5"
                      error={errors[`product_0_component_${componentIndex}_wastage`]}
                      required
                    />
                  </Field>
                </div>

                {/* Cutting Size */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 className="text-sm font-semibold text-foreground/80" style={{ marginBottom: '12px' }}>
                    CUTTING SIZE
                  </h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {component.unit === 'KGS' ? (
                      <Field
                        label="CONSUMPTION"
                        required
                        error={errors[`product_0_component_${componentIndex}_cuttingConsumption`]}
                        width="sm"
                      >
                        <Input
                          type="number"
                          value={component.cuttingSize.consumption || ''}
                          onChange={(e) => handleComponentCuttingSizeChange(0, componentIndex, 'consumption', e.target.value)}
                          placeholder="e.g., 2.5"
                          aria-invalid={errors[`product_0_component_${componentIndex}_cuttingConsumption`] ? true : undefined}
                          required
                        />
                      </Field>
                    ) : (
                      <>
                        <Field
                          label="LENGTH"
                          required
                          error={errors[`product_0_component_${componentIndex}_cuttingLength`]}
                          width="sm"
                        >
                          <Input
                            type="number"
                            value={component.cuttingSize.length}
                            onChange={(e) => handleComponentCuttingSizeChange(0, componentIndex, 'length', e.target.value)}
                            placeholder="e.g., 24"
                            aria-invalid={errors[`product_0_component_${componentIndex}_cuttingLength`] ? true : undefined}
                            required
                          />
                        </Field>

                        <Field
                          label="WIDTH"
                          required
                          error={errors[`product_0_component_${componentIndex}_cuttingWidth`]}
                          width="sm"
                        >
                          <Input
                            type="number"
                            value={component.cuttingSize.width}
                            onChange={(e) => handleComponentCuttingSizeChange(0, componentIndex, 'width', e.target.value)}
                            placeholder="e.g., 18"
                            aria-invalid={errors[`product_0_component_${componentIndex}_cuttingWidth`] ? true : undefined}
                            required
                          />
                        </Field>
                      </>
                    )}
                  </div>
                </div>

                {/* Sew Size */}
                <div style={{ marginTop: '8px' }}>
                  <h4 className="text-sm font-semibold text-foreground/80" style={{ marginBottom: '12px' }}>
                    SEW SIZE
                  </h4>
                  <div className="flex flex-wrap items-start gap-4">
                    {component.unit === 'KGS' ? (
                      <Field
                        label="CONSUMPTION"
                        required
                        error={errors[`product_0_component_${componentIndex}_sewConsumption`]}
                        width="sm"
                      >
                        <Input
                          type="number"
                          value={component.sewSize.consumption || ''}
                          onChange={(e) => handleComponentSewSizeChange(0, componentIndex, 'consumption', e.target.value)}
                          placeholder="e.g., 2.3"
                          aria-invalid={errors[`product_0_component_${componentIndex}_sewConsumption`] ? true : undefined}
                          required
                        />
                      </Field>
                    ) : (
                      <>
                        <Field
                          label="LENGTH"
                          required
                          error={errors[`product_0_component_${componentIndex}_sewLength`]}
                          width="sm"
                        >
                          <Input
                            type="number"
                            value={component.sewSize.length}
                            onChange={(e) => handleComponentSewSizeChange(0, componentIndex, 'length', e.target.value)}
                            placeholder="e.g., 22"
                            aria-invalid={errors[`product_0_component_${componentIndex}_sewLength`] ? true : undefined}
                            required
                          />
                        </Field>

                        <Field
                          label="WIDTH"
                          required
                          error={errors[`product_0_component_${componentIndex}_sewWidth`]}
                          width="sm"
                        >
                          <Input
                            type="number"
                            value={component.sewSize.width}
                            onChange={(e) => handleComponentSewSizeChange(0, componentIndex, 'width', e.target.value)}
                            placeholder="e.g., 16"
                            aria-invalid={errors[`product_0_component_${componentIndex}_sewWidth`] ? true : undefined}
                            required
                          />
                        </Field>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {/* Add Component Button */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button
              type="button"
              onClick={() => {
                const currentLength = formData.products[0]?.components?.length || 0;
                addComponent(0);
                const newIndex = currentLength;
                setTimeout(() => {
                  const element = document.getElementById(`component-0-${newIndex}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
              variant="outline"
            >
              Add Component
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;
