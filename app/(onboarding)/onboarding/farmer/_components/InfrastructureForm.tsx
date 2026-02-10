"use client";

import { Droplets, Tractor, AlertCircle, Check, CloudRain, Toolbox } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FarmerOnboardingInput } from "@/lib/validations/onboarding";
import { motion } from "framer-motion";

interface InfrastructureFormProps {
  form: UseFormReturn<FarmerOnboardingInput>;
}

export function InfrastructureForm({ form }: InfrastructureFormProps) {
  const {watch, setValue, formState: { errors } } = form;

  const irrigationNeeded = watch("irrigationNeeded");
  const equipmentAccess = watch("equipmentAccess");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl mb-5">
          <Droplets className="h-9 w-9 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Infrastructure & Equipment
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Tell us about your irrigation and equipment requirements
        </p>
      </div>

      {/* Irrigation Section */}
      <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <CloudRain className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Irrigation Facilities</h3>
            <p className="text-sm text-gray-600">Do you need irrigation on the land?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("irrigationNeeded", true)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 ${
              irrigationNeeded === true
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              irrigationNeeded === true ? 'bg-emerald-500' : 'bg-gray-100'
            }`}>
              <Droplets className={`h-7 w-7 ${
                irrigationNeeded === true ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Yes, I need irrigation</div>
              <div className="text-sm text-gray-600 mt-1">Require water facilities on site</div>
            </div>
            {irrigationNeeded === true && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setValue("irrigationNeeded", false)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 ${
              irrigationNeeded === false
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              irrigationNeeded === false ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <CloudRain className={`h-7 w-7 ${
                irrigationNeeded === false ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">No, I have my own</div>
              <div className="text-sm text-gray-600 mt-1">Self-sufficient irrigation system</div>
            </div>
            {irrigationNeeded === false && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </button>
        </div>

        {errors.irrigationNeeded && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.irrigationNeeded.message}
          </div>
        )}
      </div>

      {/* Equipment Section */}
      <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
            <Toolbox className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Farming Equipment</h3>
            <p className="text-sm text-gray-600">Do you have access to equipment?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("equipmentAccess", true)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 ${
              equipmentAccess === true
                ? 'border-amber-500 bg-amber-50 shadow-sm'
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              equipmentAccess === true ? 'bg-amber-500' : 'bg-gray-100'
            }`}>
              <Tractor className={`h-7 w-7 ${
                equipmentAccess === true ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Yes, I have equipment</div>
              <div className="text-sm text-gray-600 mt-1">Own or can access farming tools</div>
            </div>
            {equipmentAccess === true && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setValue("equipmentAccess", false)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-4 ${
              equipmentAccess === false
                ? 'border-purple-500 bg-purple-50 shadow-sm'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              equipmentAccess === false ? 'bg-purple-500' : 'bg-gray-100'
            }`}>
              <Toolbox className={`h-7 w-7 ${
                equipmentAccess === false ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Need equipment access</div>
              <div className="text-sm text-gray-600 mt-1">Require machinery and tools</div>
            </div>
            {equipmentAccess === false && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </button>
        </div>

        {errors.equipmentAccess && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {errors.equipmentAccess.message}
          </div>
        )}
      </div>

      {/* Support Note */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Tractor className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">We Can Help!</h4>
            <p className="text-sm text-gray-600">
              If you need equipment access, we partner with local equipment rental services 
              and can help you get subsidized rates on farming machinery.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}