"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { paymentSettingsSchema } from "@/lib/validations/admin-settings";
import { currencyOptions } from "@/lib/mock/settings";
import percentageIcon from "@/public/icons/settings/percentage.svg";
import dollarIcon from "@/public/icons/settings/dollar.svg";

export default function PaymentSettingsForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentSettingsSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue, dirty }) => (
        <Form>
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src={percentageIcon}
                  alt="Transaction Fees"
                  className="h-[20px] w-[20px]"
                />
              </div>
              <h2 className="font-inter text-[16px] sm:text-[18px] font-bold text-primary">
                Transaction Fees
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Base Platform Fee */}
              <div>
                <label
                  htmlFor="baseFee"
                  className="block font-inter text-[14px] font-medium text-primary mb-2"
                >
                  Base Platform Fee (%)
                </label>
                <div className="relative">
                  <Image
                    src={percentageIcon}
                    alt=""
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] z-10 pointer-events-none"
                  />
                  <Field
                    id="baseFee"
                    name="baseFee"
                    type="number"
                    step="0.1"
                    className={`w-full pl-12 pr-12 py-2.5 bg-[#F8FAFC] border rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                      errors.baseFee && touched.baseFee
                        ? "border-red-500 focus:ring-red-200"
                        : "border-[#E5E7EB] focus:ring-[#3B82F6]"
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-inter text-[14px] text-[#64748B]">
                    %
                  </span>
                </div>
                <ErrorMessage
                  name="baseFee"
                  component="p"
                  className="font-inter text-[12px] text-red-500 mt-1"
                />
                {!errors.baseFee && (
                  <p className="font-inter text-[12px] text-[#94A3B8] mt-1">
                    Applied to all incoming transactions.
                  </p>
                )}
              </div>

              {/* Fixed Fee */}
              <div>
                <label
                  htmlFor="fixedFee"
                  className="block font-inter text-[14px] font-medium text-primary mb-2"
                >
                  Fixed Fee Per Transaction
                </label>
                <div className="relative">
                  <Image
                    src={dollarIcon}
                    alt=""
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] z-10 pointer-events-none"
                  />
                  <Field
                    id="fixedFee"
                    name="fixedFee"
                    type="number"
                    step="0.01"
                    className={`w-full pl-12 pr-4 py-2.5 bg-[#F8FAFC] border rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                      errors.fixedFee && touched.fixedFee
                        ? "border-red-500 focus:ring-red-200"
                        : "border-[#E5E7EB] focus:ring-[#3B82F6]"
                    }`}
                  />
                </div>
                <ErrorMessage
                  name="fixedFee"
                  component="p"
                  className="font-inter text-[12px] text-red-500 mt-1"
                />
                {!errors.fixedFee && (
                  <p className="font-inter text-[12px] text-[#94A3B8] mt-1">
                    Additional flat rate charge.
                  </p>
                )}
              </div>
            </div>

            {/* Default Currency */}
            <div className="mb-6">
              <label
                htmlFor="currency"
                className="block font-inter text-[14px] font-medium text-primary mb-2"
              >
                Default Currency
              </label>
              <div className="relative">
                <Field
                  as="select"
                  id="currency"
                  name="currency"
                  className={`appearance-none w-full px-4 py-2.5 bg-[#F8FAFC] border rounded-lg font-inter text-[14px] focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                    errors.currency && touched.currency
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#E5E7EB] focus:ring-[#3B82F6]"
                  }`}
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </Field>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                />
              </div>
              <ErrorMessage
                name="currency"
                component="p"
                className="font-inter text-[12px] text-red-500 mt-1"
              />
            </div>

            {/* Action Buttons */}
            {dirty && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg font-inter text-[14px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white border border-[#E5E7EB] text-primary rounded-lg font-inter text-[14px] font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}
