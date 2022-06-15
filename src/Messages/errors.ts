import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { socket } from '../app'
import { Sockets } from '../types'

export const errorHandling  = () => {
    socket.on(Sockets.Errors, (error) => {
        console.log(error)
        Swal.fire({
            title: 'Error!',
            text: `Something went wrong ${error}`,
            icon: 'error',
            confirmButtonText: 'Cool'
          })
    })
}
