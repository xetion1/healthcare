"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AppointmentOptions, Doctors } from "@/constants";
import { SelectItem } from "@/components/ui/select";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

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

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      stylist: appointment ? appointment.stylist : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  // State for dynamic pricing
  const [price, setPrice] = useState<number | null>(null);

  // Watch for changes in stylist and reason
  const selectedStylist = form.watch("stylist");
  const selectedReason = form.watch("reason");

  useEffect(() => {
    if (selectedStylist && selectedReason) {
      const stylist = Doctors.find((doc) => doc.name === selectedStylist);
      if (stylist && stylist.priceMap[selectedReason] !== undefined) {
        setPrice(stylist.priceMap[selectedReason]);
      } else {
        setPrice(null);
      }
    } else {
      setPrice(null);
    }
  }, [selectedStylist, selectedReason]);

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status: Status;
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
        const appointmentData = {
          userId,
          patient: patientId,
          stylist: values.stylist,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status,
          note: values.note,
          price,
        };

        const newAppointment = await createAppointment(appointmentData);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else if (appointment) {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment.$id,
          appointment: {
            stylist: values.stylist, // Updated to 'stylist'
            schedule: new Date(values.schedule),
            status,
            cancellationReason: values.cancellationReason,
            price,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
          router.refresh();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
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
            {/* Stylist Selection */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="stylist" // Updated to 'stylist'
              label="Select a Stylist"
              placeholder="Select a stylist"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            {/* Reason for Appointment */}
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="reason"
              label="Appointment Reason"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex flex-wrap gap-4"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {AppointmentOptions.map((option) => (
                      <div key={option} className="flex items-center">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="ml-2 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            {/* Display Price */}
            {price !== null && (
              <div className="animate-fadeIn mt-4 p-4 rounded bg-green-100 text-green-700">
                <h3 className="text-xl font-bold">
                  Price for {selectedReason} with {selectedStylist}: ${price}
                </h3>
              </div>
            )}

            {/* Schedule Picker */}
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
            />
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for Cancellation"
            placeholder="Provide a reason for cancellation"
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

export default AppointmentForm;
