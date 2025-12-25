import React from 'react'

export const LoadingComponent = () => {
  return (
    <div className='min-h-dvh flex flex-col justify-center items-center'>
      <p className='text-2xl animate-pulse'>Cargando profesionales</p>
      <p className='text-lg animate-pulse'>Por favor espere</p>
    </div>
  )
}
