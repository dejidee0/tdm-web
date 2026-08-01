import * as Yup from "yup";

import { CONSULTATION_TYPES, PROPERTY_TYPES } from "@/lib/api/consultations";

const TYPE_IDS = CONSULTATION_TYPES.map((type) => type.id);

/** Local midnight today — a booking for later *today* is still valid. */
function startOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/**
 * Nigerian mobile numbers, the three forms people actually type:
 *   0803 123 4567 · +234 803 123 4567 · 234 803 123 4567
 * Spaces, dashes and brackets are stripped before the test, so the user is
 * never told off for formatting their own phone number.
 */
const PHONE_PATTERN = /^(\+?234|0)[789][01]\d{8}$/;

/**
 * Consultation booking.
 *
 * Step 1 (type + property) and step 2 (contact + location + schedule) are
 * validated by the same schema — Formik owns the whole form and the stepper
 * only gates which fields are *visible*. Validating per-step against separate
 * schemas is how a required field ends up unreachable behind a step the user
 * never revisits.
 */
export const consultationSchema = Yup.object().shape({
  // An array, not a string: a client booking a site inspection who also wants
  // their existing quotation picked apart is one session with two agenda items,
  // and making them book twice to say so is a tax on the customer we most want.
  // No upper bound — five selections is a large job, not a mistake to prevent.
  consultationTypes: Yup.array()
    .of(Yup.string().oneOf(TYPE_IDS, "Choose from the available consultation types"))
    .min(1, "Select at least one consultation type")
    .required("Select at least one consultation type"),

  propertyType: Yup.string()
    .oneOf(PROPERTY_TYPES, "Choose one of the listed property types")
    .required("Select your property type"),

  contactName: Yup.string()
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Name cannot exceed 100 characters")
    .required("Full name is required"),

  contactEmail: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  contactPhone: Yup.string()
    .transform((value) =>
      typeof value === "string" ? value.replace(/[\s()-]/g, "") : value,
    )
    .matches(PHONE_PATTERN, "Enter a valid Nigerian phone number")
    .required("Phone number is required"),

  siteAddress: Yup.string()
    .trim()
    .min(5, "Enter the street address")
    .max(250, "Address cannot exceed 250 characters")
    .required("Project location is required"),

  siteCity: Yup.string()
    .trim()
    .min(2, "Enter the city or area")
    .max(80, "City cannot exceed 80 characters")
    .required("City is required"),

  siteState: Yup.string().trim().required("State is required"),

  preferredDate1: Yup.date()
    .typeError("Choose a date")
    .min(startOfToday(), "Choose today or a later date")
    .required("Choose your preferred date"),

  preferredTime1: Yup.string().required("Choose your preferred time"),

  // An alternative slot is optional, but if a date is given the time must be
  // too — a bare date would silently book 09:00 the user never chose.
  preferredDate2: Yup.date()
    .typeError("Choose a date")
    .min(startOfToday(), "Choose today or a later date")
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  preferredTime2: Yup.string().when("preferredDate2", {
    is: (value) => !!value,
    then: (schema) => schema.required("Choose a time for your alternative date"),
    otherwise: (schema) => schema.nullable(),
  }),

  projectDescription: Yup.string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .required("Describe what you would like to do"),

  uploadedFileUrls: Yup.array().of(Yup.string()),
});
