"use client"

import { useForm } from 'react-hook-form';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from '../ui'
import { Professional } from '@/types';
import { toast } from "sonner"
import { v4 as uuid } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppointmentStore } from '@/store/appointment.store';
import { AppointmentFormSchema, AppointmentFormValues } from '@/validators';

interface Props {
  professional: Professional;
  date: string;
  from: string;
  to: string;
  open: boolean;
  onOpen: (open: boolean) => void;
}

export const AppointmentDialog = ({ professional, date, from, to, open, onOpen }: Props) => {
  const createAppointment = useAppointmentStore(state => state.createAppointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      patient_name: '',
      patient_email: '',
      patient_phone: '',
      notes: '',
    }
  });


  const handleSubmit = (values: AppointmentFormValues) => {
    const success = createAppointment(professional, {
      id: uuid(),
      date: date,
      from: from,
      to: to,
      patient_name: values.patient_name,
      professional_id: professional.id,
      professional_name: professional.name,
      notes: values.notes,
      patient_email: values.patient_email, // Handle potential empty string or undefined
      patient_phone: values.patient_phone,
      created_at: new Date(),
      updated_at: ''
    });
    if (success) {
      toast.success("Su turno ha sido creado con éxito")
      onOpen(false)
    } else {
      toast.error("No se pudo crear el turno")
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
                      <Input placeholder="Nota opcional..." {...field} />
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
