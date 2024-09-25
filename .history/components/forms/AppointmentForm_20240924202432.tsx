"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppointmentOptions } from "@/constants";
import { SelectItem } from "@/components/ui/select";
import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

// Updated price matrix with the correct stylist names
const priceMatrix = {
  Greta: {
    "Hair cutting": 25,
    "Hair coloring": 60,
    "Beard cutting": 18,
  },
  Dovilė: {
    "Hair cutting": 30,
    "Hair coloring": 55,
    "Beard cutting": 20,
  },
  Herkus: {
    "Hair cutting": 22,
    "Hair coloring": 65,
    "Beard cutting": 17,
  },
  Mindaugas: {
    "Hair cutting": 28,
    "Hair coloring": 70,
    "Beard cutting": 19,
  },
};

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null); // Track selected price
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null); // Track selected stylist
  const [selectedReason, setSelectedReason] = useState<string | null>(null); // Track selected reason

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Function to calculate price based on stylist and reason
  const updatePrice = (stylist: string | null, reason: string | null) => {
    console.log("Stylist:", stylist); // Debug: Check if stylist is being passed correctly
    console.log("Reason:", reason); // Debug: Check if reason is being passed correctly
    if (stylist && reason && priceMatrix[stylist]) {
      const price = priceMatrix[stylist][reason];
      console.log("Price found:", price); // Debug: See if price is found
      setSelectedPrice(price || null);
    } else {
      setSelectedPrice(null);
    }
  };

  // Handle stylist change
  const handleStylistChange = (stylist: string) => {
    setSelectedStylist(stylist);
    form.setValue("primaryPhysician", stylist);
    updatePrice(stylist, selectedReason); // Update price when stylist changes
  };

  // Handle reason change
  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    form.setValue("reason", reason);
    updatePrice(selectedStylist, reason); // Update price when reason changes
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Appointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Stylist"
              placeholder="Select a stylist"
            >
              {Doctors.map((doctor, i) => (
                <SelectItem
                  key={doctor.name + i}
                  value={doctor.name}
                  onClick={() => handleStylistChange(doctor.name)}
                >
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${
                type === "create" && "xl:flex-row"
              }`}
            >
              <CustomFormField
                fieldType={FormFieldType.SKELETON} // Use SKELETON to render custom content
                control={form.control}
                name="reason"
                label="Appointment reason"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={handleReasonChange} // Update on reason change
                      defaultValue={field.value}
                    >
                      {AppointmentOptions.map((option, i) => (
                        <div key={option + i} className="radio-group">
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
                disabled={type === "schedule"}
              />
            </div>

            {selectedPrice !== null ? (
              <div className="mt-4">
                <p className="text-dark-700">Price: ${selectedPrice}</p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-dark-700">
                  Please select both a stylist and a reason to see the price.
                </p>
              </div>
            )}
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
