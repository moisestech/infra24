"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, Suspense } from "react";
import { AnnouncementType, AnnouncementSubType } from "@/types/announcement";

const announcementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["urgent", "facility", "event", "opportunity", "administrative"]),
  subType: z.string().min(1, "Subtype is required"),
  description: z.string().min(10, "Description is required"),
  location: z.string().optional(),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

const subTypeOptions: Record<AnnouncementType, AnnouncementSubType[]> = {
  urgent: ["closure"],
  facility: ["maintenance"],
  event: ["exhibition", "workshop"],
  opportunity: ["open_call"],
  administrative: ["survey", "deadline", "reminder", "meeting", "critique"],
};

function CreateAnnouncementPageContent() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      type: "event",
      subType: "workshop",
    },
  });

  const type = watch("type");

  const onSubmit = async (data: AnnouncementForm) => {
    // Mock: just show success
    setSuccess(true);
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Create Announcement</h1>
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded">Announcement created! (mock)</div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-black/60 p-8 rounded-xl shadow">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            {...register("type")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
          >
            {Object.keys(subTypeOptions).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Subtype</label>
          <select
            {...register("subType")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
          >
            {subTypeOptions[type as AnnouncementType].map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          {errors.subType && <p className="text-red-500 text-sm mt-1">{errors.subType.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block font-semibold mb-1">Location</label>
          <input
            {...register("location")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Creating..." : "Create Announcement"}
        </button>
      </form>
    </div>
  );
}

export default function CreateAnnouncementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAnnouncementPageContent />
    </Suspense>
  );
} 