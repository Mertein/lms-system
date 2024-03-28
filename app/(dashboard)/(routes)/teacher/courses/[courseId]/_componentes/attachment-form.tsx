"use client";

import * as z from "zod";
import axios from "axios";
import { File, ImageIcon, Loader, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/app/(dashboard)/_componentes/file-upload";
import Image from "next/image";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}
const formSchema = z.object({
  url: z.string().url(),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEdit = () => setIsEditing(!isEditing);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Curso actualizado");
      router.refresh();
      toggleEdit();
    } catch {
      toast.error("Algo salio mal");
    }
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Archivo eliminado");
      router.refresh();
    } catch {
      toast.error("Algo salio mal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-slate-100 rounded-md p-4 mt-6">
      <div className="font-medium flex items-center justify-between">
        Curso Archivos
        <Button type="button" onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancelar</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar un archivo
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm italic text-slate-500 mt-2">
              No se han agregado archivos a este curso
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200  text-sky-700 rounded-md"
                  key={attachment.id}
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1 ">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Agrega cualquier archivo que pueda ser útil para que tus estudiantes
            finalicen el curso.
          </div>
        </div>
      )}
    </div>
  );
};
