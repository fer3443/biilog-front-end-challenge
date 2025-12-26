import { Appointment } from '@/types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui';
import { useAppointmentStore } from '@/store';
import { toast } from 'sonner';


interface Props {
  appointment: Appointment;
  onClose: (open: boolean) => void;
}

export const AlertDialogConfirmation = ({ appointment, onClose }: Props) => {
  const deleteAppointment = useAppointmentStore(state => state.deleteAppointment);

  const handleDelete = () => {
    const success = deleteAppointment(appointment.id)
    if (success) {
      toast.success("Turno eliminado con exito")
    }
    onClose(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className='w-full bg-red-500 hover:bg-red-400 rounded-md text-white px-2 py-1.5 cursor-pointer'>
        Eliminar
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¡Atención!</AlertDialogTitle>
          <AlertDialogDescription>
            Con esta acción el turno sera eliminado. ¿Está seguro?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
