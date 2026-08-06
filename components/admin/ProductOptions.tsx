"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react"

export interface ProductOptionValue {
  id?: string
  value: string
  priceModifier: number
  isDefault: boolean
  isAvailable: boolean
  sortOrder: number
}

export interface ProductOption {
  id?: string
  name: string
  isRequired: boolean
  sortOrder: number
  values: ProductOptionValue[]
}

interface ProductOptionsProps {
  options: ProductOption[]
  onChange: (options: ProductOption[]) => void
}

export function ProductOptions({ options, onChange }: ProductOptionsProps) {
  const [expandedOption, setExpandedOption] = useState<number | null>(0)

  const addOption = () => {
    const newOption: ProductOption = {
      name: "",
      isRequired: true,
      sortOrder: options.length,
      values: [],
    }
    onChange([...options, newOption])
    setExpandedOption(options.length)
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    onChange(newOptions)
    if (expandedOption === index) {
      setExpandedOption(null)
    }
  }

  const updateOption = (index: number, updates: Partial<ProductOption>) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], ...updates }
    onChange(newOptions)
  }

  const addValue = (optionIndex: number) => {
    const newValue: ProductOptionValue = {
      value: "",
      priceModifier: 0,
      isDefault: options[optionIndex].values.length === 0,
      isAvailable: true,
      sortOrder: options[optionIndex].values.length,
    }
    const newOptions = [...options]
    newOptions[optionIndex].values = [...newOptions[optionIndex].values, newValue]
    onChange(newOptions)
  }

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...options]
    newOptions[optionIndex].values = newOptions[optionIndex].values.filter(
      (_, i) => i !== valueIndex
    )
    // If we removed the default, make the first one default
    if (newOptions[optionIndex].values.length > 0 && !newOptions[optionIndex].values.some(v => v.isDefault)) {
      newOptions[optionIndex].values[0].isDefault = true
    }
    onChange(newOptions)
  }

  const updateValue = (
    optionIndex: number,
    valueIndex: number,
    updates: Partial<ProductOptionValue>
  ) => {
    const newOptions = [...options]
    newOptions[optionIndex].values[valueIndex] = {
      ...newOptions[optionIndex].values[valueIndex],
      ...updates,
    }
    // If setting as default, unset others
    if (updates.isDefault) {
      newOptions[optionIndex].values.forEach((v, i) => {
        if (i !== valueIndex) v.isDefault = false
      })
    }
    onChange(newOptions)
  }

  return (
    <div className="space-y-4">
      {options.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">
            Ovaj proizvod nema opcija. Dodajte opcije ako kupac treba odabrati varijantu (npr. miris, boja).
          </p>
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            <Plus size={18} />
            Dodaj opciju
          </button>
        </div>
      ) : (
        <>
          {options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Option Header */}
              <div
                className="flex items-center gap-3 p-4 bg-gray-50 cursor-pointer"
                onClick={() =>
                  setExpandedOption(expandedOption === optionIndex ? null : optionIndex)
                }
              >
                <GripVertical size={18} className="text-gray-400" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      e.stopPropagation()
                      updateOption(optionIndex, { name: e.target.value })
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Naziv opcije (npr. Miris)"
                    className="w-full max-w-xs px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <label
                  className="flex items-center gap-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={option.isRequired}
                    onChange={(e) =>
                      updateOption(optionIndex, { isRequired: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-600">Obavezno</span>
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(optionIndex)
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
                {expandedOption === optionIndex ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>

              {/* Option Values */}
              {expandedOption === optionIndex && (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-500 mb-3">
                    Vrijednosti opcije (npr. Vanila, Limun, Ocean)
                  </p>

                  {option.values.map((value, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <GripVertical size={16} className="text-gray-400" />

                      {/* Value name */}
                      <input
                        type="text"
                        value={value.value}
                        onChange={(e) =>
                          updateValue(optionIndex, valueIndex, { value: e.target.value })
                        }
                        placeholder="Naziv vrijednosti"
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />

                      {/* Price modifier */}
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">+/-</span>
                        <input
                          type="number"
                          value={value.priceModifier}
                          onChange={(e) =>
                            updateValue(optionIndex, valueIndex, {
                              priceModifier: parseFloat(e.target.value) || 0,
                            })
                          }
                          step="0.01"
                          className="w-20 px-2 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-500">KM</span>
                      </div>

                      {/* Default checkbox */}
                      <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <input
                          type="radio"
                          name={`default-${optionIndex}`}
                          checked={value.isDefault}
                          onChange={() =>
                            updateValue(optionIndex, valueIndex, { isDefault: true })
                          }
                          className="w-4 h-4 border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-600">Default</span>
                      </label>

                      {/* Available checkbox */}
                      <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={value.isAvailable}
                          onChange={(e) =>
                            updateValue(optionIndex, valueIndex, {
                              isAvailable: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-600">Dostupno</span>
                      </label>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeValue(optionIndex, valueIndex)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addValue(optionIndex)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition font-medium"
                  >
                    <Plus size={16} />
                    Dodaj vrijednost
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition font-semibold border border-orange-200"
          >
            <Plus size={18} />
            Dodaj još jednu opciju
          </button>
        </>
      )}
    </div>
  )
}
