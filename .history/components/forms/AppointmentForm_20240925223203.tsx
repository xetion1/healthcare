// components/forms/AppointmentForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AppointmentOptions,
  Barbers,
  Locations,
  DaysOfWeek,
} from "@/constants";
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
      location: "",
      barber: appointment ? appointment?.barber : "",
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

  // Watch for changes in location, barber, and reason
  const selectedLocation = form.watch("location");
  const selectedBarber = form.watch("barber");
  const selectedReason = form.watch("reason");
  const selectedDate: Date = form.watch("schedule");

  // Filter available barbers based on selected location
  const availableBarbers = Barbers.filter((barber) =>
    barber.locations.includes(selectedLocation)
  );

  // Filter available dates based on barber's schedule
  const isDateAvailable = (date: Date) => {
    if (!selectedBarber || !selectedLocation) return false;
    const barber = Barbers.find((b) => b.name === selectedBarber);
    if (!barber) return false;

    const dayName = DaysOfWeek[date.getDay()];
    const barberSchedule = barber.schedule[selectedLocation] || [];
    return barberSchedule.includes(dayName);
  };

  useEffect(() => {
    if (selectedBarber && selectedReason) {
      const barber = Barbers.find((b) => b.name === selectedBarber);
      if (barber && barber.priceMap[selectedReason] !== undefined) {
        setPrice(barber.priceMap[selectedReason]);
      } else {
        setPrice(null);
      }
    } else {
      setPrice(null);
    }
  }, [selectedBarber, selectedReason]);

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
          location: values.location,
          barber: values.barber,
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
            location: values.location,
            barber: values.barber,
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-6 p-4"
      >
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="text-2xl font-bold">New Appointment</h1>
            <p className="text-gray-700">
              Book your appointment in just a few steps.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            {/* Location Selection */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="location"
              label="Select a Location"
              placeholder="Select a location"
            >
              {Locations.map((location) => (
                <SelectItem key={location.name} value={location.name}>
                  <p>{location.name}</p>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* Barber Selection */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="barber"
              label="Select a Barber"
              placeholder="Select a barber"
            >
              {availableBarbers.map((barber) => (
                <SelectItem key={barber.name} value={barber.name}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-500"
                    />
                    <p>{barber.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* Reason for Appointment */}
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="reason"
              label="Select a Service"
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
              <div className="animate-fadeIn mt-4 p-4 rounded border border-green-500 bg-green-100 text-green-700">
                <h3 className="text-xl font-bold">
                  Price for {selectedReason} with {selectedBarber}: €{price}
                </h3>
              </div>
            )}

            {/* Schedule Picker */}
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Select Date and Time"
              showTimeSelect
              dateFormat="MM/dd/yyyy h:mm aa"
              filterDate={isDateAvailable}
              placeholder="Select a date and time"
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
            type === "cancel"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } w-full text-white py-2 rounded transition duration-150`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
