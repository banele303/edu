import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "School name is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  motto: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function GeneralSettings() {
  const settings = useQuery(api.schoolSettings.getSettings);
  const updateSettings = useMutation(api.schoolSettings.updateSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      motto: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        motto: settings.motto || "",
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        id: settings?._id,
        ...data,
      });
      toast.success("School settings updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (settings === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Settings</h1>
        <p className="text-muted-foreground">Manage your school's public profile and contact information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>This information will appear on reports and certificates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <CustomInput
                    control={form.control}
                    name="name"
                    label="School Name"
                    placeholder="e.g. Springfield High School"
                  />
                </div>
                <div className="col-span-2">
                  <CustomInput
                    control={form.control}
                    name="motto"
                    label="School Motto"
                    placeholder="e.g. Excellence Through Faith"
                  />
                </div>
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Official Email"
                  placeholder="info@school.edu"
                />
                <CustomInput
                  control={form.control}
                  name="phone"
                  label="Contact Phone"
                  placeholder="+27..."
                />
                <div className="col-span-2">
                  <CustomInput
                    control={form.control}
                    name="address"
                    label="Physical Address"
                    placeholder="123 School St, Cape Town..."
                  />
                </div>
              </div>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
