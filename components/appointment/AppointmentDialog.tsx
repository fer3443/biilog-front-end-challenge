"use client"

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from "sonner"
import { v4 as uuid } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui'
import { Appointment, Professional } from '@/types';
import { useAppointmentStore } from '@/store/appointment.store';
import { AppointmentFormSchema, AppointmentFormValues } from '@/validators';
import { Textarea } from '../ui/textarea';
import { canMoveAppointment } from '@/domain/availability';
import { generateSlots } from '@/domain/slots';
import { calculateTime } from '@/domain/time';

interface Props {
  professional: Professional;
  date: string;
  from: string;
  to: string;
  open: boolean;
  onOpen: (open: boolean) => void;
  appointment?: Appointment;
}

const timeSlots = generateSlots("08:00", "18:00");
const DEFAULT_DURATION = 30;

export const AppointmentDialog = ({ appointment, professional, date, from, to, open, onOpen }: Props) => {
  const isEdit = Boolean(appointment);
  const appointments = useAppointmentStore(state => state.appointments)
  const createAppointment = useAppointmentStore(state => state.createAppointment);
  const updateAppointment = useAppointmentStore(state => state.updateAppointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      patient_name: appointment?.patient_name || "",
      patient_email: appointment?.patient_email || "",
      patient_phone: appointment?.patient_phone || "",
      notes: appointment?.notes || "",
      from: appointment?.from || from,
      to: appointment?.to || to,
      date: appointment?.date || date,
      duration: appointment?.duration || DEFAULT_DURATION
    }
  });

  const fromValue = useWatch({ control: form.control, name: "from" });
  const duration = useWatch({ control: form.control, name: "duration" });

  useEffect(() => {
    if (open) {
      form.reset({
        patient_name: appointment?.patient_name || "",
        patient_email: appointment?.patient_email || "",
        patient_phone: appointment?.patient_phone || "",
        notes: appointment?.notes || "",
        from: appointment?.from || from,
        to: appointment?.to || to,
        date: appointment?.date || date,
        duration: appointment?.duration || DEFAULT_DURATION
      })
    }
  }, [appointment, open, form, from, to, date]);

  useEffect(() => {
    if (!fromValue || !duration) return;

    const newTo = calculateTime(fromValue, duration);
    form.setValue("to", newTo, { shouldValidate: true });

  }, [fromValue, duration, form]);

  const handleSubmit = (values: AppointmentFormValues) => {
    if (isEdit && appointment) {
      const result = canMoveAppointment(
        { ...appointment, ...values }, professional, values.date, values.from, appointments
      )

      if (!result.canMove) {
        toast.error(result.reason)
      } else {
        // updateAppointment({ ...appointment, ...values, updated_at: new Date() })
        updateAppointment(result.updatedAppointment!)
        toast.success("Su turno fue actualizado con éxito")
        onOpen(false)
      }
    } else {
      const success = createAppointment(professional, {
        id: uuid(),
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
          <div className='flex items-center justify-between'>
            <p><span className='font-semibold text-base'>{professional.name}</span></p>
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
              <div className='flex items-center gap-2'>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desde</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="hora" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Desde</SelectLabel>
                              {timeSlots.map((time, index) => (
                                <SelectItem value={time.from} key={`${time.from}-${index}`}>
                                  {time.from}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem className='w-24'>
                      <FormLabel>Hasta</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            <DialogFooter className='mt-4 flex items-center justify-between!'>
              {
                isEdit
                  ? <Button variant="ghost" type='button' onClick={() => onOpen(false)}>Eliminar</Button>
                  : <Button variant="outline" type='button' onClick={() => onOpen(false)}>Cancelar</Button>
              }
              <Button disabled={form.formState.isSubmitting} type="submit">{isEdit ? "Guardar cambios" : "Confirmar turno"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
