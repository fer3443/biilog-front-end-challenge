"use client"

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner"
import { v4 as uuid } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '../ui'
import { Appointment, Professional } from '@/types';
import { useAppointmentStore } from '@/store/appointment.store';
import { AppointmentFormSchema, AppointmentFormValues } from '@/validators';
import { Textarea } from '../ui/textarea';

interface Props {
  appointment?: Appointment;
  professional: Professional;
  date: string;
  from: string;
  to: string;
  open: boolean;
  onOpen: (open: boolean) => void;
}

export const AppointmentDialog = ({ appointment, professional, date, from, to, open, onOpen }: Props) => {
  const isEdit = Boolean(appointment);
  const createAppointment = useAppointmentStore(state => state.createAppointment);
  const updateAppointment = useAppointmentStore(state => state.updateAppointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      patient_name: appointment?.patient_name || "",
      patient_email: appointment?.patient_email || "",
      patient_phone: appointment?.patient_phone || "",
      notes: appointment?.notes || ""
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        patient_name: appointment?.patient_name || "",
        patient_email: appointment?.patient_email || "",
        patient_phone: appointment?.patient_phone || "",
        notes: appointment?.notes || ""
      })
    }
  }, [appointment, open, form])

  const handleSubmit = (values: AppointmentFormValues) => {
    if (isEdit && appointment) {
      const success = updateAppointment(professional, {
        ...appointment,
        ...values,
        date: date,
        from: from,
        to: to,
        updated_at: new Date()
      })

      if (success) {
        toast.success("Su turno fue actualizado con éxito")
        onOpen(false)
      } else {
        toast.error("No se pudo actualizar el turno")
      }
    } else {
      const success = createAppointment(professional, {
        id: uuid(),
        date: date,
        from: from,
        to: to,
        professional_id: professional.id,
        professional_name: professional.name,
        created_at: new Date(),
        ...values
      });
      if (success) {
        form.reset()
        toast.success("Su turno ha sido creado con éxito")
        onOpen(false)
      } else {
        toast.error("No se pudo crear el turno")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className='space-y-2'>
          <DialogTitle>Agendar un turno</DialogTitle>
          <div className='flex items-center justify-between text-sm'>
            <p><span className='font-semibold'>{professional.name}</span></p>
            <p>Turno desde: <span className='font-semibold'>{from}</span> hasta: <span className='font-semibold'>{to}</span></p>
          </div>
          <DialogDescription className='text-xs font-semibold'>
            Debe completar los siguientes campos.
            <br />
            <span className='font-light'>Datos obligatorios</span><span className='text-red-500'>*</span>

          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="patient_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo<span className='text-xs text-red-500'>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="José Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patient_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="jose@email.com" {...field} />
                    </FormControl>
                    <FormDescription className='text-xs'>Enviaremos la confirmacion por correo electrónico.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patient_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+541131234567" {...field} />
                    </FormControl>
                    <FormDescription className='text-xs'>Ante cualquier cambio será informado por teléfono</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de consulta</FormLabel>
                    <FormControl>
                      <Textarea className='resize' placeholder="Nota opcional..." {...field} />
                    </FormControl>
                    <FormDescription className='text-xs'>Puede agregar una nota para detallar el motivo de la consulta.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <DialogFooter className='mt-4'>
              <Button variant="outline" type='button' onClick={() => onOpen(false)}>Cancelar</Button>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
