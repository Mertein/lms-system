"use client";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import {
  Form,
  FormDescription,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

const CreatePage = () => {
  const formSchema = z.object({
    title: z
      .string()
      .min(1, {
        message: "El título es requerido",
      })
      .max(100, {
        message: "El título no puede tener más de 100 caracteres",
      }),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      if (response.status === 201) {
        toast.success("Curso creado exitosamente");
        router.push(`/teacher/courses/${response.data.id}`);
      }
    } catch {
      toast.error("Algo salio mal");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Nombre de tu Curso</h1>
        <p className="text-sm text-slate-600">
          Como te gustaría llamar a tu curso? No te preocupes, puedes cambiarlo
          después.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso Titulo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ejemplo: "Introducción a la programación"'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Que quieres enseñar en este curso?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="items-center flex gap-x-2">
              <Link href="/">
                <Button variant="ghost" type="button">
                  Cancelar
                </Button>
              </Link>
              <Button
                className=""
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
