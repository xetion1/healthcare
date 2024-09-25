import { useState, useEffect } from "react";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Doctors } from "@/constants"; // Your list of stylists

// Pricing table for stylists and reasons
const pricingTable = {
  "Hair cutting": {
    "Stylist 1": 50,
    "Stylist 2": 60,
    "Stylist 3": 45,
  },
  "Hair coloring": {
    "Stylist 1": 100,
    "Stylist 2": 110,
    "Stylist 3": 90,
  },
  // Add more reasons and their corresponding prices for each stylist
};

export const AppointmentForm = ({
  userId,
  patientId,
  appointment,
  type,
  setOpen,
}) => {
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [price, setPrice] = useState<number | null>(null); // Track the price

  // Update price when both stylist and reason are selected
  useEffect(() => {
    if (selectedStylist && selectedReason) {
      const stylistPrice = pricingTable[selectedReason]?.[selectedStylist];
      if (stylistPrice) {
        setPrice(stylistPrice);
      } else {
        setPrice(null); // Reset price if the combination is invalid
      }
    }
  }, [selectedStylist, selectedReason]);

  return (
    <form className="space-y-6">
      {/* Stylist Selection */}
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={{}} // Add your form control here
        name="primaryPhysician"
        label="Select a stylist"
        placeholder="Select a stylist"
      >
        {Doctors.map((doctor, i) => (
          <SelectItem
            key={doctor.name + i}
            value={doctor.name}
            onClick={() => setSelectedStylist(doctor.name)}
          >
            <div className="flex cursor-pointer items-center gap-2">
              <img
                src={doctor.image}
                width={32}
                height={32}
                alt="stylist"
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      {/* Reason for Appointment */}
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={{}} // Add your form control here
        name="reason"
        label="Reason for appointment"
        placeholder="Select a reason"
      >
        {Object.keys(pricingTable).map((reason, i) => (
          <SelectItem
            key={reason + i}
            value={reason}
            onClick={() => setSelectedReason(reason)}
          >
            <p>{reason}</p>
          </SelectItem>
        ))}
      </CustomFormField>

      {/* Display Price */}
      {selectedStylist && selectedReason && price !== null && (
        <div className="price-display">
          <h3>
            Price for {selectedReason} with {selectedStylist}: ${price}
          </h3>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit">Submit Appointment</Button>
    </form>
  );
};
