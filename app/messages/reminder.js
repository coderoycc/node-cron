import { requestSendMessageReminder } from './sendMessage.js';
import { updateMessageReminder } from '../db/db-mssql.js';

export async function listenReminder(dataReminder, current) {
  console.log('[LISTEN REMINDER]', current)
  try {
    if (dataReminder.has(current.hour)) {
      console.log('[SEND MESSAGE REMINDER] Hay mensajes en la hora', current.hour)
      let keyTmp = current.hour;
      for (let obj of dataReminder.get(current.hour)) {
        let res = await requestSendMessageReminder(obj.celular, obj.mensaje);
        console.log(res)
        if (res.status == 'success') {
          console.log('[Mensaje enviado]=>',obj.celular)
          await updateMessageReminder(obj.idRecordatorio);
        } else {
          throw new Error('Ocurrio un error al enviar el mensaje (peticion)')
        }
      }
      dataReminder.delete(keyTmp);
    } else {
      console.log('[SEND MESSAGE REMINDER] No hay mensajes en la hora', current.hour)
    }
  } catch (error) {
    console.log('[ERROR LISTEN REMINDER]',error)
  }
}
