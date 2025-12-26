
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';

import { Appointment, Professional } from '@/types';
import { AppointmentFormSchema, AppointmentFormValues } from '@/validators';
import { generateSlots } from '@/domain/slots';
import { Button, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Textarea } from '../ui'
import { useAppointmentStore } from '@/store';
import { calculateTime, isInThePast } from '@/domain/time';
import { canCreateAppointment, canMoveAppointment } from '@/domain/availability';
import { toast } from 'sonner';
import { AlertDialogConfirmation } from './AlertDialogConfirmation';

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

export const AppointmentSheet = ({ appointment, professional, date, from, to, open, onOpen }: Props) => {
  const isEdit = Boolean(appointment);
  const appointments = useAppointmentStore(state => state.appointments)
  const createAppointment = useAppointmentStore(state => state.createAppointment);
  const updateAppointment = useAppointmentStore(state => state.updateAppointment);
  const isPast = isInThePast(date, from)


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
        appointment, professional, values.date, values.from, appointments
      )

      if (!result.canMove) {
        toast.error(result.reason)
      } else {
        updateAppointment({
          ...result.updatedAppointment!,
          patient_name: values.patient_name,
          patient_email: values.patient_email,
          patient_phone: values.patient_phone,
          notes: values.notes
        })
        toast.success("Su turno fue actualizado con éxito")
        onOpen(false)
      }
    } else {
      const newAppointment: Appointment = {
        id: uuid(),
        professional_id: professional.id,
        professional_name: professional.name,
        created_at: new Date(),
        updated_at: new Date(),
        ...values
      }

      const validation = canCreateAppointment(newAppointment, professional, appointments);

      if (!validation.canCreate) {
        toast.error(validation.reason);
        return;
      }

      const success = createAppointment(professional, newAppointment);
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
    <Sheet open={open} onOpenChange={onOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Modificar turno" : "Agendar turno"}
          </SheetTitle>
          <SheetDescription>
            <span className='font-semibold text-lg'>{professional.name}</span>
          </SheetDescription>
        </SheetHeader>
        <div className='p-4 space-y-2'>
          <div className='text-xs font-semibold'>
            Debe completar los siguientes campos.
            <br />
            <span className='font-light'>Datos obligatorios</span><span className='text-red-500'>*</span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-4 space-y-2">
                <div className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={isPast} {...field} />
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
                            disabled={isPast}
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
                        <Input disabled={isPast} placeholder="José Perez" {...field} />
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
                        <Input disabled={isPast} placeholder="jose@email.com" {...field} />
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
                        <Input disabled={isPast} placeholder="+541131234567" type='tel' maxLength={15} {...field} />
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
                        <Textarea disabled={isPast} maxLength={250} className='resize-none' placeholder="Nota opcional..." {...field} />
                      </FormControl>
                      <FormDescription className='text-xs'>Puede agregar una nota para detallar el motivo de la consulta.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <div className={`${isPast ? "hidden" : "mt-4 flex flex-col gap-6"} `}>
                <div className='flex justify-between items-center gap-x-4'>
                  <Button className='flex-1 cursor-pointer' variant="outline" type='button' onClick={() => onOpen(false)}>Cancelar</Button>
                  <Button className='flex-1 cursor-pointer' disabled={form.formState.isSubmitting} type="submit">{isEdit ? "Guardar cambios" : "Confirmar turno"}</Button>
                </div>
                {
                  appointment && (<div className='w-full'><AlertDialogConfirmation appointment={appointment} onClose={onOpen} /></div>)
                }
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
