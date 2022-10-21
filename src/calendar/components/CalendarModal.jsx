import { addHours, differenceInBusinessDays } from 'date-fns/esm'
import { useMemo, useState,useEffect} from 'react'
import DatePicker, {registerLocale}from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Modal from 'react-modal'
import es from 'date-fns/locale/es'
import { differenceInSeconds } from 'date-fns'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useCalendarStore, useUiStore } from '../../hooks'


registerLocale('es', es)


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  Modal.setAppElement('#root');

export const CalendarModal = () => {
    const { activeEvent,startSavingEvent } = useCalendarStore()

    const { isDateModalOpen, closeDateModal} = useUiStore()

    const [formSubmitted, setFormSubmitted] = useState(true)

    const [formValues, setFormValues] = useState({
        title: '',
        notes:'',
        start: new Date(),
        end: addHours(new Date(), 2),
    })
    const titleClass = useMemo(() =>{
        if(!formSubmitted){
            return ''
        }
        return (formValues.title.length > 0) ? '' : 'is-invalid'

    }, [formValues.title, formSubmitted])

    useEffect(() => {
        if(activeEvent!== null ){
            setFormValues({...activeEvent})
        }

    },[activeEvent])

    const onInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }
 
 

    const onDateChange = ( event, changing ) => {
        if(changing){
            setFormValues({
                ...formValues,
                [changing]: event
            })
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const difference = differenceInSeconds(formValues.end, formValues.start)


        if(isNaN(difference) || difference <= 0){
            Swal.fire({
                title: 'Error',
                text: 'La fecha de finalización debe ser mayor a la de inicio',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return
        }

        if(formValues.title.length <=0){
            alert('El titulo es requerido')

        }

       await startSavingEvent(formValues)   
        closeDateModal()
        setFormSubmitted(false)
    }




      
      const onCloseModal = () => {
        closeDateModal()
      }

  return (
        <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo "
        closeTimeoutMS={200}
        >
           <h1> Nuevo evento </h1>
            <hr />
    <form 
    onSubmit={onSubmit}
    className="container">

        <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker
                minDate={formValues.start}
                className='form-control'
                selected={formValues.start}
                onChange={(event) => onDateChange(event, 'start')}
                dateFormat='Pp'
                showTimeSelect
                locale={es}
                timeCaption="Hora"

            /> 
        </div>

        <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker
            minDate={formValues.start}
            className='form-control'     
            selected={formValues.end}
            onChange={(event) => onDateChange(event, 'end')}
            dateFormat='Pp'
            showTimeSelect
            locale={es}
            timeCaption="Hora"


                />
        </div>

        <hr />
        <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input
                onChange={onInputChange} 
                type="text" 
                className={`form-control ${titleClass}`}
                placeholder="Título del evento"
                name="title"
                autoComplete="off"
                value={formValues.title}
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
            <textarea 
                onChange={onInputChange}
                type="text" 
                className="form-control"
                placeholder="Notas"
                rows="5"
                name="notes"
                value={formValues.notes}
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
            type="submit"
            className="btn btn-outline-primary btn-block"
        >
            <i className="far fa-save"></i>
            <span> Guardar</span>
        </button>

    </form>
        </Modal>
  )
}
