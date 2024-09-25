"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { getPatient } from "@/lib/actions/patient.actions";

// Patient component to fetch and display patient name
const PatientNameCell = ({ userId }: { userId: string }) => {
  const [patientName, setPatientName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await getPatient(userId);

        if (!patient) {
          setPatientName("Unknown");
        } else {
          setPatientName(patient.name || "N/A");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setPatientName("N/A");
      }
    };

    fetchPatient();
  }, [userId]);

  return <p className="text-14-medium">{patientName}</p>;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      const patientId = appointment.patient || appointment.userId;

      return <PatientNameCell userId={patientId} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Stylist",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="stylist"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">{doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
